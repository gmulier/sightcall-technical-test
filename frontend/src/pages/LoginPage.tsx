import React from 'react';
import { Block } from 'jsxstyle';
import { Bot, Github } from 'lucide-react';
import { Button } from '../components';

/**
 * Props interface for the LoginPage component
 */
interface LoginPageProps {
  onLogin: () => void;  // Callback function to initiate GitHub OAuth2 login
}

/**
 * LoginPage Component
 * 
 * Displays the authentication page with GitHub OAuth2 login.
 * Features a centered card layout with app branding and login button.
 * 
 * @param onLogin - Function to trigger GitHub OAuth2 authentication flow
 */
export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    // Full-screen container with centered content
    <Block
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      padding="20px"
    >
      {/* Main login card */}
      <Block
        backgroundColor="white"
        padding="40px"
        borderRadius="12px"
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
        textAlign="center"
        maxWidth="400px"
        width="100%"
      >
        {/* App icon - Bot representing AI functionality */}
        <Block
          marginBottom="8px"
          display="flex"
          justifyContent="center"
        >
          <Bot size={48} color="#0366d6" />
        </Block>
        
        {/* App title */}
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
        
        {/* App description */}
        <Block
          component="p"
          fontSize="16px"
          color="#586069"
          marginBottom="32px"
          margin="0 0 32px 0"
        >
          Connect with GitHub to access the application
        </Block>
        
        {/* GitHub OAuth2 login button */}
        <Button onClick={onLogin}>
          <Block display="flex" alignItems="center" gap="8px">
            <Github size={20} />
            Connect with GitHub
          </Block>
        </Button>
      </Block>
    </Block>
  );
}; 