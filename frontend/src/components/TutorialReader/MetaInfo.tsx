import React from 'react';
import { Block } from 'jsxstyle';
import { tutorialStyles } from '../../styles/tutorialStyles';

interface MetaInfoProps {
  label: string;
  value: string;
}

export const MetaInfo: React.FC<MetaInfoProps> = ({ label, value }) => (
  <Block {...tutorialStyles.metaInfo}>
    <Block component="strong" {...tutorialStyles.metaLabel}>
      {label}:{' '}
    </Block>
    <Block component="span" {...tutorialStyles.metaText}>
      {value}
    </Block>
  </Block>
); 