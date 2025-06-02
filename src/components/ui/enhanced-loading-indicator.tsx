
import React from 'react';
import { Card } from './card';
import { Loader2 } from 'lucide-react';

interface EnhancedLoadingIndicatorProps {
  status: 'loading' | 'success' | 'error';
  type: 'general' | 'meal-plan' | 'generation';
  message?: string;
  variant?: 'card' | 'inline' | 'overlay';
  size?: 'sm' | 'md' | 'lg';
}

const EnhancedLoadingIndicator = ({
  status,
  type,
  message = 'Loading...',
  variant = 'inline',
  size = 'md'
}: EnhancedLoadingIndicatorProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const LoadingSpinner = () => (
    <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
  );

  if (variant === 'card') {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner />
          <p className="text-gray-600">{message}</p>
        </div>
      </Card>
    );
  }

  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner />
            <p className="text-gray-600">{message}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner />
      <span className="text-gray-600">{message}</span>
    </div>
  );
};

export default EnhancedLoadingIndicator;
