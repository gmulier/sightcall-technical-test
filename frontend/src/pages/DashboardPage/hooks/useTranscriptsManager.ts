import { useState, useCallback } from 'react';
import { api } from '../../../utils/api';
import { useData } from '../../../hooks/useData';
import { TranscriptsManager } from '../types';

export const useTranscriptsManager = (
  onTutorialGenerated?: () => void,
  showToast?: (message: string, type: 'success' | 'error') => void
): TranscriptsManager & { refetchTranscripts: () => void } => {
  const { transcripts, loading, refetchTranscripts } = useData();
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const generate = useCallback(async (transcriptId: string) => {
    setGeneratingId(transcriptId);
    try {
      await api.generateTutorial(transcriptId);
      showToast?.('Tutorial generated successfully', 'success');
      // Appeler le callback pour rafraîchir les tutoriels
      onTutorialGenerated?.();
    } catch (error) {
      showToast?.('Tutorial generation failed', 'error');
    } finally {
      setGeneratingId(null);
    }
  }, [showToast, onTutorialGenerated]);

  return {
    transcripts,
    loading,
    generatingId,
    generate,
    refetchTranscripts
  };
}; 