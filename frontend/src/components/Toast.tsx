import React, { useEffect } from 'react';
import { Block } from 'jsxstyle';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

// Theme constants - calculated once
const THEMES = {
  success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724', Icon: CheckCircle },
  error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24', Icon: AlertCircle }
} as const;

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  // Auto-close after 4 seconds when message changes
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const theme = THEMES[type];

  return (
    <Block
      position="fixed"
      top="20px"
      left="50%"
      transform="translateX(-50%)"
      zIndex={9999}
      backgroundColor={theme.bg}
      border={`1px solid ${theme.border}`}
      borderRadius="8px"
      padding="12px 16px"
      display="flex"
      alignItems="center"
      gap="12px"
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
      minWidth="300px"
      maxWidth="500px"
      props={{
        style: {
          animation: 'slideDown 0.3s ease-out',
          '@keyframes slideDown': {
            from: { transform: 'translateX(-50%) translateY(-100%)', opacity: 0 },
            to: { transform: 'translateX(-50%) translateY(0)', opacity: 1 }
          }
        }
      }}
    >
      <theme.Icon size={20} color={theme.text} />
      <Block flex="1" fontSize="14px" fontWeight={500} color={theme.text}>
        {message}
      </Block>
      <Block
        component="button"
        backgroundColor="transparent"
        border="none"
        cursor="pointer"
        padding="4px"
        borderRadius="4px"
        hoverBackgroundColor="rgba(0, 0, 0, 0.1)"
        props={{ onClick: onClose }}
      >
        <X size={16} color={theme.text} />
      </Block>
    </Block>
  );
}; 