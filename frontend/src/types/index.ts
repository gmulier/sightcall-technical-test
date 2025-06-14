// Types pour l'utilisateur (basé sur le modèle Django User)
export interface User {
  id: string;
  username: string;
  email: string;
  github_id: string;
  avatar_url: string;
  profile_url: string;
}

// Types pour les transcripts
export interface Transcript {
  id: string;
  user: User;
  filename: string;
  timestamp: string;
  duration_in_ticks: number;
  phrases: any[];
  created_at: string;
}

// Types pour les tutoriels (structure JSON sans content_md)
export interface Tutorial {
  id: string;
  transcript: Transcript;
  title: string;
  introduction: string;
  steps: string[];
  examples: string[];
  summary: string;
  duration_estimate: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Réponse d'authentification de l'API Django
export interface AuthResponse {
  authenticated: boolean;
  user?: User;
  login_url?: string;
}

// Props pour les composants
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
} 