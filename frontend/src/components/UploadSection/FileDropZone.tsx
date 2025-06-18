import React, { useCallback } from 'react';
import { Block } from 'jsxstyle';
import { FileDropZoneProps } from './types';

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  accept,
  onFileSelect,
  isDragActive,
  resetDragState,
  children
}) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    resetDragState();
  }, [resetDragState]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    resetDragState();
    
    const files = Array.from(e.dataTransfer.files);
    let matchingFile: File | undefined;
    
    if (accept === 'application/json') {
      // JSON file detection
      matchingFile = files.find(file => 
        file.name.toLowerCase().endsWith('.json') || 
        file.type === 'application/json'
      );
    } else if (accept.includes('video')) {
      // Video file detection
      matchingFile = files.find(file => 
        file.type.startsWith('video/') ||
        /\.(mp4|mov|avi|mkv|webm)$/i.test(file.name)
      );
    } else {
      // Generic file type matching
      matchingFile = files.find(file => 
        file.type.match(accept.replace('*', '.*'))
      );
    }
    
    if (matchingFile) {
      onFileSelect(matchingFile);
    }
  }, [accept, onFileSelect, resetDragState]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <Block position="relative">
      <Block
        component="input"
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        opacity="0"
        cursor="pointer"
        props={{
          type: 'file',
          accept,
          onChange: handleFileInputChange
        }}
      />
      <Block
        padding="12px"
        border="1px dashed #d1d5da"
        borderRadius="6px"
        textAlign="center"
        cursor="pointer"
        hoverBackgroundColor="white"
        transition="all 0.2s ease"
        props={{
          onDragOver: handleDragOver,
          onDragLeave: handleDragLeave,
          onDrop: handleDrop
        }}
      >
        {children}
      </Block>
    </Block>
  );
}; 