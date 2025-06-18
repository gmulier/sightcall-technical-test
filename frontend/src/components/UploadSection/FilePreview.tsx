import React from 'react';
import { Block } from 'jsxstyle';
import { X } from 'lucide-react';
import { FilePreviewProps } from './types';
import { formatFileSize } from './utils';

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  icon,
  typeLabel
}) => {
  return (
    <Block
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="12px"
      backgroundColor="white"
      border="1px solid #e1e4e8"
      borderRadius="6px"
    >
      <Block>
        <Block fontSize="14px" fontWeight={600} color="#24292e">
          {file.name}
        </Block>
        <Block fontSize="12px" color="#586069">
          {formatFileSize(file.size)} • {typeLabel}
        </Block>
      </Block>
      <Block
        component="button"
        backgroundColor="transparent"
        border="none"
        cursor="pointer"
        padding="4px"
        borderRadius="4px"
        color="#586069"
        hoverBackgroundColor="#f6f8fa"
        props={{ onClick: onRemove }}
      >
        <X size={16} />
      </Block>
    </Block>
  );
}; 