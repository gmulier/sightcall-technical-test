import React from 'react';
import { Block } from 'jsxstyle';

/**
 * Props interface for the Button component
 */
interface ButtonProps {
  children: React.ReactNode;  // Button content (text, icons, etc.)
  onClick?: () => void;       // Click handler function
  variant?: 'primary' | 'secondary';  // Visual style variant
  disabled?: boolean;         // Whether the button is disabled
}

/**
 * Button Component
 * 
 * A reusable button component with two visual variants:
 * - primary: Dark background for main actions
 * - secondary: Light background for secondary actions
 * 
 * Features:
 * - Hover effects with smooth transitions
 * - Disabled state styling
 * - Consistent padding and typography
 * - Accessible cursor states
 * 
 * @param children - Content to display inside the button
 * @param onClick - Function to call when button is clicked
 * @param variant - Visual style ('primary' or 'secondary')
 * @param disabled - Whether the button should be disabled
 */
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',  // Default to primary variant
  disabled = false      // Default to enabled
}) => {
  // Define styling based on variant and disabled state
  const isPrimary = variant === 'primary';
  
  return (
    <Block
      component="button"
      backgroundColor={isPrimary ? '#24292e' : 'transparent'}
      color={isPrimary ? 'white' : '#24292e'}
      border={isPrimary ? 'none' : '2px solid #24292e'}
      padding="12px 24px"
      borderRadius="8px"
      fontSize="16px"
      fontWeight={600}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.6 : 1}
      transition="all 0.2s ease"
      textDecoration="none"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      gap="8px"
      hoverBackgroundColor={isPrimary ? '#1b1f23' : '#f6f8fa'}
      props={{
        onClick,
        disabled,
        style: {
          outline: 'none',
          fontFamily: 'inherit'
        }
      }}
    >
      {children}
    </Block>
  );
}; 