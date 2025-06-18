import React from 'react';
import { Block } from 'jsxstyle';

interface FieldEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'input' | 'textarea';
  placeholder?: string;
  rows?: number;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({
  label,
  value,
  onChange,
  type = 'input',
  placeholder = '',
  rows = 3
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <Block>
      <Block fontSize="14px" fontWeight={600} marginBottom="4px">
        {label}
      </Block>
      <Block
        component={type === 'textarea' ? 'textarea' : 'input'}
        width="100%"
        height={type === 'textarea' ? `${rows * 20 + 40}px` : 'auto'}
        border="1px solid #d1d5da"
        borderRadius="6px"
        padding="8px"
        fontSize={type === 'textarea' ? '14px' : '16px'}
        resize={type === 'textarea' ? 'vertical' : undefined}
        props={{
          value,
          onChange: handleChange,
          placeholder,
          ...(type === 'textarea' && { rows })
        }}
      />
    </Block>
  );
}; 