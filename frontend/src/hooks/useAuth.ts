import { useState, useEffect } from 'react';
import { User } from '../types';
import { checkAuthStatus, initiateGitHubLogin, logout as apiLogout } from '../utils/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const isAuthenticated = !!user;

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const loadAuthStatus = async () => {
      setIsLoading(true);
      try {
        const authData = await checkAuthStatus();
        if (authData.authenticated && authData.user) {
          setUser(authData.user);
        }
      } catch (error) {
        console.error('Failed to load auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthStatus();
  }, []);

  const login = () => {
    initiateGitHubLogin();
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };
}; 