import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Block } from 'jsxstyle';
import { checkAuthStatus } from '../utils/api';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Appel à l'API pour récupérer l'état de connexion
        const authData = await checkAuthStatus();
        
        if (authData.authenticated && authData.user) {
          // Succès : redirige vers le dashboard
          navigate('/', { replace: true });
        } else {
          // Échec : redirige vers login
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback failed:', error);
        // En cas d'erreur, redirige vers login
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <Block
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      flexDirection="column"
      background="#f8f9fa"
    >
      <Block
        fontSize="48px"
        marginBottom="24px"
        props={{ role: 'img', 'aria-label': 'loading' }}
      >
        🔄
      </Block>
      <Block
        fontSize="24px"
        fontWeight={600}
        color="#24292e"
        marginBottom="12px"
      >
        Connexion en cours...
      </Block>
      <Block
        fontSize="16px"
        color="#586069"
        textAlign="center"
        maxWidth="400px"
      >
        Nous finalisons votre authentification GitHub.
        <br />
        Vous allez être redirigé automatiquement.
      </Block>
    </Block>
  );
};

export default AuthCallback; 