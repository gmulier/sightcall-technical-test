import React from 'react';
import { Block } from 'jsxstyle';
import { Tutorial } from '../../types';
import { FieldEditor } from './FieldEditor';
import { StepsEditor } from './StepsEditor';

interface TutorialEditorProps {
  tutorial: Tutorial;
  onTutorialChange: (tutorial: Tutorial) => void;
}

export const TutorialEditor: React.FC<TutorialEditorProps> = ({ 
  tutorial, 
  onTutorialChange 
}) => {
  
  const handleFieldChange = (field: keyof Tutorial) => (value: string) => {
    if (field === 'tags') {
      // Special handling for tags - convert comma-separated string to array
      onTutorialChange({
        ...tutorial,
        tags: value.split(',').map(tag => tag.trim()).filter(tag => tag)
      });
    } else {
      onTutorialChange({
        ...tutorial,
        [field]: value
      });
    }
  };

  const handleStepsChange = (steps: Tutorial['steps']) => {
    onTutorialChange({
      ...tutorial,
      steps
    });
  };

  return (
    <Block display="flex" flexDirection="column" gap="16px">
      <FieldEditor
        label="Title"
        value={tutorial.title}
        onChange={handleFieldChange('title')}
      />

      <FieldEditor
        label="Tags (comma-separated)"
        value={tutorial.tags?.join(', ') || ''}
        onChange={handleFieldChange('tags')}
      />

      <FieldEditor
        label="Read time"
        value={tutorial.duration_estimate || ''}
        onChange={handleFieldChange('duration_estimate')}
        placeholder="e.g., 5 minutes, 10-15 minutes, 1 hour"
      />

      <FieldEditor
        label="Introduction"
        value={tutorial.introduction}
        onChange={handleFieldChange('introduction')}
        type="textarea"
        rows={4}
      />

      <StepsEditor
        steps={tutorial.steps}
        onStepsChange={handleStepsChange}
      />

      <FieldEditor
        label="Summary"
        value={tutorial.summary}
        onChange={handleFieldChange('summary')}
        type="textarea"
        rows={4}
      />
    </Block>
  );
}; 