
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ExerciseErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ExerciseErrorFallback = ({ error, resetErrorBoundary }: ExerciseErrorFallbackProps) => {
  return (
    <Card className="p-8 text-center max-w-md mx-auto">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Exercise System Error
      </h3>
      <p className="text-gray-600 mb-4">
        Something went wrong with the exercise system. Please try refreshing.
      </p>
      <div className="text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded font-mono">
        {error.message}
      </div>
      <Button onClick={resetErrorBoundary} className="flex items-center gap-2">
        <RefreshCw className="w-4 h-4" />
        Try Again
      </Button>
    </Card>
  );
};

interface ExerciseErrorBoundaryProps {
  children: React.ReactNode;
}

export const ExerciseErrorBoundary = ({ children }: ExerciseErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      FallbackComponent={ExerciseErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Exercise Error Boundary caught an error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
