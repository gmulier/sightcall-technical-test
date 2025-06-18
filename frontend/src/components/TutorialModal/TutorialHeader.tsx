import React from 'react';
import { Block } from 'jsxstyle';
import { TutorialHeaderProps } from './types';

export const TutorialHeader: React.FC<TutorialHeaderProps> = ({ title, onClose }) => {
  return (
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
        {title}
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
  );
}; 