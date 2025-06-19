import React from 'react';
import { Block } from 'jsxstyle';
import { Tutorial } from '../../types';
import { tutorialStyles } from '../../styles/tutorialStyles';
import { normalizeSteps } from '../../utils/tutorialUtils';
import { MetaInfo } from './MetaInfo';
import { SectionTitle } from './SectionTitle';
import { Step } from './Step';
import { TipsList } from './TipsList';

interface TutorialReaderProps {
  tutorial: Tutorial;
}

export const TutorialReader: React.FC<TutorialReaderProps> = ({ tutorial }) => {
  const normalizedSteps = normalizeSteps(tutorial.steps);
  
  return (
    <Block {...tutorialStyles.container}>
      {/* Title */}
      <Block component="h1" {...tutorialStyles.title}>
        {tutorial.title}
      </Block>

      {/* Tags */}
      {tutorial.tags && tutorial.tags.length > 0 && (
        <MetaInfo label="Tags" value={tutorial.tags.join(', ')} />
      )}

      {/* Read time */}
      {tutorial.duration_estimate && (
        <MetaInfo label="Read time" value={tutorial.duration_estimate} />
      )}

      {/* Introduction */}
      <Block {...tutorialStyles.introduction}>
        {tutorial.introduction}
      </Block>

      {/* Steps Section */}
      <SectionTitle>Steps</SectionTitle>
      <Block marginBottom={tutorialStyles.introduction.marginBottom}>
        {normalizedSteps.map((step, index) => (
          <Step key={index} step={step} />
        ))}
      </Block>

      {/* Tips Section */}
      {tutorial.tips && tutorial.tips.length > 0 && (
        <>
          <SectionTitle>Tips</SectionTitle>
          <TipsList tips={tutorial.tips} />
        </>
      )}

      {/* Summary Section */}
      <SectionTitle>Summary</SectionTitle>
      <Block {...tutorialStyles.introduction}>
        {tutorial.summary}
      </Block>
    </Block>
  );
}; 