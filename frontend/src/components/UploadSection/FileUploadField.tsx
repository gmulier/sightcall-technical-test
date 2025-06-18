import React from 'react';
import { Block } from 'jsxstyle';
import { FileText, Video, Check } from 'lucide-react';
import { FileUploadFieldProps } from './types';
import { FilePreview } from './FilePreview';
import { FileDropZone } from './FileDropZone';

const FILE_CONFIGS = {
  json: {
    accept: 'application/json,.json',
    icon: <FileText size={18} />,
    label: 'JSON Transcript',
    placeholder: 'Click to select JSON file or drag & drop',
    typeLabel: 'JSON',
    description: undefined
  },
  video: {
    accept: 'video/*,.mp4,.mov,.avi,.mkv,.webm',
    icon: <Video size={18} />,
    label: 'Video File (Optional)',
    placeholder: 'Click to select video file or drag & drop',
    description: 'For automatic asset extraction (MP4, MOV, AVI, etc.)',
    typeLabel: 'VIDEO'
  }
};

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  type,
  file,
  onFileSelect,
  onRemove,
  isDragActive,
  resetDragState
}) => {
  const config = FILE_CONFIGS[type];

  return (
    <Block marginBottom="16px">
      <Block 
        display="flex" 
        alignItems="center" 
        gap="8px" 
        marginBottom="8px"
        fontSize="16px"
        fontWeight={600}
        color="#24292e"
      >
        {config.icon}
        {config.label} {file && <Check size={16} color="#28a745" />}
      </Block>
      
      {file ? (
        <FilePreview
          file={file}
          onRemove={onRemove}
          icon={config.icon}
          typeLabel={config.typeLabel}
        />
      ) : (
        <FileDropZone
          accept={config.accept}
          onFileSelect={onFileSelect}
          isDragActive={isDragActive}
          resetDragState={resetDragState}
        >
          <Block fontSize="14px" color="#586069">
            {config.placeholder}
          </Block>
          {config.description && (
            <Block fontSize="12px" color="#959da5" marginTop="4px">
              {config.description}
            </Block>
          )}
        </FileDropZone>
      )}
    </Block>
  );
}; 