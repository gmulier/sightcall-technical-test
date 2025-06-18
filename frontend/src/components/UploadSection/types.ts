export interface UploadSectionProps {
  onUpload: (jsonFile: File, videoFile?: File) => Promise<void>;
  isUploading: boolean;
}

export interface FileDropZoneProps {
  accept: string;
  onFileSelect: (file: File) => void;
  isDragActive: boolean;
  resetDragState: () => void;
  children: React.ReactNode;
}

export interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  icon: React.ReactNode;
  typeLabel: string;
}

export interface FileUploadFieldProps {
  type: 'json' | 'video';
  file: File | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  isDragActive: boolean;
  resetDragState: () => void;
}

export interface FileConfig {
  accept: string;
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  description?: string;
} 