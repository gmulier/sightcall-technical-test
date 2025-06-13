"""
Pipeline minimal pour social-auth GitHub OAuth2
Mappe automatiquement les données GitHub vers notre modèle User
"""

def save_github_profile(backend, user, response, *args, **kwargs):
    """Pipeline minimale pour GitHub OAuth2"""
    if backend.name == 'github':
        user.github_id = str(response.get('id'))
        user.avatar_url = response.get('avatar_url') or ''
        user.profile_url = response.get('html_url') or ''
        user.save()
    return {'user': user} 