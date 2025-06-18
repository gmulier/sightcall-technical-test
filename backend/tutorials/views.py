import json
import hashlib
import os
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth import logout
from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from .models import Transcript, Tutorial
from .serializers import TranscriptSerializer, TutorialSerializer
from .openai_client import generate_tutorial_from_transcript
from moviepy import VideoFileClip



def auth_status(request):
    """Check if user is authenticated and return their profile data."""
    if request.user.is_authenticated:
        return JsonResponse({
            'authenticated': True,
            'user': {
                'id': str(request.user.id),
                'username': request.user.username,
                'email': request.user.email,
                'github_id': request.user.github_id,
                'avatar_url': request.user.avatar_url,
                'profile_url': request.user.profile_url,
            }
        })
    return JsonResponse({'authenticated': False, 'login_url': '/auth/login/github/'})


def logout_view(request):
    """Logout user and redirect to React frontend."""
    logout(request)
    return redirect('http://localhost:3000')


class TranscriptViewSet(viewsets.ModelViewSet):
    """
    API endpoints for transcript management:
    - GET /api/transcripts/ - List user's transcripts
    - POST /api/transcripts/ - Upload transcript with optional video
    - POST /api/transcripts/{id}/generate/ - Generate tutorial from transcript
    """
    serializer_class = TranscriptSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def get_queryset(self):
        """Filter transcripts to current user only."""
        return Transcript.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Upload JSON transcript file with optional video file."""
        if 'file' not in request.FILES:
            return Response({"detail": "JSON transcript file is required"}, status=400)
        
        json_file = request.FILES['file']
        video_file = request.FILES.get('video_file')
        
        try:
            # Parse JSON and create fingerprint for duplicate detection
            raw = json_file.read()
            data = json.loads(raw)
            fingerprint = hashlib.sha256(raw).hexdigest()
            
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            
            transcript = serializer.save(
                user=request.user, 
                filename=json_file.name, 
                fingerprint=fingerprint,
                video_file=video_file
            )
            
            return Response(serializer.data, status=201)
            
        except json.JSONDecodeError:
            return Response({"detail": "Invalid JSON format"}, status=400)
        except Exception as e:
            return Response({"detail": f"Upload error: {str(e)}"}, status=500)

    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        """Generate tutorial from transcript using OpenAI and extract video clips."""
        transcript = self.get_object()
        
        try:
            # Generate tutorial structure with OpenAI
            tutorial_data = generate_tutorial_from_transcript(transcript.phrases)
            
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
                self._extract_video_clips(tutorial, transcript)
            
            return Response(TutorialSerializer(tutorial).data, status=201)
            
        except Exception as e:
            return Response({"detail": f"Generation failed: {str(e)}"}, status=502)
    
    def _extract_video_clips(self, tutorial, transcript):
        """Extract video clips organized by transcript/tutorial structure."""
        # Structure hiérarchique: media/tutorials/{transcript_id}/{tutorial_id}/clips/
        clips_dir = os.path.join(settings.MEDIA_ROOT, 'tutorials', str(transcript.id), str(tutorial.id), 'clips')
        os.makedirs(clips_dir, exist_ok=True)
        
        updated_steps = []
        
        for step in tutorial.steps:
            step = step.copy()  # Copie pour éviter les mutations
            
            if video_clip := step.get('video_clip'):
                start, end = video_clip['start'], video_clip['end']
                # Nom descriptif avec timing
                filename = f"step_{step['index']:02d}_{start:.1f}s-{end:.1f}s.mp4"
                filepath = os.path.join(clips_dir, filename)
                
                try:
                    # Extract video segment using MoviePy
                    clip = VideoFileClip(transcript.video_file.path).subclipped(start, end)
                    clip.write_videofile(filepath, audio_codec='aac') # Force audio codec
                    clip.close()
                    
                    # URL avec nouvelle structure
                    step['video_clip']['file_url'] = f"/media/tutorials/{transcript.id}/{tutorial.id}/clips/{filename}"
                except:
                    pass
            
            updated_steps.append(step)
        
        tutorial.steps = updated_steps
        tutorial.save()


class TutorialViewSet(viewsets.ModelViewSet):
    """API endpoints for tutorial CRUD operations."""
    serializer_class = TutorialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter tutorials to current user only."""
        return Tutorial.objects.filter(transcript__user=self.request.user)
