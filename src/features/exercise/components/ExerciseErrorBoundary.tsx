
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ExerciseErrorState } from './ExerciseErrorState';

interface ExerciseErrorBoundaryProps {
  children: React.ReactNode;
}

export const ExerciseErrorBoundary = ({ children }: ExerciseErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <ExerciseErrorState 
          error={error}
          onRetry={resetErrorBoundary}
        />
      )}
      onError={(error, errorInfo) => {
        console.error('Exercise Error Boundary caught an error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
