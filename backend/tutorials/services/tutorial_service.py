import logging
from typing import Dict, Any
from django.db import transaction
from ..models import Tutorial, Transcript
from ..openai_client import generate_tutorial_from_transcript
from .video_service import VideoClipService

logger = logging.getLogger(__name__)


class TutorialService:
    """Service for tutorial generation and processing."""
    
    @staticmethod
    def create_from_transcript(transcript: Transcript) -> Tutorial:
        """
        Generate tutorial from transcript using OpenAI with atomic transaction.
        
        Args:
            transcript: Source transcript for tutorial generation
            
        Returns:
            Created Tutorial instance with processed video clips
            
        Raises:
            Exception: If OpenAI generation or video processing fails
        """
        try:
            # Generate tutorial structure with OpenAI
            tutorial_data = generate_tutorial_from_transcript(transcript.phrases)
            
            # Create tutorial and extract clips atomically
            with transaction.atomic():
                tutorial = Tutorial.objects.create(
                    transcript=transcript,
                    title=tutorial_data['title'],
                    introduction=tutorial_data['introduction'],
                    steps=tutorial_data['steps'],
                    examples=tutorial_data.get('examples', []),
                    summary=tutorial_data['summary'],
                    duration_estimate=tutorial_data['duration_estimate'],
                    tags=tutorial_data['tags'],
                )
                
                # Extract video clips if video is available
                if transcript.video_file:
                    VideoClipService.extract_clips(tutorial, transcript)
                
                logger.info(f"Created tutorial {tutorial.id} for transcript {transcript.id}")
                
            return tutorial
            
        except Exception as e:
            logger.error(f"Tutorial generation failed for transcript {transcript.id}: {e}")
            raise 