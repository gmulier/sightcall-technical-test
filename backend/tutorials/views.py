import json
import hashlib
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth import logout
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from openai import OpenAI
from .models import Transcript, Tutorial
from .serializers import TranscriptSerializer, TutorialSerializer
from .openai_client import generate_tutorial_from_transcript

# Create your views here.

def auth_status(request):
    """API pour vérifier le statut d'authentification"""
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
    """Vue pour déconnecter l'utilisateur et rediriger vers le frontend"""
    logout(request)
    return redirect('http://localhost:3000')  # Redirige vers le frontend React


class TranscriptViewSet(viewsets.ModelViewSet):
    serializer_class = TranscriptSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def get_queryset(self):
        return Transcript.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        file = request.FILES['file']
        raw = file.read()
        data = json.loads(raw)
        fingerprint = hashlib.sha256(raw).hexdigest()
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, filename=file.name, fingerprint=fingerprint)
        return Response(serializer.data, status=201)

    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        transcript = self.get_object()
        
        try:
            # Génération du tutoriel via OpenAI
            tutorial_content = generate_tutorial_from_transcript(transcript.phrases)
            
            # Sauvegarde en base
            tutorial = Tutorial.objects.create(
                transcript=transcript,
                content=tutorial_content
            )
            return Response(TutorialSerializer(tutorial).data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )


class TutorialViewSet(viewsets.ModelViewSet):
    serializer_class = TutorialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Tutorial.objects.filter(transcript__user=self.request.user)
