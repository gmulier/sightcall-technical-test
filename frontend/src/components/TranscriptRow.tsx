import React from 'react';
import { Block } from 'jsxstyle';
import { Loader2, Play } from 'lucide-react';
import { Transcript } from '../types';
import { formatDateTime, formatDuration, getLanguage, getAverageConfidence } from '../utils/formatters';

interface TranscriptRowProps {
  transcript: Transcript;
  isGenerating: boolean;
  onGenerate: (id: string) => void;
}

export const TranscriptRow: React.FC<TranscriptRowProps> = ({ 
  transcript, 
  isGenerating, 
  onGenerate 
}) => (
  <Block
    display="grid"
    gridTemplateColumns="minmax(100px, 1fr) minmax(150px, 2fr) minmax(140px, 2fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr) minmax(120px, 1fr)"
    gap="16px"
    padding="16px 20px"
    borderBottom="1px solid #e1e4e8"
    fontSize="14px"
    alignItems="center"
    props={{
      style: { ':hover': { backgroundColor: '#f6f8fa' } }
    }}
  >
    <Block color="#586069" textAlign="center">
      {formatDateTime(transcript.created_at)}
    </Block>
    
    <Block color="#586069" textAlign="center" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
      {transcript.filename}
    </Block>
    
    <Block color="#586069" textAlign="center">
      {new Date(transcript.timestamp).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
    </Block>
    
    <Block color="#586069" textAlign="center">
      {formatDuration(transcript.duration_in_ticks)}
    </Block>
    
    <Block color="#586069" textAlign="center">
      {transcript.phrases.length}
    </Block>
    
    <Block color="#586069" textAlign="center">
      {getLanguage(transcript.phrases)}
    </Block>
    
    <Block color="#586069" textAlign="center">
      {getAverageConfidence(transcript.phrases).toFixed(2)}
    </Block>
    
    <Block textAlign="center">
      <Block
        component="button"
        backgroundColor={isGenerating ? "#6a737d" : "#24292e"}
        color="white"
        border="none"
        padding="6px 12px"
        borderRadius="6px"
        fontSize="12px"
        fontWeight={600}
        cursor={isGenerating ? "not-allowed" : "pointer"}
        transition="all 0.2s ease"
        hoverBackgroundColor={isGenerating ? "#6a737d" : "#1b1f23"}
        props={{
          onClick: () => !isGenerating && onGenerate(transcript.id),
          disabled: isGenerating
        }}
      >
        <Block display="flex" alignItems="center" gap="4px">
          {isGenerating ? (
            <>
              <Loader2 size={14} className="spin" />
              Generating...
            </>
          ) : (
            <>
              <Play size={14} />
              Generate
            </>
          )}
        </Block>
      </Block>
    </Block>
  </Block>
);