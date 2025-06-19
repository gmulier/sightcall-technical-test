import React from 'react';
import { Block } from 'jsxstyle';
import { tutorialStyles } from '../../styles/tutorialStyles';

interface TipsListProps {
  tips: string[];
}

export const TipsList: React.FC<TipsListProps> = ({ tips }) => (
  <Block component="ul" {...tutorialStyles.list}>
    {tips.map((tip, index) => (
      <Block key={index} component="li" {...tutorialStyles.listItem}>
        {tip}
      </Block>
    ))}
  </Block>
); 