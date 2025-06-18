import React, { useState, useEffect } from 'react';
import { Block } from 'jsxstyle';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Edit3, Download, Trash2, X, Save } from 'lucide-react';
import { Tutorial } from '../types';
import { markdownStyles } from '../styles/markdown';
import { generateMarkdown } from '../utils/markdownGenerator';

interface TutorialModalProps {
  tutorial: Tutorial | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (tutorial: Tutorial) => void;
  onDelete: (tutorialId: string) => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ 
  tutorial, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTutorial, setEditedTutorial] = useState<Tutorial | null>(null);

  useEffect(() => {
    if (tutorial) {
      setEditedTutorial({ ...tutorial });
    }
  }, [tutorial]);

  // Reset editing state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  if (!isOpen || !tutorial || !editedTutorial) return null;

  const currentMarkdown = generateMarkdown(editedTutorial);

  const handleSave = () => {
    onSave(editedTutorial);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTutorial({ ...tutorial });
    setIsEditing(false);
  };

  const handleExport = () => {
    const markdown = generateMarkdown(editedTutorial);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editedTutorial.title.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handler for deletion with native confirmation
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this tutorial? This action cannot be undone.')) {
      onDelete(editedTutorial.id);
      onClose(); // Close modal after deletion
    }
  };

  return (
    <Block
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      backgroundColor="rgba(0, 0, 0, 0.5)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
      props={{
        onClick: (e: React.MouseEvent) => {
          if (e.target === e.currentTarget) onClose();
        },
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Escape') onClose();
        }
      }}
    >
      <Block
        backgroundColor="white"
        borderRadius="12px"
        maxWidth="900px"
        height="90vh"
        width="90%"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        boxShadow="0 10px 25px rgba(0, 0, 0, 0.2)"
      >
        {/* Header */}
        <Block
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding="20px"
          borderBottom="1px solid #e1e4e8"
          backgroundColor="#f6f8fa"
          flexShrink={0}
        >
          <Block fontSize="20px" fontWeight={600} color="#24292e">
            {editedTutorial.title}
          </Block>
          
          <Block
            component="button"
            backgroundColor="transparent"
            border="none"
            fontSize="24px"
            cursor="pointer"
            padding="4px"
            props={{ onClick: onClose }}
          >
            ×
          </Block>
        </Block>

        {/* Content */}
        <Block padding="30px" overflowY="auto" flex="1">
          {isEditing ? (
            <Block display="flex" flexDirection="column" gap="16px">
              {/* Title */}
              <Block>
                <Block fontSize="14px" fontWeight={600} marginBottom="4px">Title</Block>
                <Block
                  component="input"
                  width="100%"
                  border="1px solid #d1d5da"
                  borderRadius="6px"
                  padding="8px"
                  fontSize="16px"
                  props={{
                    value: editedTutorial.title,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditedTutorial({ ...editedTutorial, title: e.target.value })
                  }}
                />
              </Block>

              {/* Tags */}
              <Block>
                <Block fontSize="14px" fontWeight={600} marginBottom="4px">Tags (comma-separated)</Block>
                <Block
                  component="input"
                  width="100%"
                  border="1px solid #d1d5da"
                  borderRadius="6px"
                  padding="8px"
                  fontSize="14px"
                  props={{
                    value: editedTutorial.tags?.join(', ') || '',
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditedTutorial({ 
                        ...editedTutorial, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                      })
                  }}
                />
              </Block>

              {/* Duration Estimate */}
              <Block>
                <Block fontSize="14px" fontWeight={600} marginBottom="4px">Read time</Block>
                <Block
                  component="input"
                  width="100%"
                  border="1px solid #d1d5da"
                  borderRadius="6px"
                  padding="8px"
                  fontSize="14px"
                  props={{
                    type: "text",
                    placeholder: "e.g., 5 minutes, 10-15 minutes, 1 hour",
                    value: editedTutorial.duration_estimate || '',
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditedTutorial({ 
                        ...editedTutorial, 
                        duration_estimate: e.target.value 
                      })
                  }}
                />
              </Block>

              {/* Introduction */}
              <Block>
                <Block fontSize="14px" fontWeight={600} marginBottom="4px">Introduction</Block>
                <Block
                  component="textarea"
                  width="100%"
                  height="80px"
                  border="1px solid #d1d5da"
                  borderRadius="6px"
                  padding="8px"
                  fontSize="14px"
                  resize="vertical"
                  props={{
                    value: editedTutorial.introduction,
                    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setEditedTutorial({ ...editedTutorial, introduction: e.target.value })
                  }}
                />
              </Block>

              {/* Steps */}
              <Block>
                <Block fontSize="14px" fontWeight={600} marginBottom="4px">Steps (step-by-step instructions)</Block>
                <Block
                  component="textarea"
                  width="100%"
                  height="120px"
                  border="1px solid #d1d5da"
                  borderRadius="6px"
                  padding="8px"
                  fontSize="14px"
                  resize="vertical"
                  props={{
                    value: editedTutorial.steps.map(step => step.text).join('\n'),
                    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setEditedTutorial({ 
                        ...editedTutorial, 
                        steps: e.target.value.split('\n').filter(step => step.trim()).map((text, index) => ({
                          index: index + 1,
                          text: text,
                          timestamp: editedTutorial.steps[index]?.timestamp,
                          video_clip: editedTutorial.steps[index]?.video_clip
                        }))
                      })
                  }}
                />
              </Block>

              {/* Summary */}
              <Block>
                <Block fontSize="14px" fontWeight={600} marginBottom="4px">Summary</Block>
                <Block
                  component="textarea"
                  width="100%"
                  height="80px"
                  border="1px solid #d1d5da"
                  borderRadius="6px"
                  padding="8px"
                  fontSize="14px"
                  resize="vertical"
                  props={{
                    value: editedTutorial.summary,
                    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setEditedTutorial({ ...editedTutorial, summary: e.target.value })
                  }}
                />
              </Block>
            </Block>
          ) : (
            <Block
              fontSize="16px"
              lineHeight="1.6"
              color="#24292e"
              props={{ style: markdownStyles }}
            >
              {currentMarkdown ? (
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{currentMarkdown}</ReactMarkdown>
              ) : (
                <Block 
                  textAlign="center" 
                  padding="40px" 
                  color="#586069"
                  fontSize="14px"
                >
                  Loading tutorial content...
                </Block>
              )}
            </Block>
          )}
        </Block>

        {/* Footer - Barre d'actions */}
        <Block
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding="20px"
          borderTop="1px solid #e1e4e8"
          backgroundColor="#f6f8fa"
          flexShrink={0}
        >
          {isEditing ? (
            // Edit mode: Delete on left, Cancel/Save on right
            <>
              <Block
                component="button"
                backgroundColor="#dc3545"
                color="white"
                border="none"
                padding="8px 16px"
                borderRadius="6px"
                fontSize="14px"
                fontWeight={600}
                cursor="pointer"
                display="flex"
                alignItems="center"
                gap="8px"
                transition="all 0.2s ease"
                hoverBackgroundColor="#c82333"
                props={{ onClick: handleDelete }}
              >
                <Trash2 size={16} />
                Delete
              </Block>

              <Block display="flex" gap="8px">
                <Block
                  component="button"
                  backgroundColor="#6a737d"
                  color="white"
                  border="none"
                  padding="8px 16px"
                  borderRadius="6px"
                  fontSize="14px"
                  fontWeight={600}
                  cursor="pointer"
                  display="flex"
                  alignItems="center"
                  gap="8px"
                  transition="all 0.2s ease"
                  hoverBackgroundColor="#5a6268"
                  props={{ onClick: handleCancel }}
                >
                  <X size={16} />
                  Cancel
                </Block>
                
                <Block
                  component="button"
                  backgroundColor="#28a745"
                  color="white"
                  border="none"
                  padding="8px 16px"
                  borderRadius="6px"
                  fontSize="14px"
                  fontWeight={600}
                  cursor="pointer"
                  display="flex"
                  alignItems="center"
                  gap="8px"
                  transition="all 0.2s ease"
                  hoverBackgroundColor="#218838"
                  props={{ onClick: handleSave }}
                >
                  <Save size={16} />
                  Save
                </Block>
              </Block>
            </>
          ) : (
            // View mode: Edit on left, Export on right
            <>
              <Block
                component="button"
                backgroundColor="#24292e"
                color="white"
                border="none"
                padding="8px 16px"
                borderRadius="6px"
                fontSize="14px"
                fontWeight={600}
                cursor="pointer"
                display="flex"
                alignItems="center"
                gap="8px"
                transition="all 0.2s ease"
                hoverBackgroundColor="#1b1f23"
                props={{ onClick: () => setIsEditing(true) }}
              >
                <Edit3 size={16} />
                Edit
              </Block>

              <Block
                component="button"
                backgroundColor="#0366d6"
                color="white"
                border="none"
                padding="8px 16px"
                borderRadius="6px"
                fontSize="14px"
                fontWeight={600}
                cursor="pointer"
                display="flex"
                alignItems="center"
                gap="8px"
                transition="all 0.2s ease"
                hoverBackgroundColor="#0256cc"
                props={{ onClick: handleExport }}
              >
                <Download size={16} />
                Export
              </Block>
            </>
          )}
        </Block>
      </Block>
    </Block>
  );
}; 