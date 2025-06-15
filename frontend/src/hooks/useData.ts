import { useState, useEffect, useCallback } from 'react';
import { Transcript, Tutorial } from '../types';
import { api } from '../utils/api';

export const useData = () => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [tutorialsLoading, setTutorialsLoading] = useState(true);

  // Fetch and sort transcripts
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

  // Fetch and sort tutorials
  const fetchTutorials = useCallback(async () => {
    try {
      const data = await api.getTutorials();
      setTutorials(data.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ));
    } catch (error) {
      console.error('Failed to fetch tutorials:', error);
    } finally {
      setTutorialsLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchTranscripts();
    fetchTutorials();
  }, [fetchTranscripts, fetchTutorials]);

  return {
    transcripts,
    tutorials,
    loading,
    tutorialsLoading,
    refetchTranscripts: fetchTranscripts,
    refetchTutorials: fetchTutorials,
  };
}; 