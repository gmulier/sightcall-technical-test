import { AuthResponse, Transcript, Tutorial } from '../types';
import { getCsrfToken } from './csrf';

// Configuration de base de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Base fetch with common options
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  // On isole headers de toutes les autres options
  const { headers: customHeaders = {}, ...restOptions } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include',            // on garde le cookie de session
    headers: {
      'X-CSRFToken': getCsrfToken(),   // on insère absolument le CSRF
      ...customHeaders,                // puis on ajoute les headers spécifiques
    },
    ...restOptions,                    // enfin on ajoute method, body, etc.
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return response;
};

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

// API methods for transcripts and tutorials
export const api = {
  // Transcripts
  async getTranscripts(): Promise<Transcript[]> {
    const response = await apiFetch('/api/transcripts/');
    return response.json();
  },

  async uploadTranscript(file: File, videoFile?: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add video file if provided
    if (videoFile) {
      formData.append('video_file', videoFile);
    }
    
    await apiFetch('/api/transcripts/', {
      method: 'POST',
      body: formData,
    });
  },

  async generateTutorial(transcriptId: string): Promise<void> {
    await apiFetch(`/api/transcripts/${transcriptId}/generate/`, {
      method: 'POST',
    });
  },

  // Tutorials
  async getTutorials(): Promise<Tutorial[]> {
    const response = await apiFetch('/api/tutorials/');
    return response.json();
  },

  async updateTutorial(tutorial: Tutorial): Promise<void> {
    await apiFetch(`/api/tutorials/${tutorial.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: tutorial.title,
        introduction: tutorial.introduction,
        steps: tutorial.steps,
        tips: tutorial.tips,
        summary: tutorial.summary,
        duration_estimate: tutorial.duration_estimate,
        tags: tutorial.tags,
      }),
    });
  },

  async deleteTutorial(tutorialId: string): Promise<void> {
    await apiFetch(`/api/tutorials/${tutorialId}/`, {
      method: 'DELETE',
    });
  },
}; 