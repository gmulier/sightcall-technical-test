import { useState, useEffect, useCallback } from 'react';
import { Tutorial } from '../types';
import { api } from '../utils/api';

export const useTutorials = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTutorials = useCallback(async () => {
    try {
      const data = await api.getTutorials();
      setTutorials(data.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ));
    } catch (error) {
      console.error('Failed to fetch tutorials:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTutorials();
  }, [fetchTutorials]);

  return {
    tutorials,
    loading,
    refetchTutorials: fetchTutorials,
  };
}; 