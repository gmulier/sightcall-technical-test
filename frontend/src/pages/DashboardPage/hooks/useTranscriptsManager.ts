import { useState, useCallback } from 'react';
import { api } from '../../../utils/api';
import { useToast } from '../../../hooks/useToast';
import { useData } from '../../../hooks/useData';
import { TranscriptsManager } from '../types';

export const useTranscriptsManager = (): TranscriptsManager & { refetchTranscripts: () => void } => {
  const { transcripts, loading, refetchTranscripts, refetchTutorials } = useData();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const { show } = useToast();

  const generate = useCallback(async (transcriptId: string) => {
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
  }, [show, refetchTutorials]);

  return {
    transcripts,
    loading,
    generatingId,
    generate,
    refetchTranscripts
  };
}; 