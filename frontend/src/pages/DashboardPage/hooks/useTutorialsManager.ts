import { useState, useCallback, useEffect } from 'react';
import { api } from '../../../utils/api';
import { useTutorials } from '../../../hooks/useTutorials';
import { Tutorial } from '../../../types';
import { TutorialsManager } from '../types';

export const useTutorialsManager = (
  showToast?: (message: string, type: 'success' | 'error') => void
): TutorialsManager & { refetchTutorials: () => void } => {
  const { tutorials, loading, refetchTutorials } = useTutorials();
  const [selected, setSelectedInternal] = useState<Tutorial | null>(null);

  // Keep selected tutorial in sync with latest data from API
  const selectedId = selected?.id;
  const latestSelected = selectedId ? tutorials.find(t => t.id === selectedId) : null;
  
  // Update selected tutorial when tutorials are refetched
  useEffect(() => {
    if (selectedId && latestSelected && latestSelected !== selected) {
      setSelectedInternal(latestSelected);
    }
  }, [selectedId, latestSelected, selected]);

  const setSelected = useCallback((tutorial: Tutorial | null) => {
    setSelectedInternal(tutorial);
  }, []);

  const save = useCallback(async (tutorial: Tutorial) => {
    try {
      await api.updateTutorial(tutorial);
      showToast?.('Tutorial updated successfully', 'success');
      
      // Update selected tutorial with the saved version immediately
      if (selected?.id === tutorial.id) {
        setSelectedInternal(tutorial);
      }
      
      refetchTutorials();
    } catch (error) {
      showToast?.('Tutorial update failed', 'error');
    }
  }, [showToast, refetchTutorials, selected]);

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