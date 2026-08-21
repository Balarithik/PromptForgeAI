from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Avg, Count, Sum
from django.utils.text import slugify

from django.http import JsonResponse,HttpResponse

from .models import PromptTemplate, TemplateVersion, Article, ArticleEvaluation, GenerationLog
from .serializers import (
    UserSerializer, UserRegisterSerializer,
    PromptTemplateSerializer, TemplateVersionSerializer,
    ArticleSerializer, ArticleEvaluationSerializer, GenerationLogSerializer,
    ArticleGenerateRequestSerializer, AIEditRequestSerializer
)
from .prompt_engine import PromptEngine
from .ai_services import AIService

def falseroute(request):
    return HttpResponse("This is not the site you are looking for")
# Authentication Endpoints
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_current_user(request):
    if request.user.is_authenticated:
        return Response(UserSerializer(request.user).data)
    return Response({'username': 'Guest User', 'is_anonymous': True})


# Prompt Template ViewSet
class PromptTemplateViewSet(viewsets.ModelViewSet):
    queryset = PromptTemplate.objects.filter(is_active=True)
    serializer_class = PromptTemplateSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        if category and category != 'all':
            qs = qs.filter(category=category)
        return qs

    def perform_create(self, serializer):
        name = serializer.validated_data.get('name')
        slug = slugify(name)
        template = serializer.save(slug=slug)
        # Create version 1 record
        TemplateVersion.objects.create(
            template=template,
            version=1,
            system_prompt=template.system_prompt,
            user_prompt_template=template.user_prompt_template,
            variables=template.variables,
            changelog='Initial release'
        )

    def perform_update(self, serializer):
        instance = self.get_object()
        new_version = instance.version + 1
        template = serializer.save(version=new_version)
        TemplateVersion.objects.create(
            template=template,
            version=new_version,
            system_prompt=template.system_prompt,
            user_prompt_template=template.user_prompt_template,
            variables=template.variables,
            changelog=f'Updated to version {new_version}'
        )


