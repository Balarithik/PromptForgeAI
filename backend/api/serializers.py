from rest_framework import serializers
from django.contrib.auth.models import User
from .models import PromptTemplate, TemplateVersion, Article, ArticleEvaluation, GenerationLog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class TemplateVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateVersion
        fields = ['id', 'version', 'system_prompt', 'user_prompt_template', 'variables', 'changelog', 'created_at']


class PromptTemplateSerializer(serializers.ModelSerializer):
    version_history = TemplateVersionSerializer(many=True, read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = PromptTemplate
        fields = [
            'id', 'name', 'slug', 'description', 'category', 'category_display',
            'system_prompt', 'user_prompt_template', 'variables', 'version',
            'is_default', 'is_active', 'version_history', 'created_at', 'updated_at'
        ]


class ArticleEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleEvaluation
        fields = [
            'id', 'relevance_score', 'structure_score', 'readability_score',
            'completeness_score', 'seo_score', 'overall_score', 'feedback_json', 'created_at'
        ]


class GenerationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = GenerationLog
        fields = ['id', 'action_type', 'prompt_used', 'system_prompt_used', 'model_name', 'tokens_used', 'duration_ms', 'created_at']


class ArticleSerializer(serializers.ModelSerializer):
    evaluation = ArticleEvaluationSerializer(read_only=True)
    template_name = serializers.CharField(source='template.name', read_only=True, default='Custom')
    template_category = serializers.CharField(source='template.category', read_only=True, default='general')
    word_count = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'topic', 'target_audience', 'tone', 'language',
            'target_length', 'variables_values', 'outline', 'content', 'status',
            'generation_pipeline_used', 'template', 'template_name', 'template_category',
            'evaluation', 'word_count', 'created_at', 'updated_at'
        ]

    def get_word_count(self, obj):
        if obj.content:
            return len(obj.content.split())
        return 0


class ArticleGenerateRequestSerializer(serializers.Serializer):
    template_id = serializers.IntegerField(required=False, allow_null=True)
    topic = serializers.CharField(max_length=255)
    target_audience = serializers.CharField(max_length=150, default='General Audience')
    tone = serializers.CharField(max_length=100, default='Professional')
    language = serializers.CharField(max_length=50, default='English')
    target_length = serializers.CharField(max_length=50, default='Medium (~1000 words)')
    custom_instructions = serializers.CharField(required=False, allow_blank=True, default='')
    pipeline_mode = serializers.ChoiceField(choices=['direct', 'multi_stage'], default='direct')
    variables_values = serializers.DictField(required=False, default=dict)


class AIEditRequestSerializer(serializers.Serializer):
    action_type = serializers.ChoiceField(choices=[
        'improve_writing', 'simplify', 'make_professional', 'make_beginner_friendly',
        'expand', 'summarize', 'add_examples', 'generate_faq', 'improve_seo',
        'generate_intro', 'generate_conclusion', 'convert_to_social'
    ])
    selected_text = serializers.CharField(required=False, allow_blank=True, default='')
    custom_prompt = serializers.CharField(required=False, allow_blank=True, default='')
