import React from 'react';
import { Block } from 'jsxstyle';
import { Tutorial } from '../types';
import { formatDateTime } from '../utils/dateUtils';

/**
 * Props interface for the TutorialCard component
 */
interface TutorialCardProps {
  tutorial: Tutorial;                    // Tutorial data to display
  onClick: (tutorialId: string) => void; // Callback when card is clicked
}

/**
 * TutorialCard Component
 * 
 * Displays a tutorial preview in a card format for the tutorials grid.
 * Shows key information like title, tags, date, and provides click interaction.
 * 
 * Features:
 * - Responsive card layout with flex column structure
 * - Hover effects with smooth transitions
 * - Tag display with overflow handling (shows first 3 tags + count)
 * - Text truncation for long titles
 * - Consistent spacing and typography
 * - Click interaction to open tutorial modal
 * 
 * Layout Structure:
 * - Header: Title (truncated if too long)
 * - Body: Tags with badge styling (flex-grow to fill space)
 * - Footer: Last updated date (fixed at bottom)
 * 
 * @param tutorial - Tutorial object containing all tutorial data
 * @param onClick - Function called with tutorial ID when card is clicked
 */
export const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial, onClick }) => {
  return (
    <Block
      backgroundColor="white"
      padding="16px"
      borderRadius="8px"
      border="1px solid #e1e4e8"
      boxShadow="0 2px 4px rgba(0, 0, 0, 0.08)"
      cursor="pointer"
      transition="all 0.2s ease"
      hoverBoxShadow="0 4px 8px rgba(0, 0, 0, 0.12)"
      minHeight="140px"
      display="flex"
      flexDirection="column"
      props={{
        onClick: () => onClick(tutorial.id),
        style: {
          ':hover': {
            borderColor: '#d0d7de'
          }
        }
      }}
    >
      <Block 
        fontSize="16px" 
        fontWeight={600} 
        marginBottom="8px" 
        color="#24292e"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {tutorial.title}
      </Block>
      
      <Block 
        fontSize="13px" 
        color="#586069" 
        marginBottom="12px"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {tutorial.transcript.filename}
      </Block>
      
      <Block display="flex" alignItems="center" gap="6px" marginBottom="8px" flex="1">
        <Block display="flex" alignItems="center" gap="4px" flex="1" overflow="hidden">
          {tutorial.tags.map(tag => (
            <Block
              key={tag}
              backgroundColor="#f1f8ff"
              color="#0366d6"
              padding="2px 6px"
              borderRadius="10px"
              fontSize="11px"
              fontWeight={500}
              whiteSpace="nowrap"
              flexShrink={0}
            >
              {tag}
            </Block>
          ))}
        </Block>
        <Block fontSize="11px" color="#586069" whiteSpace="nowrap" flexShrink={0}>
          {tutorial.duration_estimate}
        </Block>
      </Block>
      
      <Block 
        display="flex" 
        justifyContent="space-between" 
        fontSize="11px" 
        color="#959da5"
        marginTop="auto"
        gap="8px"
      >
        <Block overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" flex="1" textAlign="right">
          {formatDateTime(tutorial.updated_at)}
        </Block>
      </Block>
    </Block>
  );
}; 