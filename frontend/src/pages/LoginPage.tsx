import React from 'react';
import { Block } from 'jsxstyle';
import { Button } from '../components';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <Block
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      padding="20px"
    >
      <Block
        backgroundColor="white"
        padding="40px"
        borderRadius="12px"
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
        textAlign="center"
        maxWidth="400px"
        width="100%"
      >
        <Block
          fontSize="32px"
          marginBottom="8px"
          props={{ role: 'img', 'aria-label': 'robot' }}
        >
          🤖
        </Block>
        
        <Block
          component="h1"
          fontSize="28px"
          fontWeight={700}
          color="#24292e"
          marginBottom="8px"
          margin="0 0 8px 0"
        >
          AI Tutorials MVP
        </Block>
        
        <Block
          component="p"
          fontSize="16px"
          color="#586069"
          marginBottom="32px"
          margin="0 0 32px 0"
        >
          Connectez-vous avec GitHub pour accéder à l'application
        </Block>
        
        <Button onClick={onLogin}>
          <Block
            fontSize="18px"
            props={{ role: 'img', 'aria-label': 'github' }}
          >
            🐙
          </Block>
          Se connecter avec GitHub
        </Button>
      </Block>
    </Block>
  );
}; 