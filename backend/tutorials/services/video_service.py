import os
from django.conf import settings
from moviepy import VideoFileClip
from ..models import Tutorial, Transcript


class VideoClipService:
    """Service for extracting video clips from tutorials - SIMPLE VERSION THAT WORKS."""
    
    @staticmethod
    def extract_clips(tutorial: Tutorial, transcript: Transcript) -> None:
        """Extract video clips exactly like the original working code."""
        if not transcript.video_file:
            return
            
        # Create clips directory using centralized path method
        from .tutorial_service import TutorialService
        tutorial_media_path = TutorialService.get_media_path(tutorial)
        clips_dir = os.path.join(tutorial_media_path, 'clips')
        os.makedirs(clips_dir, exist_ok=True)
        
        updated_steps = []
        
        for step in tutorial.steps:
            step = step.copy()  # Copy to avoid mutations
            
            if video_clip := step.get('video_clip'):
                start, end = video_clip['start'], video_clip['end']
                # Descriptive filename with timing
                filename = f"step_{step['index']:02d}_{start:.1f}s-{end:.1f}s.mp4"
                filepath = os.path.join(clips_dir, filename)
                
                try:
                    # Extract video segment using MoviePy - EXACTLY like original
                    clip = VideoFileClip(transcript.video_file.path).subclipped(start, end)
                    clip.write_videofile(filepath, audio_codec='aac')  # Simple, no extra params
                    clip.close()
                    
                    # URL with structure
                    step['video_clip']['file_url'] = f"/media/tutorials/{transcript.id}/{tutorial.id}/clips/{filename}"
                except:
                    # Silent fail like original - just skip this clip
                    pass
            
            updated_steps.append(step)
        
        tutorial.steps = updated_steps
        tutorial.save() 