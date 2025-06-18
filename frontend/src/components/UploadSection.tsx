import React, { useState } from 'react';
import { Block } from 'jsxstyle';
import { FileText, Video, Upload, X, Check } from 'lucide-react';

interface UploadSectionProps {
  onUpload: (jsonFile: File, videoFile?: File) => Promise<void>;
  isUploading: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onUpload, isUploading }) => {
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    
    // Try to identify JSON file
    const jsonFile = files.find(file => 
      file.name.toLowerCase().endsWith('.json') || 
      file.type === 'application/json'
    );
    
    // Try to identify video file
    const videoFile = files.find(file => 
      file.type.startsWith('video/') ||
      /\.(mp4|mov|avi|mkv|webm)$/i.test(file.name)
    );
    
    if (jsonFile) setJsonFile(jsonFile);
    if (videoFile) setVideoFile(videoFile);
  };

  const handleJsonFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setJsonFile(file);
  };

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideoFile(file);
  };

  const handleUpload = async () => {
    if (!jsonFile) return;
    await onUpload(jsonFile, videoFile || undefined);
    // Reset files after successful upload
    setJsonFile(null);
    setVideoFile(null);
  };

  const removeJsonFile = () => setJsonFile(null);
  const removeVideoFile = () => setVideoFile(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
        border={`2px dashed ${isDragOver ? '#0366d6' : '#d1d5da'}`}
        borderRadius="8px"
        padding="20px"
        backgroundColor={isDragOver ? '#f1f8ff' : '#f6f8fa'}
        transition="all 0.2s ease"
        props={{
          onDragOver: handleDragOver,
          onDragLeave: handleDragLeave,
          onDrop: handleDrop
        }}
      >
        {/* JSON File Section */}
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
            <FileText size={18} />
            JSON Transcript {jsonFile && <Check size={16} color="#28a745" />}
          </Block>
          
          {jsonFile ? (
            <Block
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding="12px"
              backgroundColor="white"
              border="1px solid #e1e4e8"
              borderRadius="6px"
            >
              <Block>
                <Block fontSize="14px" fontWeight={600} color="#24292e">
                  {jsonFile.name}
                </Block>
                <Block fontSize="12px" color="#586069">
                  {formatFileSize(jsonFile.size)} • JSON
                </Block>
              </Block>
              <Block
                component="button"
                backgroundColor="transparent"
                border="none"
                cursor="pointer"
                padding="4px"
                borderRadius="4px"
                color="#586069"
                hoverBackgroundColor="#f6f8fa"
                props={{ onClick: removeJsonFile }}
              >
                <X size={16} />
              </Block>
            </Block>
          ) : (
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
                  accept: 'application/json,.json',
                  onChange: handleJsonFileSelect
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
              >
                <Block fontSize="14px" color="#586069">
                  Click to select JSON file or drag & drop
                </Block>
              </Block>
            </Block>
          )}
        </Block>

        {/* Video File Section (Optional) */}
        <Block>
          <Block 
            display="flex" 
            alignItems="center" 
            gap="8px" 
            marginBottom="8px"
            fontSize="16px"
            fontWeight={600}
            color="#24292e"
          >
            <Video size={18} />
            Video File (Optional) {videoFile && <Check size={16} color="#28a745" />}
          </Block>
          
          {videoFile ? (
            <Block
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding="12px"
              backgroundColor="white"
              border="1px solid #e1e4e8"
              borderRadius="6px"
            >
              <Block>
                <Block fontSize="14px" fontWeight={600} color="#24292e">
                  {videoFile.name}
                </Block>
                <Block fontSize="12px" color="#586069">
                  {formatFileSize(videoFile.size)} • Video
                </Block>
              </Block>
              <Block
                component="button"
                backgroundColor="transparent"
                border="none"
                cursor="pointer"
                padding="4px"
                borderRadius="4px"
                color="#586069"
                hoverBackgroundColor="#f6f8fa"
                props={{ onClick: removeVideoFile }}
              >
                <X size={16} />
              </Block>
            </Block>
          ) : (
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
                  accept: 'video/*,.mp4,.mov,.avi,.mkv,.webm',
                  onChange: handleVideoFileSelect
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
              >
                <Block fontSize="14px" color="#586069">
                  Click to select video file or drag & drop
                </Block>
                <Block fontSize="12px" color="#959da5" marginTop="4px">
                  For automatic asset extraction (MP4, MOV, AVI, etc.)
                </Block>
              </Block>
            </Block>
          )}
        </Block>
      </Block>

      {/* Upload Button */}
      {jsonFile && (
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
            {isUploading ? 'Uploading...' : `Upload ${videoFile ? 'Transcript + Video' : 'Transcript'}`}
          </Block>
          
          {videoFile && (
            <Block fontSize="12px" color="#586069" marginTop="8px">
              💡 The video will be used for automatic screenshot and clip extraction
            </Block>
          )}
        </Block>
      )}
    </Block>
  );
}; 