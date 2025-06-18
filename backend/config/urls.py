"""
URL configuration for AI Tutorials project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from tutorials.views import auth_status, logout_view, TranscriptViewSet, TutorialViewSet

router = DefaultRouter()
router.register(r'transcripts', TranscriptViewSet, basename='transcript')
router.register(r'tutorials', TutorialViewSet, basename='tutorial')

urlpatterns = [
    path("auth/", include('social_django.urls', namespace='social')),
    path("api/auth/status/", auth_status, name='api_auth_status'),  # API endpoint
    path("logout/", logout_view, name='logout'),
    path("api/", include(router.urls)),
    path("", auth_status, name='auth_status'),  # Page d'accueil pour test legacy
]

# No longer need static files serving - everything is in database!
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)