from django.contrib import admin
from .models import User, Transcript, Tutorial


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """Interface admin pour les utilisateurs"""
    list_display = ['username', 'email', 'github_id', 'date_joined']
    list_filter = ['date_joined', 'is_active']
    search_fields = ['username', 'email', 'github_id']
    readonly_fields = ['id', 'date_joined', 'last_login']


@admin.register(Transcript)
class TranscriptAdmin(admin.ModelAdmin):
    """Interface admin pour les transcriptions"""
    list_display = ['id', 'user', 'timestamp', 'duration_in_ticks']
    list_filter = ['timestamp']
    search_fields = ['user__username']
    readonly_fields = ['id']


@admin.register(Tutorial)
class TutorialAdmin(admin.ModelAdmin):
    """Interface admin pour les tutoriels"""
    list_display = ['id', 'transcript', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['transcript__user__username']
    readonly_fields = ['id', 'created_at', 'updated_at']
