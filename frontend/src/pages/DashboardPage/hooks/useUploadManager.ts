import { useState, useCallback } from 'react';
import { api } from '../../../utils/api';
import { useToast } from '../../../hooks/useToast';
import { UploadManager } from '../types';

export const useUploadManager = (refetchTranscripts: () => void): UploadManager => {
  const [isUploading, setIsUploading] = useState(false);
  const { show } = useToast();

  const upload = useCallback(async (jsonFile: File, videoFile?: File) => {
    setIsUploading(true);
    try {
      await api.uploadTranscript(jsonFile, videoFile);
      show(
        videoFile 
          ? 'Transcript and video uploaded successfully' 
          : 'Transcript uploaded successfully', 
        'success'
      );
      refetchTranscripts();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload error';
      const isDuplicate = errorMsg.includes('duplicate') || errorMsg.includes('unique') || errorMsg.includes('already exists');
      show(isDuplicate ? 'Transcript already exists' : 'Upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  }, [show, refetchTranscripts]);

  return { upload, isUploading };
}; 