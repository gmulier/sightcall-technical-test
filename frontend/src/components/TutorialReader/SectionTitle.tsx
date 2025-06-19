import React from 'react';
import { Block } from 'jsxstyle';
import { tutorialStyles } from '../../styles/tutorialStyles';

interface SectionTitleProps {
  children: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
  <Block component="h2" {...tutorialStyles.section}>
    {children}
  </Block>
); 