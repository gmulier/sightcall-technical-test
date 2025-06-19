import json
import logging
import zipfile
import io
import os
from django.shortcuts import redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import logout
from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.serializers import ValidationError
from .models import Transcript, Tutorial
from .serializers import TranscriptSerializer, TutorialSerializer
from .services import TranscriptService, TutorialService

logger = logging.getLogger(__name__)



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
    """Logout user and return success response."""
    logout(request)
    return JsonResponse({'success': True, 'message': 'Logged out successfully'})


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
            transcript = TranscriptService.create_from_file(
                user=request.user,
                json_file=json_file,
                video_file=video_file
            )
            
            serializer = self.get_serializer(transcript)
            logger.info(f"Transcript {transcript.id} uploaded by user {request.user.id}")
            
            return Response(serializer.data, status=201)
            
        except json.JSONDecodeError:
            return Response({"detail": "Invalid JSON format"}, status=400)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=400)
        except Exception as e:
            logger.error(f"Transcript upload failed for user {request.user.id}: {e}")
            return Response({"detail": "Upload failed"}, status=500)

    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        """Generate tutorial from transcript using OpenAI and extract video clips."""
        transcript = self.get_object()
        
        try:
            tutorial = TutorialService.create_from_transcript(transcript)
            serializer = TutorialSerializer(tutorial)
            
            logger.info(f"Tutorial {tutorial.id} generated for transcript {transcript.id}")
            return Response(serializer.data, status=201)
            
        except Exception as e:
            logger.error(f"Tutorial generation failed for transcript {transcript.id}: {e}")
            return Response({"detail": "Generation failed"}, status=502)



class TutorialViewSet(viewsets.ModelViewSet):
    """API endpoints for tutorial CRUD operations."""
    serializer_class = TutorialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter tutorials to current user only."""
        return Tutorial.objects.filter(transcript__user=self.request.user)

    @action(detail=True, methods=['get'])
    def export_zip(self, request, pk=None):
        """
        Export tutorial as ZIP file containing standalone HTML and video clips.
        
        Returns:
            HttpResponse with ZIP file containing index.html and clips/ folder
        """
        tutorial = self.get_object()
        
        try:
            # Generate standalone HTML using centralized service method
            html_content = TutorialService.generate_html(tutorial)
            
            # Create ZIP file in memory
            buffer = io.BytesIO()
            with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
                # Add HTML file to ZIP root
                zf.writestr("index.html", html_content)
                
                # Add clips folder if it exists
                self._add_media_to_zip(zf, tutorial)
            
            buffer.seek(0)
            
            # Return as downloadable ZIP
            response = HttpResponse(buffer, content_type='application/zip')
            response['Content-Disposition'] = f'attachment; filename="tutorial_{tutorial.id}.zip"'
            
            logger.info(f"Tutorial {tutorial.id} exported as HTML ZIP by user {request.user.id}")
            return response
            
        except Exception as e:
            logger.error(f"HTML ZIP export failed for tutorial {tutorial.id}: {e}")
            return Response({"detail": "Export failed"}, status=500)
    
    def _add_media_to_zip(self, zipfile_obj: zipfile.ZipFile, tutorial: Tutorial) -> None:
        """
        Add media files to ZIP with simplified structure (clips/ folder at root).
        
        Args:
            zipfile_obj: ZipFile object to add files to
            tutorial: Tutorial instance containing media files
        """
        # Get media path using centralized service method
        media_path = TutorialService.get_media_path(tutorial)
        clips_path = os.path.join(media_path, 'clips')
        
        # Check if clips directory exists
        if not os.path.exists(clips_path):
            logger.info(f"No clips directory found for tutorial {tutorial.id}")
            return
        
        # Add all video clips to simplified clips/ folder structure
        for root, dirs, files in os.walk(clips_path):
            for file in files:
                file_path = os.path.join(root, file)
                # Simplified archive path: just clips/{filename}
                archive_path = os.path.join('clips', file)
                
                try:
                    zipfile_obj.write(file_path, archive_path)
                    logger.debug(f"Added clip {archive_path} to ZIP")
                except Exception as e:
                    logger.warning(f"Failed to add clip {file_path} to ZIP: {e}")
                    continue
