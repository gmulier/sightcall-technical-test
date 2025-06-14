import React, { useState, useEffect } from 'react';
import { Block } from 'jsxstyle';
import ReactMarkdown from 'react-markdown';
import { Tutorial } from '../types';
import { markdownStyles } from '../styles/markdown';
import { generateMarkdown } from '../utils/markdownGenerator';

interface TutorialModalProps {
  tutorial: Tutorial | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (tutorial: Tutorial) => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ 
  tutorial, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTutorial, setEditedTutorial] = useState<Tutorial | null>(null);

  useEffect(() => {
    if (tutorial) {
      setEditedTutorial({ ...tutorial });
    }
  }, [tutorial]);

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
                <Block fontSize="14px" fontWeight={600} marginBottom="4px">Titre</Block>
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
                <Block fontSize="14px" fontWeight={600} marginBottom="4px">Étapes (une par ligne)</Block>
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
                    value: editedTutorial.steps.join('\n'),
                    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setEditedTutorial({ 
                        ...editedTutorial, 
                        steps: e.target.value.split('\n').filter(step => step.trim()) 
                      })
                  }}
                />
              </Block>

              {/* Summary */}
              <Block>
                <Block fontSize="14px" fontWeight={600} marginBottom="4px">Résumé</Block>
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
              <ReactMarkdown>{currentMarkdown}</ReactMarkdown>
            </Block>
          )}
        </Block>

        {/* Footer */}
        <Block
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding="20px"
          borderTop="1px solid #e1e4e8"
          backgroundColor="#f6f8fa"
          flexShrink={0}
        >
          <Block display="flex" gap="8px">
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
              props={{
                onClick: () => setIsEditing(!isEditing)
              }}
            >
              {isEditing ? 'Aperçu' : 'Éditer'}
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
              props={{ onClick: handleExport }}
            >
              Exporter
            </Block>
          </Block>

          {isEditing && (
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
                props={{ onClick: handleCancel }}
              >
                Annuler
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
                props={{ onClick: handleSave }}
              >
                Enregistrer
              </Block>
            </Block>
          )}
        </Block>
      </Block>
    </Block>
  );
}; 