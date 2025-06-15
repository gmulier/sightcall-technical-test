import React, { useState, useEffect } from 'react';
import { Block } from 'jsxstyle';
import { FileText, ClipboardList, BookOpen, Loader2, Play, LogOut } from 'lucide-react';
import { Button, Avatar, TutorialCard, TutorialModal } from '../components';
import { User, Transcript, Tutorial } from '../types';
import { formatDateTime } from '../utils/dateUtils';

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

/**
 * Get styling for status messages based on content
 * 
 * @param message - Status message text
 * @returns Object with background color, text color, and icon
 */
const getMessageStyle = (message: string) => {
  if (message.includes('success')) {
    return { bg: '#d4edda', color: '#155724', icon: '✅' };
  }
  if (message === 'Transcript already exists') {
    return { bg: '#fff3cd', color: '#856404', icon: '⚠️' };
  }
  return { bg: '#f8d7da', color: '#721c24', icon: '❌' };
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
  // Status message state for user feedback
  const [message, setMessage] = useState<string>('');
  
  // Transcript data and loading states
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tutorial data and loading states
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [tutorialsLoading, setTutorialsLoading] = useState(true);
  
  // Modal state for tutorial viewing/editing
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Loading state for individual tutorial generation (tracks which transcript is being processed)
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  /**
   * Fetch user's transcripts from the API
   * 
   * Retrieves all transcripts belonging to the authenticated user,
   * sorted by creation date (most recent first).
   */
  const fetchTranscripts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/transcripts/', {
        credentials: 'include'  // Include session cookies for authentication
      });
      if (response.ok) {
        const data = await response.json();
        // Sort transcripts by creation date (newest first)
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

  /**
   * Fetch user's tutorials from the API
   * 
   * Retrieves all tutorials belonging to the authenticated user,
   * sorted by last update date (most recent first).
   */
  const fetchTutorials = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/tutorials/', {
        credentials: 'include'  // Include session cookies for authentication
      });
      if (response.ok) {
        const data = await response.json();
        // Sort tutorials by update date (most recently updated first)
        setTutorials(data.sort((a: Tutorial, b: Tutorial) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        ));
      }
    } catch (error) {
      console.error('Failed to fetch tutorials:', error);
    } finally {
      setTutorialsLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchTranscripts();
    fetchTutorials();
  }, []);

  // Auto-dismiss status messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);  // Cleanup timer on unmount or message change
    }
  }, [message]);

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

    // Prepare form data for multipart upload
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/transcripts/', {
        method: 'POST',
        credentials: 'include',  // Include session cookies
        headers: { 'X-CSRFToken': getCsrfToken() },  // CSRF protection
        body: formData
      });

      if (response.ok) {
        setMessage('Transcript uploaded successfully');
        fetchTranscripts();  // Refresh transcript list
      } else {
        const errorText = await response.text();
        // Handle specific error cases
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

  /**
   * Generate AI tutorial from a transcript
   * 
   * Sends transcript to OpenAI for tutorial generation.
   * Shows loading state and provides user feedback.
   * 
   * @param transcriptId - UUID of the transcript to process
   */
  const handleGenerateTutorial = async (transcriptId: string) => {
    setGeneratingId(transcriptId);  // Show loading state for this specific transcript
    try {
      const response = await fetch(`http://localhost:8000/api/transcripts/${transcriptId}/generate/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'X-CSRFToken': getCsrfToken()  // CSRF protection
        }
      });

      if (response.ok) {
        setMessage('Tutorial generated successfully');
        fetchTutorials();  // Refresh tutorials list to show new tutorial
      } else {
        setMessage('Tutorial generation failed');
      }
    } catch (error) {
      setMessage('Tutorial generation error');
    } finally {
      setGeneratingId(null);  // Clear loading state
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
      const response = await fetch(`http://localhost:8000/api/tutorials/${tutorial.id}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 
          'X-CSRFToken': getCsrfToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: tutorial.title,
          introduction: tutorial.introduction,
          steps: tutorial.steps,
          examples: tutorial.examples,
          summary: tutorial.summary,
          duration_estimate: tutorial.duration_estimate,
          tags: tutorial.tags
        })
      });

      if (response.ok) {
        setMessage('Tutorial updated successfully');
        fetchTutorials();  // Refresh tutorials list
      } else {
        setMessage('Tutorial update failed');
      }
    } catch (error) {
      setMessage('Tutorial update error');
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
      const response = await fetch(`http://localhost:8000/api/tutorials/${tutorialId}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 
          'X-CSRFToken': getCsrfToken()
        }
      });

      if (response.ok) {
        setMessage('Tutorial deleted successfully');
        fetchTutorials();  // Refresh tutorials list
      } else {
        setMessage('Tutorial deletion failed');
      }
    } catch (error) {
      setMessage('Tutorial deletion error');
    }
  };

  // Get styling for current status message
  const messageStyle = message ? getMessageStyle(message) : null;

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

        {/* Status message display */}
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
                  {/* Upload date */}
                  <Block color="#586069" textAlign="center">
                    {formatDateTime(transcript.created_at)}
                  </Block>
                  
                  {/* Filename */}
                  <Block color="#586069" textAlign="center" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                    {transcript.filename}
                  </Block>
                  
                  {/* Original conversation timestamp */}
                  <Block color="#586069" textAlign="center">
                    {new Date(transcript.timestamp).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Block>
                  
                  {/* Duration */}
                  <Block color="#586069" textAlign="center">
                    {formatDuration(transcript.duration_in_ticks)}
                  </Block>
                  
                  {/* Number of phrases */}
                  <Block color="#586069" textAlign="center">
                    {transcript.phrases.length}
                  </Block>
                  
                  {/* Detected language */}
                  <Block color="#586069" textAlign="center">
                    {getLanguage(transcript.phrases)}
                  </Block>
                  
                  {/* Average confidence score */}
                  <Block color="#586069" textAlign="center">
                    {getAverageConfidence(transcript.phrases).toFixed(2)}
                  </Block>
                  
                  {/* Generate tutorial button */}
                  <Block textAlign="center">
                    <Block
                      component="button"
                      backgroundColor={generatingId === transcript.id ? "#6a737d" : "#24292e"}
                      color="white"
                      border="none"
                      padding="6px 12px"
                      borderRadius="6px"
                      fontSize="12px"
                      fontWeight={600}
                      cursor={generatingId === transcript.id ? "not-allowed" : "pointer"}
                      transition="all 0.2s ease"
                      hoverBackgroundColor={generatingId === transcript.id ? "#6a737d" : "#1b1f23"}
                      props={{
                        onClick: () => generatingId === transcript.id ? null : handleGenerateTutorial(transcript.id),
                        disabled: generatingId === transcript.id
                      }}
                    >
                      <Block display="flex" alignItems="center" gap="4px">
                        {generatingId === transcript.id ? (
                          <>
                            <Loader2 size={14} style={{ 
                              animation: 'spin 1s linear infinite',
                              transformOrigin: 'center'
                            }} />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Play size={14} />
                            Generate
                          </>
                        )}
                      </Block>
                    </Block>
                  </Block>
                </Block>
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
    </Block>
  );
}; 