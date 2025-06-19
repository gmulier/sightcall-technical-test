import React, { useState, useEffect, useCallback } from 'react';
import { Block } from 'jsxstyle';
import { TutorialModalProps } from './types';
import { TutorialHeader } from './TutorialHeader';
import { TutorialBody } from './TutorialBody';
import { TutorialFooter } from './TutorialFooter';
import { api } from '../../utils/api';

export const TutorialModal: React.FC<TutorialModalProps> = ({ 
  tutorial, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTutorial, setEditedTutorial] = useState(tutorial);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (tutorial) {
      setEditedTutorial(tutorial);
    }
  }, [tutorial]);

  // Reset editing state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setIsExporting(false);
    }
  }, [isOpen]);

  const handleSave = useCallback(() => {
    if (editedTutorial) {
      onSave(editedTutorial);
      setIsEditing(false);
    }
  }, [editedTutorial, onSave]);

  const handleCancel = useCallback(() => {
    if (tutorial) {
      setEditedTutorial(tutorial);
      setIsEditing(false);
    }
  }, [tutorial]);



  const handleExportZip = useCallback(async () => {
    if (!editedTutorial?.id) return;
    
    setIsExporting(true);
    try {
      const blob = await api.downloadZip(editedTutorial.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tutorial_${editedTutorial.id}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Échec de l'export ZIP.");
    } finally {
      setIsExporting(false);
    }
  }, [editedTutorial]);

  const handleDelete = useCallback(() => {
    if (editedTutorial && window.confirm('Are you sure you want to delete this tutorial? This action cannot be undone.')) {
      onDelete(editedTutorial.id);
      onClose();
    }
  }, [editedTutorial, onDelete, onClose]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  if (!isOpen || !tutorial || !editedTutorial) return null;

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
        <TutorialHeader 
          title={editedTutorial.title} 
          onClose={onClose} 
        />
        
        <TutorialBody
          tutorial={editedTutorial}
          isEditing={isEditing}
          onTutorialChange={setEditedTutorial}
        />
        
        <TutorialFooter
          isEditing={isEditing}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          onDelete={handleDelete}
          onExportZip={handleExportZip}
        />
      </Block>
    </Block>
  );
}; 