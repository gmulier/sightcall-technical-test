import { AuthResponse } from '../types';

// Configuration de base de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Vérifier le statut d'authentification
export const checkAuthStatus = async (): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/status/`, {
      credentials: 'include', // Important pour les cookies de session Django
    });
    
    if (!response.ok) {
      throw new Error('Failed to check auth status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Auth check failed:', error);
    return { authenticated: false };
  }
};

// Initier la connexion GitHub
export const initiateGitHubLogin = (): void => {
  window.location.href = `${API_BASE_URL}/auth/login/github/`;
};

// Déconnexion
export const logout = async (): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/logout/`, {
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout failed:', error);
  }
}; 