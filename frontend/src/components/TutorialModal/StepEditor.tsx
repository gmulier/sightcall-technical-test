import React from 'react';
import { Block } from 'jsxstyle';
import { TutorialStep } from '../../types';
import { Button } from '../Button';

interface StepEditorProps {
  step: TutorialStep;
  stepIndex: number;
  onStepChange: (step: TutorialStep) => void;
  onRemoveStep: () => void;
  onRemoveVideo: () => void;
}

export const StepEditor: React.FC<StepEditorProps> = ({
  step,
  stepIndex,
  onStepChange,
  onRemoveStep,
  onRemoveVideo
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onStepChange({
      ...step,
      text: e.target.value
    });
  };

  const handleRemoveVideo = () => {
    if (window.confirm('Are you sure you want to remove this video clip?')) {
      onRemoveVideo();
    }
  };

  const handleRemoveStep = () => {
    if (window.confirm('Are you sure you want to remove this step?')) {
      onRemoveStep();
    }
  };

  return (
    <Block
      border="1px solid #e1e4e8"
      borderRadius="8px"
      padding="16px"
      marginBottom="12px"
      backgroundColor="#f8f9fa"
    >
      {/* Step header */}
      <Block
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="12px"
      >
        <Block fontSize="16px" fontWeight={600} color="#24292e">
          Step #{stepIndex + 1}
        </Block>
        <Button
          variant="secondary"
          onClick={handleRemoveStep}
        >
          Remove step
        </Button>
      </Block>

      {/* Step text editor */}
      <Block marginBottom="12px">
        <Block fontSize="14px" fontWeight={600} marginBottom="4px">
          Step description
        </Block>
        <Block
          component="textarea"
          width="100%"
          height="80px"
          border="1px solid #d1d5da"
          borderRadius="6px"
          padding="8px"
          fontSize="14px"
          resize="vertical"
          backgroundColor="white"
          boxSizing="border-box"
          props={{
            value: step.text,
            onChange: handleTextChange,
            placeholder: "Describe this step..."
          }}
        />
      </Block>

      {/* Video clip section */}
      {step.video_clip && (
        <Block
          border="1px solid #d1d5da"
          borderRadius="6px"
          padding="12px"
          backgroundColor="white"
          marginBottom="8px"
          position="relative"
        >
          {/* Close button */}
          <Block
            position="absolute"
            top="8px"
            right="8px"
            width="20px"
            height="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="50%"
            backgroundColor="transparent"
            cursor="pointer"
            fontSize="16px"
            color="#6a737d"
            hoverBackgroundColor="#f6f8fa"
            hoverColor="#24292e"
            transition="all 0.2s ease"
            props={{
              onClick: handleRemoveVideo,
              title: "Remove video clip"
            }}
          >
            ×
          </Block>

          <Block fontSize="14px" fontWeight={600} marginBottom="8px">
            Linked video clip
          </Block>

          <Block
            padding="12px"
            backgroundColor="#f1f3f4"
            borderRadius="4px"
            fontSize="14px"
            color="#586069"
          >
            Video clip ({step.video_clip.start}s - {step.video_clip.end}s)
            {step.video_clip.file_url && (
              <>
                <br />
                <em>File: {step.video_clip.file_url}</em>
              </>
            )}
          </Block>
        </Block>
      )}
    </Block>
  );
}; 