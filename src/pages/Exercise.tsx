
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { ExercisePageLayout } from '@/features/exercise/components';

const Exercise = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <ExercisePageLayout />
      </Layout>
    </ProtectedRoute>
  );
};

export default Exercise;
