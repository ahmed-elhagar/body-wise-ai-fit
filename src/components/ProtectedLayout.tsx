import React from 'react';
import { ProtectedRoute } from '@/features/auth/components';
import Layout from '@/components/Layout';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  requireRole?: string;
  requireProfile?: boolean;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ 
  children, 
  requireRole, 
  requireProfile 
}) => {
  return (
    <ProtectedRoute requireRole={requireRole} requireProfile={requireProfile}>
      <Layout>
        {children}
      </Layout>
    </ProtectedRoute>
  );
};

export default ProtectedLayout; 