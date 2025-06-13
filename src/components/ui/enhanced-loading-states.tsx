
import React from 'react';
import { Loader2, CheckCircle, AlertCircle, Clock, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  variant?: 'spinner' | 'pulse' | 'skeleton' | 'progress' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  description?: string;
  progress?: number;
  className?: string;
}

export const EnhancedLoadingState: React.FC<LoadingStateProps> = ({
  variant = 'spinner',
  size = 'md',
  message,
  description,
  progress,
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <Loader2 className={cn('animate-spin text-primary-500', sizeClasses[size])} />;
      
      case 'pulse':
        return (
          <div className={cn('rounded-full bg-primary-500 animate-pulse', sizeClasses[size])} />
        );
      
      case 'skeleton':
        return (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
            <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
          </div>
        );
      
      case 'progress':
        return (
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress || 0}%` }}
            />
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full bg-primary-500 animate-bounce',
                  sizeClasses[size === 'lg' ? 'md' : 'sm']
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      
      default:
        return <Loader2 className={cn('animate-spin text-primary-500', sizeClasses[size])} />;
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      {renderLoader()}
      {message && (
        <p className={cn(
          'font-medium text-neutral-900',
          size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
        )}>
          {message}
        </p>
      )}
      {description && (
        <p className={cn(
          'text-neutral-600 text-center max-w-sm',
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>
          {description}
        </p>
      )}
      {progress !== undefined && (
        <span className="text-sm font-medium text-neutral-700">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
};

// Status indicator component
interface StatusIndicatorProps {
  status: 'loading' | 'success' | 'error' | 'warning' | 'idle';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  message,
  size = 'md',
  showIcon = true
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'loading':
        return {
          icon: <Activity className={cn('animate-pulse text-primary-500', sizeClasses[size])} />,
          color: 'text-primary-600',
          bgColor: 'bg-primary-50'
        };
      case 'success':
        return {
          icon: <CheckCircle className={cn('text-success-500', sizeClasses[size])} />,
          color: 'text-success-600',
          bgColor: 'bg-success-50'
        };
      case 'error':
        return {
          icon: <AlertCircle className={cn('text-error-500', sizeClasses[size])} />,
          color: 'text-error-600',
          bgColor: 'bg-error-50'
        };
      case 'warning':
        return {
          icon: <AlertCircle className={cn('text-warning-500', sizeClasses[size])} />,
          color: 'text-warning-600',
          bgColor: 'bg-warning-50'
        };
      case 'idle':
      default:
        return {
          icon: <Clock className={cn('text-neutral-400', sizeClasses[size])} />,
          color: 'text-neutral-600',
          bgColor: 'bg-neutral-50'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border',
      config.bgColor,
      config.color
    )}>
      {showIcon && config.icon}
      {message && (
        <span className={cn(
          'font-medium',
          size === 'sm' ? 'text-sm' : 'text-base'
        )}>
          {message}
        </span>
      )}
    </div>
  );
};

// Page loading component
export const PageLoadingState: React.FC<{
  title?: string;
  subtitle?: string;
  variant?: 'minimal' | 'detailed' | 'branded';
}> = ({ title, subtitle, variant = 'detailed' }) => {
  if (variant === 'minimal') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <EnhancedLoadingState size="lg" />
      </div>
    );
  }

  if (variant === 'branded') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto">
            <Activity className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-neutral-900">FitFatta</h2>
            <p className="text-neutral-600">Loading your fitness journey...</p>
          </div>
          <EnhancedLoadingState variant="dots" size="md" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="max-w-md w-full text-center space-y-6 p-6">
        <EnhancedLoadingState 
          variant="spinner" 
          size="lg"
          message={title || "Loading"}
          description={subtitle || "Please wait while we prepare your content..."}
        />
      </div>
    </div>
  );
};
