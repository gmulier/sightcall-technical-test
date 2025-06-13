from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth import logout

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
