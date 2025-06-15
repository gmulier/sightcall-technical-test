import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error' });

  const show = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  }, []);

  const hide = useCallback(() => setToast({ message: '', type: 'success' }), []);

  return { toast, show, hide };
}; 