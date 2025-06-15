"""
Pipeline minimal pour social-auth GitHub OAuth2
Mappe automatiquement les données GitHub vers notre modèle User
"""

def save_github_profile(backend, user, response, *args, **kwargs):
    """
    Custom pipeline step for GitHub OAuth2 authentication
    
    This function is called during the social authentication pipeline
    to save additional GitHub profile information to our User model.
    
    Args:
        backend: The social authentication backend (GitHub in our case)
        user: The Django User instance being created/updated
        response: The OAuth2 response from GitHub containing user data
        *args, **kwargs: Additional arguments from the pipeline
        
    Returns:
        None: This pipeline step doesn't return anything, just updates the user
    """
    # Only process GitHub OAuth2 responses
    if backend.name == 'github':
        # Extract GitHub-specific data from the OAuth2 response
        user.github_id = str(response.get('id', ''))  # GitHub user ID
        user.avatar_url = response.get('avatar_url', '')  # Profile picture URL
        user.profile_url = response.get('html_url', '')  # GitHub profile page URL
        
        # Save the updated user information to the database
        user.save()
    return {'user': user} 