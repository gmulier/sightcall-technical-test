import { useState, useCallback } from 'react';
import { api } from '../../../utils/api';
import { useData } from '../../../hooks/useData';
import { Tutorial } from '../../../types';
import { TutorialsManager } from '../types';

export const useTutorialsManager = (
  showToast?: (message: string, type: 'success' | 'error') => void
): TutorialsManager & { refetchTutorials: () => void } => {
  const { tutorials, tutorialsLoading: loading, refetchTutorials } = useData();
  const [selected, setSelectedInternal] = useState<Tutorial | null>(null);

  const setSelected = useCallback((tutorial: Tutorial | null) => {
    setSelectedInternal(tutorial);
  }, []);

  const save = useCallback(async (tutorial: Tutorial) => {
    try {
      await api.updateTutorial(tutorial);
      showToast?.('Tutorial updated successfully', 'success');
      refetchTutorials();
    } catch (error) {
      showToast?.('Tutorial update failed', 'error');
    }
  }, [showToast, refetchTutorials]);

  const remove = useCallback(async (tutorialId: string) => {
    try {
      await api.deleteTutorial(tutorialId);
      showToast?.('Tutorial deleted successfully', 'success');
      refetchTutorials();
    } catch (error) {
      showToast?.('Tutorial deletion failed', 'error');
    }
  }, [showToast, refetchTutorials]);

  return {
    tutorials,
    loading,
    selected,
    setSelected,
    save,
    remove,
    refetchTutorials
  };
}; 