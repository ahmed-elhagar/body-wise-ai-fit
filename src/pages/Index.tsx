
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoadingState } from '@/components/ui/enhanced-loading-states';

const Index = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return <PageLoadingState variant="branded" />;
  }

  // Redirect based on authentication status
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/landing" replace />;
};

export default Index;
