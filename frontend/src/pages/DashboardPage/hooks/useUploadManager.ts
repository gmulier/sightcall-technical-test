import { useState, useCallback } from 'react';
import { api } from '../../../utils/api';
import { UploadManager } from '../types';

export const useUploadManager = (
  refetchTranscripts: () => void,
  showToast: (message: string, type: 'success' | 'error') => void
): UploadManager => {
  const [isUploading, setIsUploading] = useState(false);

  const upload = useCallback(async (jsonFile: File, videoFile?: File) => {
    setIsUploading(true);
    try {
      await api.uploadTranscript(jsonFile, videoFile);
      showToast(
        videoFile 
          ? 'Transcript and video uploaded successfully' 
          : 'Transcript uploaded successfully', 
        'success'
      );
      refetchTranscripts();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload error';
      const isDuplicate = errorMsg.includes('duplicate') || errorMsg.includes('unique') || errorMsg.includes('already exists');
      showToast(isDuplicate ? 'Transcript already exists' : 'Upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  }, [showToast, refetchTranscripts]);

  return { upload, isUploading };
}; 