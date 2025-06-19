import React from 'react';
import { Block } from 'jsxstyle';
import { Tutorial } from '../../types';
import { TutorialReader } from '../TutorialReader';

interface TutorialViewerProps {
  tutorial: Tutorial;
}

export const TutorialViewer: React.FC<TutorialViewerProps> = ({ tutorial }) => {
  return (
    <Block
      fontSize="16px"
      lineHeight="1.6"
      color="#24292e"
    >
      {tutorial ? (
        <TutorialReader tutorial={tutorial} />
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
  );
}; 