import { Tutorial } from '../../types';

export interface TutorialModalProps {
  tutorial: Tutorial | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (tutorial: Tutorial) => void;
  onDelete: (tutorialId: string) => void;
}

export interface TutorialHeaderProps {
  title: string;
  onClose: () => void;
}

export interface TutorialBodyProps {
  tutorial: Tutorial;
  isEditing: boolean;
  onTutorialChange: (tutorial: Tutorial) => void;
}

export interface TutorialFooterProps {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
  onExportZip: () => void;
} 