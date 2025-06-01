
import React from 'react';
import { Loader2, Activity } from 'lucide-react';
import { Card } from './card';

interface EnhancedLoadingIndicatorProps {
  message?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card' | 'minimal';
  showSteps?: boolean;
  customSteps?: string[];
  status?: 'loading' | 'processing' | 'generating';
  type?: 'meal-plan' | 'exercise' | 'general';
}

const EnhancedLoadingIndicator = ({
  message = 'Loading...',
  description,
  size = 'md',
  variant = 'default',
  showSteps = false,
  customSteps = [],
  status = 'loading',
  type = 'general'
}: EnhancedLoadingIndicatorProps) => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const defaultSteps = {
    'meal-plan': [
      'Analyzing your preferences...',
      'Generating personalized meals...',
      'Calculating nutrition values...',
      'Finalizing your meal plan...'
    ],
    'exercise': [
      'Creating your workout plan...',
      'Selecting optimal exercises...',
      'Adjusting difficulty levels...',
      'Preparing your program...'
    ],
    'general': [
      'Processing request...',
      'Gathering data...',
      'Applying preferences...',
      'Completing setup...'
    ]
  };

  const steps = customSteps.length > 0 ? customSteps : defaultSteps[type];

  React.useEffect(() => {
    if (showSteps && steps.length > 0) {
      const interval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % steps.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [showSteps, steps.length]);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const LoadingContent = () => (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-fitness-primary`} />
        {status === 'processing' && (
          <Activity className="absolute inset-0 w-3 h-3 animate-pulse text-fitness-secondary" />
        )}
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="font-semibold text-gray-900">{message}</h3>
        {description && (
          <p className="text-sm text-gray-600 max-w-md">{description}</p>
        )}
        
        {showSteps && steps.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-center space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentStep ? 'bg-fitness-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 animate-fade-in">
              {steps[currentStep]}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  if (variant === 'card') {
    return (
      <Card className="p-8 bg-white border border-gray-200 shadow-sm">
        <LoadingContent />
      </Card>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-fitness-primary`} />
        <span className="text-sm text-gray-600">{message}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <LoadingContent />
    </div>
  );
};

export default EnhancedLoadingIndicator;
