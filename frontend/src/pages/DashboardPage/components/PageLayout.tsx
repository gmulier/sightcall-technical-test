import React from 'react';
import { Block } from 'jsxstyle';
import { LogOut } from 'lucide-react';
import { Button, Avatar } from '../../../components';
import { PageLayoutProps } from '../types';

export const PageLayout: React.FC<PageLayoutProps> = ({ user, onLogout, children }) => {
  return (
    <Block padding="20px">
      {/* Header Section - User profile and logout */}
      <Block
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="white"
        padding="20px"
        borderRadius="12px"
        boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
        marginBottom="24px"
      >
        {/* User profile information */}
        <Block display="flex" alignItems="center" gap="16px">
          <Avatar 
            src={user.avatar_url} 
            alt={user.username}
            size={50}
          />
          <Block>
            <Block
              component="h1"
              fontSize="24px"
              fontWeight={600}
              margin="0 0 4px 0"
              color="#24292e"
            >
              Welcome, {user.username}
            </Block>
            <Block
              fontSize="14px"
              color="#586069"
            >
              {user.email}
            </Block>
          </Block>
        </Block>
        
        {/* Logout button */}
        <Button variant="secondary" onClick={onLogout}>
          <Block display="flex" alignItems="center" gap="8px">
            <LogOut size={16} />
            Logout
          </Block>
        </Button>
      </Block>

      {/* Page content */}
      {children}
    </Block>
  );
}; 