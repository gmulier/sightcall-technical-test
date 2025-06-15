import React from 'react';
import { Block } from 'jsxstyle';

/**
 * Props interface for the Avatar component
 */
interface AvatarProps {
  src: string;     // URL of the avatar image (typically from GitHub)
  alt: string;     // Alt text for accessibility (typically username)
  size?: number;   // Size in pixels (width and height)
}

/**
 * Avatar Component
 * 
 * Displays a user's profile picture in a circular format.
 * Commonly used to show GitHub profile pictures from OAuth2 data.
 * 
 * Features:
 * - Circular cropping with border-radius
 * - Configurable size (defaults to 40px)
 * - Fallback background color if image fails to load
 * - Proper alt text for accessibility
 * - Smooth edges with object-fit cover
 * 
 * @param src - URL of the avatar image
 * @param alt - Alt text for screen readers (usually username)
 * @param size - Diameter of the avatar in pixels (default: 40)
 */
export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 40  // Default size of 40px
}) => {
  return (
    <Block
      component="img"
      width={`${size}px`}
      height={`${size}px`}
      borderRadius="50%"           // Makes the image circular
      backgroundColor="#f6f8fa"    // Fallback background if image fails
      border="1px solid #e1e4e8"   // Subtle border for definition
      props={{
        src,
        alt,
        style: {
          objectFit: 'cover' as const,  // Ensures image covers the entire circle
          display: 'block'              // Removes inline spacing
        }
      }}
    />
  );
}; 