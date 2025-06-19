import React from 'react';
import { Block } from 'jsxstyle';
import { tutorialStyles } from '../../styles/tutorialStyles';
import { NormalizedStep } from '../../utils/tutorialUtils';
import { VideoClip } from './VideoClip';

interface StepProps {
  step: NormalizedStep;
}

export const Step: React.FC<StepProps> = ({ step }) => (
  <Block {...tutorialStyles.step}>
    <Block {...tutorialStyles.stepText}>
      <Block component="strong" {...tutorialStyles.stepNumber}>
        {step.index}.
      </Block>
      {step.text}
    </Block>
    
    {step.video_clip?.file_url && (
      <VideoClip
        fileUrl={step.video_clip.file_url}
        start={step.video_clip.start}
        end={step.video_clip.end}
      />
    )}
  </Block>
); 