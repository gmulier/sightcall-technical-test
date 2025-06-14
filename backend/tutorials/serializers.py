from rest_framework import serializers
from .models import User, Transcript, Tutorial


class UserSerializer(serializers.ModelSerializer):
    """Serializer pour l'utilisateur (lecture seule)"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'github_id']
        read_only_fields = ['id', 'username', 'email', 'github_id']


class TranscriptSerializer(serializers.ModelSerializer):
    """Serializer pour les transcriptions"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Transcript
        fields = ['id', 'user', 'filename', 'timestamp', 'duration_in_ticks', 'phrases', 'created_at']
        read_only_fields = ['id', 'user', 'filename']


class TutorialSerializer(serializers.ModelSerializer):
    """Serializer pour les tutoriels"""
    transcript = TranscriptSerializer(read_only=True)
    
    class Meta:
        model = Tutorial
        fields = ['id', 'transcript', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'transcript', 'created_at', 'updated_at'] 