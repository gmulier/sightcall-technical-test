import React, { useState } from 'react';
import { Block } from 'jsxstyle';
import { FileText, ClipboardList, BookOpen, LogOut } from 'lucide-react';
import { Button, Avatar, TutorialCard, TutorialModal, Toast, TranscriptRow } from '../components';
import { User, Tutorial } from '../types';
import { useToast } from '../hooks/useToast';
import { useData } from '../hooks/useData';
import { api } from '../utils/api';

/**
 * Props interface for the DashboardPage component
 */
interface DashboardPageProps {
  user: User;  // Authenticated user data from GitHub OAuth2
  onLogout: () => void;  // Callback function to handle user logout
}

/**
 * Get CSRF token from cookies for Django API requests
 * 
 * Django requires CSRF tokens for POST/PUT/PATCH requests.
 * This function extracts the token from browser cookies.
 * 
 * @returns CSRF token string or empty string if not found
 */
const getCsrfToken = () => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrftoken') return value;
  }
  return '';
};

/**
 * Convert duration from system ticks to human-readable format
 * 
 * @param ticks - Duration in system ticks (10,000,000 ticks = 1 second)
 * @returns Formatted duration string (e.g., "07:01")
 */
const formatDuration = (ticks: number) => {
  const seconds = Math.floor(ticks / 10000000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Extract the most common language from transcript phrases
 * 
 * @param phrases - Array of conversation phrases with locale information
 * @returns Most common language code or 'N/A' if none found
 */
const getLanguage = (phrases: any[]) => {
  if (!phrases.length) return 'N/A';
  const locales = phrases.map(p => p.locale).filter(Boolean);
  const mostCommon = locales.reduce((acc, locale) => {
    acc[locale] = (acc[locale] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return Object.keys(mostCommon).sort((a, b) => mostCommon[b] - mostCommon[a])[0] || 'N/A';
};

/**
 * Calculate average confidence score from transcript phrases
 * 
 * @param phrases - Array of conversation phrases with confidence scores
 * @returns Average confidence as a decimal (0-1)
 */
const getAverageConfidence = (phrases: any[]) => {
  if (!phrases.length) return 0;
  const confidences = phrases.map(p => p.confidence).filter(c => c !== undefined);
  return confidences.length ? (confidences.reduce((a, b) => a + b, 0) / confidences.length) : 0;
};

// CSS Grid template for transcript table columns
const GRID_COLUMNS = "minmax(100px, 1fr) minmax(150px, 2fr) minmax(140px, 2fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(120px, 1fr)";

/**
 * DashboardPage Component
 * 
 * Main application dashboard displaying:
 * - User profile header with logout
 * - File upload section for transcripts
 * - Table of uploaded transcripts with generation buttons
 * - Grid of generated tutorials with modal viewing
 * 
 * Features:
 * - Real-time status messages with auto-dismiss
 * - Loading states for async operations
 * - Responsive design for all screen sizes
 * - CSRF-protected API calls to Django backend
 */
export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
  const { toast, show, hide } = useToast();
  const { transcripts, tutorials, loading, tutorialsLoading, refetchTranscripts, refetchTutorials } = useData();
  
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  /**
   * Handle transcript file upload
   * 
   * Processes JSON file uploads, validates content, and sends to Django API.
   * Provides user feedback for success/error states.
   * 
   * @param event - File input change event
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await api.uploadTranscript(file);
      show('Transcript uploaded successfully', 'success');
      refetchTranscripts();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload error';
      const isDuplicate = errorMsg.includes('duplicate') || errorMsg.includes('unique') || errorMsg.includes('already exists');
      show(isDuplicate ? 'Transcript already exists' : 'Upload failed', 'error');
    }
  };

  /**
   * Generate AI tutorial from a transcript
   * 
   * Sends transcript to OpenAI for tutorial generation.
   * Shows loading state and provides user feedback.
   * 
   * @param transcriptId - UUID of the transcript to process
   */
  const handleGenerateTutorial = async (transcriptId: string) => {
    setGeneratingId(transcriptId);
    try {
      await api.generateTutorial(transcriptId);
      show('Tutorial generated successfully', 'success');
      refetchTutorials();
    } catch (error) {
      show('Tutorial generation failed', 'error');
    } finally {
      setGeneratingId(null);
    }
  };

  /**
   * Open tutorial in modal for viewing/editing
   * 
   * @param tutorialId - UUID of the tutorial to display
   */
  const handleTutorialClick = (tutorialId: string) => {
    const tutorial = tutorials.find(t => t.id === tutorialId);
    if (tutorial) {
      setSelectedTutorial(tutorial);
      setIsModalOpen(true);
    }
  };

  /**
   * Save tutorial changes from modal
   * 
   * Sends updated tutorial data to Django API and refreshes the list.
   * 
   * @param tutorial - Updated tutorial object
   */
  const handleTutorialSave = async (tutorial: Tutorial) => {
    try {
      await api.updateTutorial(tutorial);
      show('Tutorial updated successfully', 'success');
      refetchTutorials();
    } catch (error) {
      show('Tutorial update failed', 'error');
    }
  };

  /**
   * Delete tutorial with confirmation
   * 
   * Sends DELETE request to Django API and refreshes the list.
   * Provides user feedback via toast message.
   * 
   * @param tutorialId - UUID of the tutorial to delete
   */
  const handleTutorialDelete = async (tutorialId: string) => {
    try {
      await api.deleteTutorial(tutorialId);
      show('Tutorial deleted successfully', 'success');
      refetchTutorials();
    } catch (error) {
      show('Tutorial deletion failed', 'error');
    }
  };

  return (
    <Block padding="20px">
      {/* Header Section - User profile and logout */}
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
        {/* User profile information */}
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
              Welcome, {user.username}
            </Block>
            <Block
              fontSize="14px"
              color="#586069"
            >
              {user.email}
            </Block>
          </Block>
        </Block>
        
        {/* Logout button */}
        <Button variant="secondary" onClick={onLogout}>
          <Block display="flex" alignItems="center" gap="8px">
            <LogOut size={16} />
            Logout
          </Block>
        </Button>
      </Block>

      {/* Upload Section - File upload for transcripts */}
      <Block
        backgroundColor="white"
        padding="24px"
        borderRadius="12px"
        boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
        marginBottom="24px"
      >
        {/* Section title */}
        <Block 
          display="flex"
          alignItems="center"
          gap="8px"
          fontSize="20px" 
          fontWeight={600} 
          marginBottom="16px"
          color="#24292e"
        >
          <FileText size={20} />
          Upload Transcript
        </Block>
        
        {/* File drop zone */}
        <Block
          border="2px dashed #d1d5da"
          borderRadius="8px"
          padding="20px"
          textAlign="center"
          backgroundColor="#f6f8fa"
          position="relative"
        >
          {/* Hidden file input */}
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
          
          {/* Drop zone content */}
          <Block fontSize="16px" color="#586069" marginBottom="8px">
            <Block display="flex" alignItems="center" justifyContent="center" gap="8px">
              <FileText size={18} />
              Drag your JSON file here or click to select
            </Block>
          </Block>
          
          <Block fontSize="14px" color="#959da5">
            Accepted format: JSON only
          </Block>
        </Block>

      </Block>

      {/* Transcripts List Section */}
      <Block
        backgroundColor="white"
        borderRadius="12px"
        boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
        marginBottom="24px"
        overflow="hidden"
      >
        {/* Section header */}
        <Block
          display="flex"
          alignItems="center"
          gap="8px"
          padding="20px"
          borderBottom="1px solid #e1e4e8"
          fontSize="20px"
          fontWeight={600}
          color="#24292e"
        >
          <ClipboardList size={20} />
          My Transcripts ({transcripts.length})
        </Block>

        {/* Content area - loading, empty state, or table */}
        {loading ? (
          <Block padding="40px" textAlign="center" color="#586069">
            Loading...
          </Block>
        ) : transcripts.length === 0 ? (
          <Block padding="40px" textAlign="center" color="#586069">
            No transcripts uploaded yet
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
                <Block textAlign="center">Upload</Block>
                <Block textAlign="center">File</Block>
                <Block textAlign="center">Timestamp</Block>
                <Block textAlign="center">Duration</Block>
                <Block textAlign="center">#Phrases</Block>
                <Block textAlign="center">Language</Block>
                <Block textAlign="center">Quality</Block>
                <Block textAlign="center">Action</Block>
              </Block>

              {/* Table Rows */}
              {transcripts.map((transcript) => (
                <TranscriptRow
                  key={transcript.id}
                  transcript={transcript}
                  isGenerating={generatingId === transcript.id}
                  onGenerate={handleGenerateTutorial}
                />
              ))}
            </Block>
          </Block>
        )}
      </Block>

      {/* Tutorials Section */}
      <Block
        backgroundColor="white"
        borderRadius="12px"
        boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
        marginBottom="24px"
        overflow="hidden"
      >
        {/* Section header */}
        <Block
          display="flex"
          alignItems="center"
          gap="8px"
          padding="20px"
          borderBottom="1px solid #e1e4e8"
          fontSize="20px"
          fontWeight={600}
          color="#24292e"
        >
          <BookOpen size={20} />
          My Tutorials ({tutorials.length})
        </Block>

        {/* Content area - loading, empty state, or tutorial grid */}
        {tutorialsLoading ? (
          <Block padding="40px" textAlign="center" color="#586069">
            Loading tutorials...
          </Block>
        ) : tutorials.length === 0 ? (
          <Block padding="40px" textAlign="center" color="#586069">
            No tutorials generated yet
          </Block>
        ) : (
          <Block 
            padding="20px"
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))"
            gap="16px"
          >
            {tutorials.map((tutorial) => (
              <TutorialCard
                key={tutorial.id}
                tutorial={tutorial}
                onClick={handleTutorialClick}
              />
            ))}
          </Block>
        )}
      </Block>

      {/* Tutorial Modal for viewing/editing */}
      <TutorialModal
        tutorial={selectedTutorial}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTutorial(null);
        }}
        onSave={handleTutorialSave}
        onDelete={handleTutorialDelete}
      />

      {/* Toast notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={hide}
      />
    </Block>
  );
}; 