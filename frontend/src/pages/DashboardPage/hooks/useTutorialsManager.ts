import { useState, useCallback } from 'react';
import { api } from '../../../utils/api';
import { useToast } from '../../../hooks/useToast';
import { useData } from '../../../hooks/useData';
import { Tutorial } from '../../../types';
import { TutorialsManager } from '../types';

export const useTutorialsManager = (): TutorialsManager => {
  const { tutorials, tutorialsLoading: loading, refetchTutorials } = useData();
  const [selected, setSelectedInternal] = useState<Tutorial | null>(null);
  const { show } = useToast();

  const setSelected = useCallback((tutorial: Tutorial | null) => {
    setSelectedInternal(tutorial);
  }, []);

  const save = useCallback(async (tutorial: Tutorial) => {
    try {
      await api.updateTutorial(tutorial);
      show('Tutorial updated successfully', 'success');
      refetchTutorials();
    } catch (error) {
      show('Tutorial update failed', 'error');
    }
  }, [show, refetchTutorials]);

  const remove = useCallback(async (tutorialId: string) => {
    try {
      await api.deleteTutorial(tutorialId);
      show('Tutorial deleted successfully', 'success');
      refetchTutorials();
    } catch (error) {
      show('Tutorial deletion failed', 'error');
    }
  }, [show, refetchTutorials]);

  return {
    tutorials,
    loading,
    selected,
    setSelected,
    save,
    remove
  };
}; 