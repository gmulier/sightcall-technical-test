import json
import hashlib
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth import logout
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from .models import Transcript, Tutorial
from .serializers import TranscriptSerializer, TutorialSerializer
from .openai_client import generate_tutorial_from_transcript

# Create your views here.

def auth_status(request):
    """Check authentication status and return user info if authenticated."""
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
    else:
        return JsonResponse({
            'authenticated': False,
            'login_url': '/auth/login/github/'
        })


def logout_view(request):
    """Log out the user and redirect to the React frontend at localhost:3000."""
    logout(request)
    return redirect('http://localhost:3000')


class TranscriptViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing conversation transcripts
    
    Provides CRUD operations for transcripts with the following endpoints:
    - GET /api/transcripts/ - List all user's transcripts
    - POST /api/transcripts/ - Upload a new transcript
    - GET /api/transcripts/{id}/ - Get specific transcript
    - POST /api/transcripts/{id}/generate/ - Generate tutorial from transcript
    
    All operations are restricted to authenticated users and their own data.
    """
    serializer_class = TranscriptSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def get_queryset(self):
        """
        Filter transcripts to only show current user's data
        Returns: Transcripts belonging to the authenticated user
        """
        return Transcript.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """
        handle file upload: read JSON file, compute fingerprint, validate and save transcript.
        """
        file = request.FILES['file']
        raw = file.read()
        data = json.loads(raw)
        # Compute a SHA-256 hash of the raw JSON to prevent duplicates
        fingerprint = hashlib.sha256(raw).hexdigest()
        
        # Validate parsed JSON against TranscriptSerializer
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        # Save transcript linked to current user, including metadata
        serializer.save(user=request.user, filename=file.name, fingerprint=fingerprint)
        return Response(serializer.data, status=201)

    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        """
        generate a tutorial from the transcript via OpenAI and save it to the database.
        """
        transcript = self.get_object()
        
        try:
            # Extract plain text from transcript phrases
            raw_text = "\n".join(p["display"] for p in transcript.phrases if p.get("display"))
            
            # Call OpenAI client to build tutorial structure
            data = generate_tutorial_from_transcript(raw_text)
            
            # Create Tutorial instance with returned JSON fields
            tutorial = Tutorial.objects.create(
                transcript=transcript,
                title=data['title'],
                introduction=data['introduction'],
                steps=data['steps'],
                examples=data.get('examples', []),
                summary=data['summary'],
                duration_estimate=data['duration_estimate'],
                tags=data['tags'],
            )
            # Return serialized tutorial
            return Response(TutorialSerializer(tutorial).data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )


class TutorialViewSet(viewsets.ModelViewSet):
    """
    ViewSet for listing, retrieving, creating, updating and deleting tutorials.
    """
    serializer_class = TutorialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        restrict tutorials to those belonging to the current user.
        """
        return Tutorial.objects.filter(transcript__user=self.request.user)
