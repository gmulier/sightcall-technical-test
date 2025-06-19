import React from 'react';
import { Block } from 'jsxstyle';
import { TutorialBodyProps } from './types';
import { TutorialViewer } from './TutorialViewer';
import { TutorialEditor } from '../TutorialEditor';

export const TutorialBody: React.FC<TutorialBodyProps> = ({
  tutorial,
  isEditing,
  onTutorialChange
}) => {
  return (
    <Block padding="30px" overflowY="auto" flex="1">
      {isEditing ? (
        <TutorialEditor
          tutorial={tutorial}
          onTutorialChange={onTutorialChange}
        />
      ) : (
        <TutorialViewer tutorial={tutorial} />
      )}
    </Block>
  );
}; 