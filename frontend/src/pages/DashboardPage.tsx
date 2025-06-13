import React from 'react';
import { Block } from 'jsxstyle';
import { Button, Avatar } from '../components';
import { User } from '../types';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
  return (
    <Block padding="20px">
      {/* Header */}
      <Block
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="white"
        padding="20px"
        borderRadius="12px"
        boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
        marginBottom="24px"
      >
        <Block display="flex" alignItems="center" gap="16px">
          <Avatar 
            src={user.avatar_url} 
            alt={user.username}
            size={50}
          />
          <Block>
            <Block
              component="h1"
              fontSize="24px"
              fontWeight={600}
              margin="0 0 4px 0"
              color="#24292e"
            >
              Bienvenue, {user.username}
            </Block>
            <Block
              fontSize="14px"
              color="#586069"
            >
              {user.email}
            </Block>
          </Block>
        </Block>
        
        <Button variant="secondary" onClick={onLogout}>
          🚪 Se déconnecter
        </Button>
      </Block>

      {/* Main Content */}
      <Block
        backgroundColor="white"
        padding="40px"
        borderRadius="12px"
        boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
        textAlign="center"
      >
        <Block
          fontSize="32px"
          marginBottom="16px"
          props={{ role: 'img', 'aria-label': 'construction' }}
        >
          🚧
        </Block>
        
        <Block
          component="h2"
          fontSize="24px"
          fontWeight={600}
          color="#24292e"
          marginBottom="12px"
          margin="0 0 12px 0"
        >
          Dashboard en développement
        </Block>
        
        <Block
          fontSize="16px"
          color="#586069"
          lineHeight="1.5"
        >
          Les fonctionnalités de l'application AI Tutorials seront bientôt disponibles.
          <br />
          Vous êtes maintenant connecté et authentifié via GitHub !
        </Block>
      </Block>
    </Block>
  );
}; 