
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ExerciseErrorBoundary } from './ExerciseErrorBoundary';

interface ExercisePageLayoutProps {
  children: React.ReactNode;
}

export const ExercisePageLayout = ({ children }: ExercisePageLayoutProps) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ExerciseErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </div>
    </ExerciseErrorBoundary>
  );
};
