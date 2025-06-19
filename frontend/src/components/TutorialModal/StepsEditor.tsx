import React from 'react';
import { Block } from 'jsxstyle';
import { TutorialStep } from '../../types';
import { StepEditor } from './StepEditor';
import { Button } from '../Button';

interface StepsEditorProps {
  steps: TutorialStep[];
  onStepsChange: (steps: TutorialStep[]) => void;
}

export const StepsEditor: React.FC<StepsEditorProps> = ({
  steps,
  onStepsChange
}) => {
  const handleStepChange = (stepIndex: number, updatedStep: TutorialStep) => {
    const newSteps = [...steps];
    newSteps[stepIndex] = updatedStep;
    onStepsChange(newSteps);
  };

  const handleRemoveStep = (stepIndex: number) => {
    const newSteps = steps.filter((_, index) => index !== stepIndex);
    // Réindexer les steps
    const reindexedSteps = newSteps.map((step, index) => ({
      ...step,
      index: index + 1
    }));
    onStepsChange(reindexedSteps);
  };

  const handleRemoveVideo = (stepIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex] = {
      ...newSteps[stepIndex],
      video_clip: undefined
    };
    onStepsChange(newSteps);
  };

  const handleAddStep = () => {
    const newStep: TutorialStep = {
      index: steps.length + 1,
      text: '',
      timestamp: undefined,
      video_clip: undefined
    };
    onStepsChange([...steps, newStep]);
  };

  return (
    <Block>
      <Block fontSize="14px" fontWeight={600} marginBottom="8px">
        Tutorial steps
      </Block>
      
      {steps.length === 0 ? (
        <Block
          padding="20px"
          backgroundColor="#f8f9fa"
          border="1px solid #e1e4e8"
          borderRadius="8px"
          textAlign="center"
          marginBottom="16px"
        >
          <Block fontSize="14px" color="#586069" marginBottom="8px">
            No steps defined
          </Block>
          <Block fontSize="12px" color="#6a737d">
            Click "Add step" to get started
          </Block>
        </Block>
      ) : (
        <Block marginBottom="16px">
          {steps.map((step, index) => (
            <StepEditor
              key={index}
              step={step}
              stepIndex={index}
              onStepChange={(updatedStep) => handleStepChange(index, updatedStep)}
              onRemoveStep={() => handleRemoveStep(index)}
              onRemoveVideo={() => handleRemoveVideo(index)}
            />
          ))}
        </Block>
      )}

      <Button
        variant="secondary"
        onClick={handleAddStep}
      >
        + Add step
      </Button>
    </Block>
  );
}; 