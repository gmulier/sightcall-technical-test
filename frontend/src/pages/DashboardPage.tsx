import React, { useState } from 'react';
import { Block } from 'jsxstyle';
import { Button, Avatar } from '../components';
import { User } from '../types';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

const getCsrfToken = () => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrftoken') return value;
  }
  return '';
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
  const [message, setMessage] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/transcripts/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-CSRFToken': getCsrfToken() },
        body: formData
      });

      if (response.ok) {
        setMessage('Transcript uploaded successfully');
      } else {
        setMessage('Upload failed');
      }
    } catch (error) {
      setMessage('Upload error');
    }
  };

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

      {/* Upload Section */}
      <Block
        backgroundColor="white"
        padding="24px"
        borderRadius="12px"
        boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
        marginBottom="24px"
      >
        <Block 
          fontSize="20px" 
          fontWeight={600} 
          marginBottom="16px"
          color="#24292e"
        >
          📄 Upload Transcript
        </Block>
        
        <Block
          border="2px dashed #d1d5da"
          borderRadius="8px"
          padding="20px"
          textAlign="center"
          backgroundColor="#f6f8fa"
          position="relative"
        >
          <Block
            component="input"
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            opacity="0"
            cursor="pointer"
            props={{ 
              type: 'file',
              accept: 'application/json',
              onChange: handleFileUpload,
              style: { zIndex: 1 }
            }}
          />
          
          <Block fontSize="16px" color="#586069" marginBottom="8px">
            📁 Glissez votre fichier JSON ici ou cliquez pour sélectionner
          </Block>
          
          <Block fontSize="14px" color="#959da5">
            Format accepté : .json uniquement
          </Block>
        </Block>

        {message && (
          <Block 
            marginTop="16px"
            padding="12px"
            borderRadius="6px"
            backgroundColor={message.includes('success') ? '#d4edda' : '#f8d7da'}
            color={message.includes('success') ? '#155724' : '#721c24'}
            fontSize="14px"
            fontWeight={500}
          >
            {message.includes('success') ? '✅' : '❌'} {message}
          </Block>
        )}
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