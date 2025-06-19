import React from 'react';
import { Block } from 'jsxstyle';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Block
      minHeight="100vh"
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
      lineHeight="1.6"
      color="#24292e"
    >
      {children}
    </Block>
  );
}; 