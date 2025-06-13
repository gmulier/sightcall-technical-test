import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UserManager(BaseUserManager):
    """Manager pour le modèle User personnalisé"""
    
    def create_user(self, username, email, github_id, **extra_fields):
        if not username:
            raise ValueError('Username is required')
        if not github_id:
            raise ValueError('GitHub ID is required')
        
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, github_id=github_id, **extra_fields)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, email, github_id=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        return self.create_user(username, email, github_id, **extra_fields)


class User(AbstractBaseUser):
    """Utilisateur minimal basé sur GitHub OAuth2"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Données GitHub OAuth2
    github_id = models.CharField(max_length=100, unique=True)  # Source: id
    username = models.CharField(max_length=150, unique=True)  # Source: login
    name = models.CharField(max_length=200, blank=True)       # Source: name
    email = models.EmailField()                               # Source: email
    avatar_url = models.URLField(blank=True)                  # Source: avatar_url
    profile_url = models.URLField(blank=True)                 # Source: html_url
    
    # Champs Django minimaux requis
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'github_id']
    
    def __str__(self):
        return self.username
    
    def has_perm(self, perm, obj=None):
        return self.is_superuser
    
    def has_module_perms(self, app_label):
        return self.is_superuser


class Transcript(models.Model):
    """Transcription d'une conversation uploadée par l'utilisateur"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transcripts")
    timestamp = models.DateTimeField()
    duration_in_ticks = models.BigIntegerField()
    phrases = models.JSONField()  # Structure complète des phrases
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"Transcript {self.id} - {self.user.username}"


class Tutorial(models.Model):
    """Tutoriel généré à partir d'une transcription"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transcript = models.ForeignKey(Transcript, on_delete=models.CASCADE, related_name="tutorials")
    content = models.TextField()  # Contenu textuel du tutoriel
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Tutorial {self.id} - {self.transcript.user.username}"
