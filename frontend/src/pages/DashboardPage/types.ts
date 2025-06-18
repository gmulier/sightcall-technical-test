import { User, Transcript, Tutorial } from '../../types';

export interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

export interface PageLayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

export interface TranscriptsSectionProps {
  transcripts: Transcript[];
  loading: boolean;
  generatingId: string | null;
  onGenerate: (transcriptId: string) => void;
}

export interface TutorialsSectionProps {
  tutorials: Tutorial[];
  loading: boolean;
  onSelect: (tutorialId: string) => void;
}

export interface TranscriptsManager {
  transcripts: Transcript[];
  loading: boolean;
  generatingId: string | null;
  generate: (transcriptId: string) => Promise<void>;
}

export interface TutorialsManager {
  tutorials: Tutorial[];
  loading: boolean;
  selected: Tutorial | null;
  setSelected: (tutorial: Tutorial | null) => void;
  save: (tutorial: Tutorial) => Promise<void>;
  remove: (tutorialId: string) => Promise<void>;
}

export interface UploadManager {
  upload: (jsonFile: File, videoFile?: File) => Promise<void>;
  isUploading: boolean;
} 