import React, { useCallback } from 'react';
import { UploadSection, TutorialModal, Toast } from '../../components';
import { useToast } from '../../hooks/useToast';
import { PageLayout, TranscriptsSection, TutorialsSection } from './components';
import { useUploadManager, useTranscriptsManager, useTutorialsManager } from './hooks';
import { DashboardPageProps } from './types';

/**
 * DashboardPage Component (Refactored)
 * 
 * Main application dashboard displaying:
 * - User profile header with logout
 * - File upload section for transcripts
 * - Table of uploaded transcripts with generation buttons
 * - Grid of generated tutorials with modal viewing
 * 
 * Features:
 * - Clean separation of concerns with custom hooks
 * - Modular components for each section
 * - Optimized with useCallback for performance
 */
export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
  const { toast, show, hide } = useToast();
  
  // Business logic hooks  
  const { tutorials, loading: tutorialsLoading, selected, setSelected, save, remove, refetchTutorials } = useTutorialsManager(show);
  const { transcripts, loading: transcriptsLoading, generatingId, generate, refetchTranscripts } = useTranscriptsManager(refetchTutorials, show);
  const { upload, isUploading } = useUploadManager(refetchTranscripts, show);

  // Handle tutorial selection with useCallback for performance
  const handleTutorialSelect = useCallback((tutorialId: string) => {
    const tutorial = tutorials.find(t => t.id === tutorialId);
    if (tutorial) {
      setSelected(tutorial);
    }
  }, [tutorials, setSelected]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setSelected(null);
  }, [setSelected]);

  return (
    <PageLayout user={user} onLogout={onLogout}>
      {/* Upload Section */}
      <UploadSection
        onUpload={upload}
        isUploading={isUploading}
      />

      {/* Transcripts Section */}
      <TranscriptsSection
        transcripts={transcripts}
        loading={transcriptsLoading}
        generatingId={generatingId}
        onGenerate={generate}
      />

      {/* Tutorials Section */}
      <TutorialsSection
        tutorials={tutorials}
        loading={tutorialsLoading}
        onSelect={handleTutorialSelect}
      />

      {/* Tutorial Modal for viewing/editing */}
      <TutorialModal
        tutorial={selected}
        isOpen={selected !== null}
        onClose={handleModalClose}
        onSave={save}
        onDelete={remove}
      />

      {/* Toast notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={hide}
      />
    </PageLayout>
  );
}; 