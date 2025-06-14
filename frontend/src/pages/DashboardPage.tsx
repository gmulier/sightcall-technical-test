import React, { useState, useEffect } from 'react';
import { Block } from 'jsxstyle';
import { Button, Avatar } from '../components';
import { User, Transcript } from '../types';

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatDuration = (ticks: number) => {
  const seconds = Math.floor(ticks / 10000000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const getLanguage = (phrases: any[]) => {
  if (!phrases.length) return 'N/A';
  const locales = phrases.map(p => p.locale).filter(Boolean);
  const mostCommon = locales.reduce((acc, locale) => {
    acc[locale] = (acc[locale] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return Object.keys(mostCommon).sort((a, b) => mostCommon[b] - mostCommon[a])[0] || 'N/A';
};

const getAverageConfidence = (phrases: any[]) => {
  if (!phrases.length) return 0;
  const confidences = phrases.map(p => p.confidence).filter(c => c !== undefined);
  return confidences.length ? (confidences.reduce((a, b) => a + b, 0) / confidences.length) : 0;
};

const getMessageStyle = (message: string) => {
  if (message.includes('success')) {
    return { bg: '#d4edda', color: '#155724', icon: '✅' };
  }
  if (message === 'Transcript already exists') {
    return { bg: '#fff3cd', color: '#856404', icon: '⚠️' };
  }
  return { bg: '#f8d7da', color: '#721c24', icon: '❌' };
};

const GRID_COLUMNS = "minmax(100px, 1fr) minmax(150px, 2fr) minmax(140px, 2fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(120px, 1fr)";

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
  const [message, setMessage] = useState<string>('');
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTranscripts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/transcripts/', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setTranscripts(data.sort((a: Transcript, b: Transcript) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
      }
    } catch (error) {
      console.error('Failed to fetch transcripts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranscripts();
  }, []);

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
        fetchTranscripts();
      } else {
        const errorText = await response.text();
        if (errorText.includes('duplicate') || errorText.includes('unique') || errorText.includes('already exists')) {
          setMessage('Transcript already exists');
        } else {
          setMessage('Upload failed');
        }
      }
    } catch (error) {
      setMessage('Upload error');
    }
  };

  const messageStyle = message ? getMessageStyle(message) : null;

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

        {messageStyle && (
          <Block 
            marginTop="16px"
            padding="12px"
            borderRadius="6px"
            backgroundColor={messageStyle.bg}
            color={messageStyle.color}
            fontSize="14px"
            fontWeight={500}
          >
            {messageStyle.icon} {message}
          </Block>
        )}
      </Block>

      {/* Transcripts List */}
      <Block
        backgroundColor="white"
        borderRadius="12px"
        boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
        overflow="hidden"
      >
        <Block
          padding="20px"
          borderBottom="1px solid #e1e4e8"
          fontSize="20px"
          fontWeight={600}
          color="#24292e"
        >
          📋 Mes Transcripts ({transcripts.length})
        </Block>

        {loading ? (
          <Block padding="40px" textAlign="center" color="#586069">
            Chargement...
          </Block>
        ) : transcripts.length === 0 ? (
          <Block padding="40px" textAlign="center" color="#586069">
            Aucun transcript uploadé pour le moment
          </Block>
        ) : (
          <Block overflowX="auto">
            <Block minWidth="1000px" width="100%">
              {/* Table Header */}
              <Block
                display="grid"
                gridTemplateColumns={GRID_COLUMNS}
                gap="16px"
                padding="16px 20px"
                backgroundColor="#f6f8fa"
                fontSize="14px"
                fontWeight={600}
                color="#586069"
                borderBottom="1px solid #e1e4e8"
              >
                <Block>Upload</Block>
                <Block>Fichier</Block>
                <Block>Timestamp</Block>
                <Block>Durée</Block>
                <Block>#Phrases</Block>
                <Block>Langue</Block>
                <Block>Qualité</Block>
                <Block>Action</Block>
              </Block>

              {/* Table Rows */}
              {transcripts.map((transcript) => (
                <Block
                  key={transcript.id}
                  display="grid"
                  gridTemplateColumns={GRID_COLUMNS}
                  gap="16px"
                  padding="16px 20px"
                  borderBottom="1px solid #e1e4e8"
                  fontSize="14px"
                  alignItems="center"
                  props={{
                    style: { ':hover': { backgroundColor: '#f6f8fa' } }
                  }}
                >
                  <Block color="#586069">
                    {formatDate(transcript.created_at)}
                  </Block>
                  <Block color="#586069" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                    {transcript.filename}
                  </Block>
                  <Block color="#586069">
                    {new Date(transcript.timestamp).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Block>
                  <Block color="#586069">
                    {formatDuration(transcript.duration_in_ticks)}
                  </Block>
                  <Block color="#586069">
                    {transcript.phrases.length}
                  </Block>
                  <Block color="#586069">
                    {getLanguage(transcript.phrases)}
                  </Block>
                  <Block color="#586069">
                    {getAverageConfidence(transcript.phrases).toFixed(2)}
                  </Block>
                  <Block>
                    <Block
                      component="button"
                      backgroundColor="#24292e"
                      color="white"
                      border="none"
                      padding="6px 12px"
                      borderRadius="6px"
                      fontSize="12px"
                      fontWeight={600}
                      cursor="pointer"
                      transition="all 0.2s ease"
                      hoverBackgroundColor="#1b1f23"
                      props={{
                        onClick: () => console.log('Generate tutorial for', transcript.id)
                      }}
                    >
                      Générer ▶
                    </Block>
                  </Block>
                </Block>
              ))}
            </Block>
          </Block>
        )}
      </Block>
    </Block>
  );
}; 