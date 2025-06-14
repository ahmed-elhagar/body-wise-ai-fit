
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { ExercisePageContainer } from '@/features/exercise/components';

const Exercise = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <ExercisePageContainer />
      </Layout>
    </ProtectedRoute>
  );
};

export default Exercise;
