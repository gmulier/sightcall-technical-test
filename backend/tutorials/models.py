import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Utilisateur OAuth2 GitHub minimal"""
    # Données GitHub OAuth2 supplémentaires
    github_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    avatar_url = models.URLField(blank=True)
    profile_url = models.URLField(blank=True)


class Transcript(models.Model):
    """Transcription d'une conversation uploadée par l'utilisateur"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transcripts")
    filename = models.CharField(max_length=255)
    timestamp = models.DateTimeField()
    duration_in_ticks = models.BigIntegerField()
    phrases = models.JSONField()
    fingerprint = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    
    class Meta:
        unique_together = [('user', 'fingerprint')]
    
    def __str__(self):
        return f"Transcript {self.id} - {self.user.username}"


class Tutorial(models.Model):
    """Tutoriel généré à partir d'une transcription"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transcript = models.ForeignKey(Transcript, on_delete=models.CASCADE, related_name="tutorials")
    title = models.CharField(max_length=200, default="")
    introduction = models.TextField(default="")
    steps = models.JSONField(default=list)
    examples = models.JSONField(default=list)
    summary = models.TextField(default="")
    duration_estimate = models.CharField(max_length=50, default="")
    tags = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Tutorial: {self.title} - {self.transcript.user.username}"
