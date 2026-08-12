from django.db import models
from django.contrib.auth.models import User

class PromptTemplate(models.Model):
    CATEGORY_CHOICES = [
        ('seo', 'SEO Blog'),
        ('technical', 'Technical Article'),
        ('tutorial', 'Tutorial / How-To'),
        ('academic', 'Academic Article'),
        ('news', 'News Article'),
        ('explainer', 'Explainer Article'),
        ('case_study', 'Case Study'),
        ('product_review', 'Product Review'),
        ('documentation', 'Documentation'),
        ('linkedin', 'LinkedIn / Social'),
        ('general', 'General'),
    ]

    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=150, unique=True)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general')
    system_prompt = models.TextField()
    user_prompt_template = models.TextField()
    variables = models.JSONField(default=list, help_text="List of variable descriptors e.g. [{'name': 'topic', 'label': 'Topic', 'type': 'text'}]")
    version = models.IntegerField(default=1)
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} (v{self.version})"


class TemplateVersion(models.Model):
    template = models.ForeignKey(PromptTemplate, on_delete=models.CASCADE, related_name='version_history')
    version = models.IntegerField()
    system_prompt = models.TextField()
    user_prompt_template = models.TextField()
    variables = models.JSONField(default=list)
    changelog = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-version']
        unique_together = ('template', 'version')

    def __str__(self):
        return f"{self.template.name} v{self.version}"


class Article(models.Model):
    PIPELINE_CHOICES = [
        ('direct', 'Direct Generation'),
        ('multi_stage', 'Multi-Stage Pipeline (Outline -> Article -> Eval -> Refine)'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='articles')
    template = models.ForeignKey(PromptTemplate, on_delete=models.SET_NULL, null=True, blank=True, related_name='generated_articles')
    title = models.CharField(max_length=255)
    topic = models.CharField(max_length=255)
    target_audience = models.CharField(max_length=150, default='General Audience')
    tone = models.CharField(max_length=100, default='Professional')
    language = models.CharField(max_length=50, default='English')
    target_length = models.CharField(max_length=50, default='Medium (~1000 words)')
    variables_values = models.JSONField(default=dict, blank=True)
    outline = models.TextField(blank=True, default='')
    content = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    generation_pipeline_used = models.CharField(max_length=20, choices=PIPELINE_CHOICES, default='direct')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title or f"Article: {self.topic}"


class ArticleEvaluation(models.Model):
    article = models.OneToOneField(Article, on_delete=models.CASCADE, related_name='evaluation')
    relevance_score = models.IntegerField(default=85)
    structure_score = models.IntegerField(default=85)
    readability_score = models.IntegerField(default=85)
    completeness_score = models.IntegerField(default=85)
    seo_score = models.IntegerField(default=85)
    overall_score = models.IntegerField(default=85)
    feedback_json = models.JSONField(default=dict, help_text="Strengths, weaknesses, actionable recommendations")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evaluation for '{self.article.title}': {self.overall_score}%"


class GenerationLog(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, null=True, blank=True, related_name='logs')
    action_type = models.CharField(max_length=50, default='generate')
    prompt_used = models.TextField()
    system_prompt_used = models.TextField()
    model_name = models.CharField(max_length=100, default='gemini-2.5-flash')
    tokens_used = models.IntegerField(default=0)
    duration_ms = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Log [{self.action_type}] for Article {self.article_id}"
