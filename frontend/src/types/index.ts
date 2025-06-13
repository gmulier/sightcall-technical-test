// Types pour l'utilisateur (basé sur le modèle Django User)
export interface User {
  id: string;
  username: string;
  email: string;
  github_id: string;
  avatar_url: string;
  profile_url: string;
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