# Article & Generation ViewSet
class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.is_authenticated:
            qs = qs.filter(user=self.request.user)
        return qs

    @action(detail=False, methods=['post'], url_path='generate')
    def generate(self, request):
        req_serializer = ArticleGenerateRequestSerializer(data=request.data)
        if not req_serializer.is_valid():
            return Response(req_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = req_serializer.validated_data
        template_id = data.get('template_id')
        topic = data['topic']
        target_audience = data['target_audience']
        tone = data['tone']
        language = data['language']
        target_length = data['target_length']
        pipeline_mode = data['pipeline_mode']

        # Retrieve template or default fallback
        template = None
        if template_id:
            try:
                template = PromptTemplate.objects.get(id=template_id)
            except PromptTemplate.DoesNotExist:
                pass

        if not template:
            template = PromptTemplate.objects.filter(is_default=True).first()

        # Render prompts using PromptEngine
        system_prompt, user_prompt = PromptEngine.format_full_prompt(template, data)

        article_title = f"{template.name if template else 'Article'}: {topic}"
        outline = ""
        content = ""
        duration_total = 0

        if pipeline_mode == 'multi_stage':
            # STAGE 1: Outline
            outline = AIService.generate_outline(topic, target_audience, tone, language, template.name if template else "Article")

            # STAGE 2: Draft from outline
            content, dur = AIService.generate_article_from_outline(
                outline, topic, target_audience, tone, language, target_length, system_prompt, user_prompt
            )
            duration_total += dur

            # STAGE 3: Evaluation
            eval_data = AIService.evaluate_article(content, topic, target_audience, tone)

            # STAGE 4: Self-Improvement if overall score < 85
            if eval_data.get('overall_score', 0) < 85:
                content = AIService.refine_article(content, eval_data, topic, target_audience)
                # Re-evaluate post refinement
                eval_data = AIService.evaluate_article(content, topic, target_audience, tone)
        else:
            # DIRECT GENERATION
            content, dur = AIService.generate_direct_article(
                system_prompt, user_prompt, topic, target_audience, tone, language, target_length
            )
            duration_total += dur
            eval_data = AIService.evaluate_article(content, topic, target_audience, tone)

        # Extract title from content if first line is H1 # Title
        first_line = content.strip().split('\n')[0]
        if first_line.startswith('# '):
            article_title = first_line.replace('# ', '').strip()

        user = request.user if request.user.is_authenticated else None

        # Create Article object
        article = Article.objects.create(
            user=user,
            template=template,
            title=article_title,
            topic=topic,
            target_audience=target_audience,
            tone=tone,
            language=language,
            target_length=target_length,
            variables_values=data.get('variables_values', {}),
            outline=outline,
            content=content,
            status='completed',
            generation_pipeline_used=pipeline_mode
        )

        # Create ArticleEvaluation object
        ArticleEvaluation.objects.create(
            article=article,
            relevance_score=eval_data.get('relevance_score', 85),
            structure_score=eval_data.get('structure_score', 85),
            readability_score=eval_data.get('readability_score', 85),
            completeness_score=eval_data.get('completeness_score', 85),
            seo_score=eval_data.get('seo_score', 85),
            overall_score=eval_data.get('overall_score', 85),
            feedback_json=eval_data
        )

        # Log generation
        GenerationLog.objects.create(
            article=article,
            action_type=f'generate_{pipeline_mode}',
            prompt_used=user_prompt,
            system_prompt_used=system_prompt,
            model_name=AIService.MODEL_CANDIDATES[0],
            tokens_used=len(content.split()) * 4,
            duration_ms=duration_total
        )

        serializer = ArticleSerializer(article)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='ai-edit')
    def ai_edit(self, request, pk=None):
        article = self.get_object()
        serializer = AIEditRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        action_type = serializer.validated_data['action_type']
        selected_text = serializer.validated_data.get('selected_text', '').strip()
        custom_prompt = serializer.validated_data.get('custom_prompt', '')

        target_content = selected_text if selected_text else article.content

        updated_text, dur = AIService.perform_ai_edit_action(target_content, action_type, custom_prompt)

        if selected_text and selected_text in article.content:
            new_article_content = article.content.replace(selected_text, updated_text, 1)
        else:
            new_article_content = updated_text

        article.content = new_article_content
        article.save()

        # Update evaluation
        eval_data = AIService.evaluate_article(article.content, article.topic, article.target_audience, article.tone)
        if hasattr(article, 'evaluation'):
            eval_obj = article.evaluation
            eval_obj.relevance_score = eval_data.get('relevance_score', 85)
            eval_obj.structure_score = eval_data.get('structure_score', 85)
            eval_obj.readability_score = eval_data.get('readability_score', 85)
            eval_obj.completeness_score = eval_data.get('completeness_score', 85)
            eval_obj.seo_score = eval_data.get('seo_score', 85)
            eval_obj.overall_score = eval_data.get('overall_score', 85)
            eval_obj.feedback_json = eval_data
            eval_obj.save()

        # Log edit action
        GenerationLog.objects.create(
            article=article,
            action_type=f'edit_{action_type}',
            prompt_used=f"Action: {action_type} | Custom: {custom_prompt}",
            system_prompt_used="AI Inline Editing Engine",
            model_name=AIService.MODEL_CANDIDATES[0],
            tokens_used=len(updated_text.split()) * 4,
            duration_ms=dur
        )

        return Response({
            'article': ArticleSerializer(article).data,
            'updated_snippet': updated_text,
            'action_performed': action_type
        })

    @action(detail=True, methods=['post'], url_path='evaluate')
    def re_evaluate(self, request, pk=None):
        article = self.get_object()
        eval_data = AIService.evaluate_article(article.content, article.topic, article.target_audience, article.tone)
        
        eval_obj, created = ArticleEvaluation.objects.get_or_create(article=article)
        eval_obj.relevance_score = eval_data.get('relevance_score', 85)
        eval_obj.structure_score = eval_data.get('structure_score', 85)
        eval_obj.readability_score = eval_data.get('readability_score', 85)
        eval_obj.completeness_score = eval_data.get('completeness_score', 85)
        eval_obj.seo_score = eval_data.get('seo_score', 85)
        eval_obj.overall_score = eval_data.get('overall_score', 85)
        eval_obj.feedback_json = eval_data
        eval_obj.save()

        return Response(ArticleEvaluationSerializer(eval_obj).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_stats(request):
    articles = Article.objects.all()
    if request.user.is_authenticated:
        articles = articles.filter(user=request.user)

    total_articles = articles.count()
    avg_score = ArticleEvaluation.objects.aggregate(Avg('overall_score'))['overall_score__avg'] or 88.5
    total_templates = PromptTemplate.objects.filter(is_active=True).count()
    
    # Calculate total words across articles
    all_content = " ".join(articles.values_list('content', flat=True))
    total_words = len(all_content.split()) if all_content else 0

    recent_articles = ArticleSerializer(articles[:5], many=True).data

    return Response({
        'total_articles': total_articles,
        'avg_quality_score': round(avg_score, 1),
        'active_templates': total_templates,
        'total_words_generated': total_words,
        'recent_articles': recent_articles
    })



def _checkAPIStatus_(request):
    status, result = AIService.API_STATUS()
    if status:
        print(f"API connection status Online {result}")
        return JsonResponse({"status": "online", "message": result})
    else:
        print(f"API connection status {status} an error '{result}'")
        return JsonResponse({"status": "offline", "error": result})