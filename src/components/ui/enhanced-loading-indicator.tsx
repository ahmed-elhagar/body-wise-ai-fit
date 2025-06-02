
import React from 'react';
import { Loader2, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type LoadingType = 'general' | 'meal-plan' | 'exercise' | 'ai-generation' | 'generation' | 'recipe';

interface EnhancedLoadingIndicatorProps {
  status: 'loading' | 'success' | 'error' | 'timeout';
  message?: string;
  description?: string;
  type?: LoadingType;
  variant?: 'inline' | 'card' | 'overlay';
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  progress?: number;
  showSteps?: boolean;
  customSteps?: string[];
}

export const EnhancedLoadingIndicator: React.FC<EnhancedLoadingIndicatorProps> = ({
  status,
  message,
  description,
  type = 'general',
  variant = 'inline',
  size = 'md',
  showProgress = false,
  progress = 0,
  showSteps = false,
  customSteps = []
}) => {
  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className={cn('animate-spin', getIconSize())} />;
      case 'success':
        return <CheckCircle className={cn('text-green-500', getIconSize())} />;
      case 'error':
        return <AlertCircle className={cn('text-red-500', getIconSize())} />;
      case 'timeout':
        return <Clock className={cn('text-orange-500', getIconSize())} />;
      default:
        return <Loader2 className={cn('animate-spin', getIconSize())} />;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'md': return 'w-6 h-6';
      case 'lg': return 'w-8 h-8';
      default: return 'w-6 h-6';
    }
  };

  const getMessage = () => {
    if (message) return message;
    
    const typeMessages = {
      'meal-plan': {
        loading: 'Loading meal plan...',
        success: 'Meal plan loaded!',
        error: 'Failed to load meal plan',
        timeout: 'Meal plan loading timed out'
      },
      'exercise': {
        loading: 'Loading exercise program...',
        success: 'Exercise program loaded!',
        error: 'Failed to load exercise program',
        timeout: 'Exercise loading timed out'
      },
      'ai-generation': {
        loading: 'AI is generating content...',
        success: 'AI generation complete!',
        error: 'AI generation failed',
        timeout: 'AI generation timed out'
      },
      'generation': {
        loading: 'AI is generating content...',
        success: 'AI generation complete!',
        error: 'AI generation failed',
        timeout: 'AI generation timed out'
      },
      'recipe': {
        loading: 'Loading recipe...',
        success: 'Recipe loaded!',
        error: 'Failed to load recipe',
        timeout: 'Recipe loading timed out'
      },
      'general': {
        loading: 'Loading...',
        success: 'Success!',
        error: 'An error occurred',
        timeout: 'Operation timed out'
      }
    };

    return typeMessages[type][status];
  };

  const content = (
    <div className={cn('flex items-center gap-3', variant === 'card' ? 'p-4' : '')}>
      {getIcon()}
      <div className="flex flex-col gap-1">
        <span className={cn(
          size === 'sm' ? 'text-sm' : 
          size === 'lg' ? 'text-lg' : 'text-base'
        )}>
          {getMessage()}
        </span>
        {description && (
          <span className={cn('text-gray-500', size === 'sm' ? 'text-xs' : 'text-sm')}>
            {description}
          </span>
        )}
        {showProgress && status === 'loading' && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
        {showSteps && customSteps.length > 0 && status === 'loading' && (
          <div className="mt-2 space-y-1">
            {customSteps.map((step, index) => (
              <div key={index} className="text-xs text-gray-500 flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                {step}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="p-6">
          {content}
        </Card>
      </div>
    );
  }

  if (variant === 'card') {
    return <Card>{content}</Card>;
  }

  return content;
};

export default EnhancedLoadingIndicator;
