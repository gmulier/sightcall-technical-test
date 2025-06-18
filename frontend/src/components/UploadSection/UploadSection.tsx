import React, { useState, useCallback } from 'react';
import { Block } from 'jsxstyle';
import { Upload } from 'lucide-react';
import { UploadSectionProps } from './types';
import { FileUploadField } from './FileUploadField';

export const UploadSection: React.FC<UploadSectionProps> = ({ onUpload, isUploading }) => {
  const [files, setFiles] = useState<{ json?: File; video?: File }>({});
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileSelect = useCallback((type: 'json' | 'video', file: File) => {
    setFiles(prev => ({ ...prev, [type]: file }));
  }, []);

  const handleRemove = useCallback((type: 'json' | 'video') => {
    setFiles(prev => {
      const { [type]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleUpload = useCallback(async () => {
    if (!files.json) return;
    await onUpload(files.json, files.video);
    setFiles({});
  }, [files, onUpload]);

  const resetDragState = useCallback(() => {
    setIsDragActive(false);
  }, []);

  return (
    <Block
      backgroundColor="white"
      padding="24px"
      borderRadius="12px"
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
      marginBottom="24px"
    >
      {/* Section title */}
      <Block 
        display="flex"
        alignItems="center"
        gap="8px"
        fontSize="20px" 
        fontWeight={600} 
        marginBottom="16px"
        color="#24292e"
      >
        <Upload size={20} />
        Upload Transcript & Video
      </Block>

      {/* Main upload area */}
      <Block
        border={`2px dashed ${isDragActive ? '#0366d6' : '#d1d5da'}`}
        borderRadius="8px"
        padding="20px"
        backgroundColor={isDragActive ? '#f1f8ff' : '#f6f8fa'}
        transition="all 0.2s ease"
        props={{
          onDragOver: (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragActive(true);
          },
          onDragLeave: (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragActive(false);
          },
          onDrop: (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragActive(false);
            
            const droppedFiles = Array.from(e.dataTransfer.files);
            
            // Try to identify JSON file
            const jsonFile = droppedFiles.find(file => 
              file.name.toLowerCase().endsWith('.json') || 
              file.type === 'application/json'
            );
            
            // Try to identify video file
            const videoFile = droppedFiles.find(file => 
              file.type.startsWith('video/') ||
              /\.(mp4|mov|avi|mkv|webm)$/i.test(file.name)
            );
            
            if (jsonFile) setFiles(prev => ({ ...prev, json: jsonFile }));
            if (videoFile) setFiles(prev => ({ ...prev, video: videoFile }));
          }
        }}
      >
        <FileUploadField
          type="json"
          file={files.json || null}
          onFileSelect={(file) => handleFileSelect('json', file)}
          onRemove={() => handleRemove('json')}
          isDragActive={isDragActive}
          resetDragState={resetDragState}
        />

        <FileUploadField
          type="video"
          file={files.video || null}
          onFileSelect={(file) => handleFileSelect('video', file)}
          onRemove={() => handleRemove('video')}
          isDragActive={isDragActive}
          resetDragState={resetDragState}
        />
      </Block>

      {/* Upload Button */}
      {files.json && (
        <Block marginTop="16px">
          <Block
            component="button"
            backgroundColor={isUploading ? "#6a737d" : "#0366d6"}
            color="white"
            border="none"
            padding="12px 24px"
            borderRadius="6px"
            fontSize="14px"
            fontWeight={600}
            cursor={isUploading ? "not-allowed" : "pointer"}
            display="flex"
            alignItems="center"
            gap="8px"
            hoverBackgroundColor={isUploading ? "#6a737d" : "#0256cc"}
            transition="all 0.2s ease"
            props={{ 
              onClick: handleUpload,
              disabled: isUploading
            }}
          >
            <Upload size={16} />
            {isUploading ? 'Uploading...' : `Upload ${files.video ? 'Transcript + Video' : 'Transcript'}`}
          </Block>
          
          {files.video && (
            <Block fontSize="12px" color="#586069" marginTop="8px">
              💡 The video will be used for automatic screenshot and clip extraction
            </Block>
          )}
        </Block>
      )}
    </Block>
  );
}; 