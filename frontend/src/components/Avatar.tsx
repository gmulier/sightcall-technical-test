import React from 'react';
import { Block } from 'jsxstyle';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 50 
}) => {
  if (src) {
    // Cas avec image
    return (
      <Block
        component="img"
        width={`${size}px`}
        height={`${size}px`}
        borderRadius="50%"
        overflow="hidden"
        props={{ src, alt }}
      />
    );
  }

  // Cas sans image - afficher initiale
  return (
    <Block
      width={`${size}px`}
      height={`${size}px`}
      borderRadius="50%"
      backgroundColor="#e1e4e8"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontSize="18px"
      fontWeight={600}
      color="#586069"
    >
      {alt.charAt(0).toUpperCase()}
    </Block>
  );
}; 