from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PromptTemplateViewSet, ArticleViewSet,
    register_user, login_user, get_current_user, dashboard_stats , _checkAPIStatus_,falseroute
)

router = DefaultRouter()
router.register(r'templates', PromptTemplateViewSet, basename='template')
router.register(r'articles', ArticleViewSet, basename='article')

urlpatterns = [
    path('home/',falseroute,name='False route'),    
    path('auth/register/', register_user, name='auth-register'),
    path('auth/login/', login_user, name='auth-login'),
    path('auth/me/', get_current_user, name='auth-me'),
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    path('APIStatus/',_checkAPIStatus_,name='APIStatus'),
    path('', include(router.urls)),
]
