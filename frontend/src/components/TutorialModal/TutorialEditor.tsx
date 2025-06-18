import React from 'react';
import { Block } from 'jsxstyle';
import { Tutorial } from '../../types';
import { FieldEditor } from './FieldEditor';

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
    } else if (field === 'steps') {
      // Special handling for steps - convert string lines to step objects
      onTutorialChange({
        ...tutorial,
        steps: value
          .split('\n')
          .filter(step => step.trim())
          .map((text, index) => ({
            index: index + 1,
            text: text,
            timestamp: tutorial.steps[index]?.timestamp,
            video_clip: tutorial.steps[index]?.video_clip
          }))
      });
    } else {
      onTutorialChange({
        ...tutorial,
        [field]: value
      });
    }
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

      <FieldEditor
        label="Steps (step-by-step instructions)"
        value={tutorial.steps.map(step => step.text).join('\n')}
        onChange={handleFieldChange('steps')}
        type="textarea"
        rows={6}
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