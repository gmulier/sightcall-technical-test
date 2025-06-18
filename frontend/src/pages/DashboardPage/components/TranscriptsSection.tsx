import React from 'react';
import { Block } from 'jsxstyle';
import { ClipboardList } from 'lucide-react';
import { TranscriptRow } from '../../../components';
import { TranscriptsSectionProps } from '../types';

// CSS Grid template for transcript table columns
const GRID_COLUMNS = "minmax(100px, 1fr) minmax(150px, 2fr) minmax(140px, 2fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(120px, 1fr)";

export const TranscriptsSection: React.FC<TranscriptsSectionProps> = ({
  transcripts,
  loading,
  generatingId,
  onGenerate
}) => {
  return (
    <Block
      backgroundColor="white"
      borderRadius="12px"
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
      marginBottom="24px"
      overflow="hidden"
    >
      {/* Section header */}
      <Block
        display="flex"
        alignItems="center"
        gap="8px"
        padding="20px"
        borderBottom="1px solid #e1e4e8"
        fontSize="20px"
        fontWeight={600}
        color="#24292e"
      >
        <ClipboardList size={20} />
        My Transcripts ({transcripts.length})
      </Block>

      {/* Content area - loading, empty state, or table */}
      {loading ? (
        <Block padding="40px" textAlign="center" color="#586069">
          Loading...
        </Block>
      ) : transcripts.length === 0 ? (
        <Block padding="40px" textAlign="center" color="#586069">
          No transcripts uploaded yet
        </Block>
      ) : (
        <Block overflowX="auto">
          <Block minWidth="1000px" width="100%">
            {/* Table Header */}
            <Block
              display="grid"
              gridTemplateColumns={GRID_COLUMNS}
              gap="16px"
              padding="16px 20px"
              backgroundColor="#f6f8fa"
              fontSize="14px"
              fontWeight={600}
              color="#586069"
              borderBottom="1px solid #e1e4e8"
            >
              <Block textAlign="center">Upload</Block>
              <Block textAlign="center">File</Block>
              <Block textAlign="center">Timestamp</Block>
              <Block textAlign="center">Duration</Block>
              <Block textAlign="center">#Phrases</Block>
              <Block textAlign="center">Language</Block>
              <Block textAlign="center">Quality</Block>
              <Block textAlign="center">Action</Block>
            </Block>

            {/* Table Rows */}
            {transcripts.map((transcript) => (
              <TranscriptRow
                key={transcript.id}
                transcript={transcript}
                isGenerating={generatingId === transcript.id}
                onGenerate={onGenerate}
              />
            ))}
          </Block>
        </Block>
      )}
    </Block>
  );
}; 