import React from 'react';
import { Block } from 'jsxstyle';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
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