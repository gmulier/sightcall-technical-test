import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Block } from 'jsxstyle';
import { Layout } from './components';
import { LoginPage, DashboardPage } from './pages';
import { useAuth } from './hooks/useAuth';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <Block
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          fontSize="18px"
          color="#586069"
        >
          <Block
            fontSize="24px"
            marginRight="12px"
            props={{ role: 'img', 'aria-label': 'loading' }}
          >
            ⏳
          </Block>
          Chargement...
        </Block>
      </Layout>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/" replace /> : 
              <LoginPage onLogin={login} />
          } 
        />
        <Route 
          path="/" 
          element={
            isAuthenticated && user ? 
              <DashboardPage user={user} onLogout={logout} /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
