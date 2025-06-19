import { Tutorial } from '../types';

/**
 * Normalized step interface for consistent handling
 */
export interface NormalizedStep {
  index: number;
  text: string;
  timestamp?: number;
  video_clip?: {
    start: number;
    end: number;
    file_url?: string;
  };
}

/**
 * Normalize step data to consistent format
 * Handles both legacy string format and new object format
 */
export const normalizeStep = (step: any, fallbackIndex: number): NormalizedStep => {
  if (typeof step === 'string') {
    return {
      index: fallbackIndex,
      text: step,
    };
  }
  
  if (typeof step === 'object' && step !== null) {
    return {
      index: step.index || fallbackIndex,
      text: step.text || String(step),
      timestamp: step.timestamp,
      video_clip: step.video_clip,
    };
  }
  
  return {
    index: fallbackIndex,
    text: String(step || ''),
  };
};

/**
 * Normalize all steps in a tutorial
 */
export const normalizeSteps = (steps: Tutorial['steps']): NormalizedStep[] => {
  return steps.map((step, index) => normalizeStep(step, index + 1));
};

/**
 * Get video URL with proper base URL handling
 */
export const getVideoUrl = (fileUrl: string, isLocal = true): string => {
  if (fileUrl.startsWith('http')) {
    return fileUrl;
  }
  
  if (isLocal) {
    return `http://localhost:8000${fileUrl}`;
  }
  
  // For HTML export, use relative path
  const filename = fileUrl.split('/').pop() || fileUrl;
  return `clips/${filename}`;
};

/**
 * Format video timing for display
 */
export const formatVideoTiming = (start: number, end: number): string => {
  return `Video clip: ${start}s - ${end}s`;
};

/**
 * Check if tutorial has any video content
 */
export const hasVideoContent = (tutorial: Tutorial): boolean => {
  const steps = normalizeSteps(tutorial.steps);
  return steps.some(step => step.video_clip?.file_url);
};

/**
 * Get all video clips from tutorial
 */
export const getVideoClips = (tutorial: Tutorial): Array<{ filename: string; url: string }> => {
  const steps = normalizeSteps(tutorial.steps);
  const clips: Array<{ filename: string; url: string }> = [];
  
  steps.forEach(step => {
    if (step.video_clip?.file_url) {
      const url = step.video_clip.file_url;
      const filename = url.split('/').pop() || url;
      clips.push({ filename, url });
    }
  });
  
  return clips;
}; 