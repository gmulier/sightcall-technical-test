import React from 'react';
import { Block } from 'jsxstyle';
import { BookOpen } from 'lucide-react';
import { TutorialCard } from '../../../components';
import { TutorialsSectionProps } from '../types';

export const TutorialsSection: React.FC<TutorialsSectionProps> = ({
  tutorials,
  loading,
  onSelect
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
        <BookOpen size={20} />
        My Tutorials ({tutorials.length})
      </Block>

      {/* Content area - loading, empty state, or tutorial grid */}
      {loading ? (
        <Block padding="40px" textAlign="center" color="#586069">
          Loading tutorials...
        </Block>
      ) : tutorials.length === 0 ? (
        <Block padding="40px" textAlign="center" color="#586069">
          No tutorials generated yet
        </Block>
      ) : (
        <Block 
          padding="20px"
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))"
          gap="16px"
        >
          {tutorials.map((tutorial) => (
            <TutorialCard
              key={tutorial.id}
              tutorial={tutorial}
              onClick={onSelect}
            />
          ))}
        </Block>
      )}
    </Block>
  );
}; 