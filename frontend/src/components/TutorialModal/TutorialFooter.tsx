import React from 'react';
import { Block } from 'jsxstyle';
import { Edit3, Download, Trash2, X, Save } from 'lucide-react';
import { TutorialFooterProps } from './types';

export const TutorialFooter: React.FC<TutorialFooterProps> = ({
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  onExport
}) => {
  return (
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
            props={{ onClick: onDelete }}
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
              props={{ onClick: onCancel }}
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
              props={{ onClick: onSave }}
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
            props={{ onClick: onEdit }}
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
            props={{ onClick: onExport }}
          >
            <Download size={16} />
            Export
          </Block>
        </>
      )}
    </Block>
  );
}; 