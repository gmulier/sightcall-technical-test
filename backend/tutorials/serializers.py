from rest_framework import serializers
from .models import User, Transcript, Tutorial


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model (read-only)
    
    Used to serialize user data for API responses. All fields are read-only
    since user data comes from GitHub OAuth2 and shouldn't be modified
    through our API.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'github_id']
        read_only_fields = ['id', 'username', 'email', 'github_id']


class TranscriptSerializer(serializers.ModelSerializer):
    """
    Serializer for Transcript model
    
    Handles serialization of transcript data for API responses.
    Includes nested user data and makes most fields read-only since
    transcripts are uploaded as complete JSON files. Now supports
    optional video file upload alongside the transcript JSON.
    """
    # Nested serializer to include user information in transcript responses
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Transcript
        fields = ['id', 'user', 'filename', 'video_file', 'timestamp', 'duration_in_ticks', 'phrases', 'created_at']
        read_only_fields = ['id', 'user', 'filename']


class TutorialSerializer(serializers.ModelSerializer):
    """
    Serializer for Tutorial model
    
    Handles serialization of tutorial data for API responses and updates.
    Includes nested transcript data with user information and enriched
    steps structure with associated assets.
    """
    # Nested serializer to include full transcript information
    transcript = TranscriptSerializer(read_only=True)
    
    class Meta:
        model = Tutorial
        fields = [
            'id', 'transcript', 'title', 'introduction', 'steps', 'examples',
            'summary', 'duration_estimate', 'tags', 'updated_at'
        ]
        read_only_fields = ['id', 'transcript', 'updated_at'] 