import json
import hashlib
from typing import Optional
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import UploadedFile
from ..models import Transcript
from ..serializers import TranscriptSerializer

User = get_user_model()


class TranscriptService:
    """Service for handling transcript creation and processing."""
    
    @staticmethod
    def create_from_file(
        user: User, 
        json_file: UploadedFile, 
        video_file: Optional[UploadedFile] = None
    ) -> Transcript:
        """
        Create transcript from uploaded JSON file with optional video.
        
        Args:
            user: User who owns the transcript
            json_file: JSON file containing transcript data
            video_file: Optional video file
            
        Returns:
            Created Transcript instance
            
        Raises:
            json.JSONDecodeError: If JSON is malformed
            ValidationError: If transcript data is invalid
        """
        # Parse JSON and generate fingerprint
        raw_data = json_file.read()
        transcript_data = json.loads(raw_data)
        fingerprint = hashlib.sha256(raw_data).hexdigest()
        
        # Validate data structure
        serializer = TranscriptSerializer(data=transcript_data)
        serializer.is_valid(raise_exception=True)
        
        # Create transcript instance
        transcript = serializer.save(
            user=user,
            filename=json_file.name,
            fingerprint=fingerprint,
            video_file=video_file
        )
        
        return transcript 