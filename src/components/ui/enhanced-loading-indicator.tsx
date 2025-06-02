
import React from 'react';
import { Card } from './card';
import { Loader2 } from 'lucide-react';

export type LoadingType = 'general' | 'meal-plan' | 'generation' | 'recipe' | 'exercise' | 'analysis';

interface EnhancedLoadingIndicatorProps {
  status: 'loading' | 'success' | 'error';
  type: LoadingType;
  message?: string;
  description?: string;
  variant?: 'card' | 'inline' | 'overlay';
  size?: 'sm' | 'md' | 'lg';
  showSteps?: boolean;
  customSteps?: string[];
  className?: string;
}

const EnhancedLoadingIndicator = ({
  status,
  type,
  message = 'Loading...',
  description,
  variant = 'inline',
  size = 'md',
  showSteps = false,
  customSteps = [],
  className = ''
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
      <Card className={`p-6 text-center ${className}`}>
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner />
          <div>
            <p className="text-gray-600 font-medium">{message}</p>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          {showSteps && customSteps.length > 0 && (
            <div className="space-y-2 w-full">
              {customSteps.map((step, index) => (
                <div key={index} className="text-sm text-gray-500 text-left">
                  {index + 1}. {step}
                </div>
              ))}
            </div>
          )}
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
            <div>
              <p className="text-gray-600 font-medium">{message}</p>
              {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LoadingSpinner />
      <div>
        <span className="text-gray-600">{message}</span>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
    </div>
  );
};

export default EnhancedLoadingIndicator;
export type { EnhancedLoadingIndicatorProps };
