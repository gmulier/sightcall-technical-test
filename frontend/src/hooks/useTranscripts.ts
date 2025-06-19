import { useState, useEffect, useCallback } from 'react';
import { Transcript } from '../types';
import { api } from '../utils/api';

export const useTranscripts = () => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTranscripts = useCallback(async () => {
    try {
      const data = await api.getTranscripts();
      setTranscripts(data.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
    } catch (error) {
      console.error('Failed to fetch transcripts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTranscripts();
  }, [fetchTranscripts]);

  return {
    transcripts,
    loading,
    refetchTranscripts: fetchTranscripts,
  };
}; 