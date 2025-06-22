import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle, AlertCircle, Clock, Sparkles } from "lucide-react";
import { Card } from "./card";

export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingIndicatorProps {
  status: LoadingStatus;
  message?: string;
  description?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'card' | 'overlay' | 'inline' | 'minimal' | 'hero';
  showIcon?: boolean;
  duration?: number; // Auto-hide success/error after duration (ms)
  onStatusChange?: (status: LoadingStatus) => void;
  animated?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  status,
  message,
  description,
  className,
  size = 'md',
  variant = 'default',
  showIcon = true,
  duration,
  onStatusChange,
  animated = true
}) => {
  // Auto-hide success/error states after duration
  React.useEffect(() => {
    if (duration && (status === 'success' || status === 'error')) {
      const timer = setTimeout(() => {
        onStatusChange?.('idle');
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [status, duration, onStatusChange]);

  const getIcon = () => {
    if (!showIcon) return null;
    
    const iconSizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5", 
      lg: "w-6 h-6",
      xl: "w-8 h-8"
    };

    const iconProps = {
      className: cn(
        iconSizes[size],
        animated && "transition-all duration-300"
      )
    };

    switch (status) {
      case 'loading':
        return (
          <div className="relative">
            <Loader2 {...iconProps} className={cn(iconProps.className, "text-brand-primary-500 animate-spin")} />
            {variant === 'hero' && (
              <div className="absolute inset-0 rounded-full bg-brand-primary-500/20 animate-ping"></div>
            )}
          </div>
        );
      case 'success':
        return (
          <div className="relative">
            <CheckCircle {...iconProps} className={cn(iconProps.className, "text-success-500")} />
            {animated && variant !== 'minimal' && (
              <div className="absolute inset-0 rounded-full bg-success-500/20 animate-pulse"></div>
            )}
          </div>
        );
      case 'error':
        return (
          <div className="relative">
            <AlertCircle {...iconProps} className={cn(iconProps.className, "text-error-500")} />
            {animated && variant !== 'minimal' && (
              <div className="absolute inset-0 rounded-full bg-error-500/20 animate-pulse"></div>
            )}
          </div>
        );
      case 'idle':
        return <Clock {...iconProps} className={cn(iconProps.className, "text-brand-neutral-400")} />;
      default:
        return null;
    }
  };

  const getStatusColors = () => {
    switch (status) {
      case 'loading':
        return {
          text: "text-brand-primary-700",
          bg: "bg-brand-primary-50",
          border: "border-brand-primary-200",
          gradient: "bg-gradient-to-r from-brand-primary-50 to-brand-primary-100"
        };
      case 'success':
        return {
          text: "text-success-700",
          bg: "bg-success-50",
          border: "border-success-200",
          gradient: "bg-gradient-to-r from-success-50 to-success-100"
        };
      case 'error':
        return {
          text: "text-error-700",
          bg: "bg-error-50",
          border: "border-error-200",
          gradient: "bg-gradient-to-r from-error-50 to-error-100"
        };
      case 'idle':
        return {
          text: "text-brand-neutral-600",
          bg: "bg-brand-neutral-50",
          border: "border-brand-neutral-200",
          gradient: "bg-gradient-to-r from-brand-neutral-50 to-brand-neutral-100"
        };
      default:
        return {
          text: "text-brand-neutral-600",
          bg: "bg-brand-neutral-50",
          border: "border-brand-neutral-200",
          gradient: "bg-gradient-to-r from-brand-neutral-50 to-brand-neutral-100"
        };
    }
  };

  const colors = getStatusColors();
  
  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  };

  const baseClasses = cn(
    "flex items-center gap-3 transition-all duration-300",
    colors.text,
    textSizes[size],
    animated && "animate-fade-in"
  );

  const content = (
    <div 
      className={baseClasses}
      role="status"
      aria-live="polite"
      aria-busy={status === 'loading'}
      aria-label={message || `Status: ${status}`}
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        {message && (
          <div className={cn(
            "font-semibold",
            size === 'sm' && "text-sm",
            size === 'xl' && "text-xl"
          )}>
            {message}
          </div>
        )}
        {description && (
          <div className={cn(
            "text-brand-neutral-600 mt-1 leading-relaxed",
            size === 'sm' && "text-xs",
            size === 'md' && "text-sm",
            size === 'lg' && "text-base",
            size === 'xl' && "text-lg"
          )}>
            {description}
          </div>
        )}
      </div>
    </div>
  );

  // Enhanced loading dots for certain variants
  const loadingDots = status === 'loading' && (variant === 'hero' || variant === 'overlay') && (
    <div className="flex space-x-1 mt-4">
      <div className="w-2 h-2 bg-brand-primary-500 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-brand-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-brand-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );

  // Render variants
  switch (variant) {
    case 'hero':
      if (status === 'idle') return null;
      return (
        <div className={cn(
          "text-center py-12 px-6",
          animated && "animate-scale-in",
          className
        )}>
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              {getIcon()}
            </div>
            {message && (
              <h3 className={cn("font-bold mb-3", textSizes[size], colors.text)}>
                {message}
              </h3>
            )}
            {description && (
              <p className="text-brand-neutral-600 leading-relaxed">
                {description}
              </p>
            )}
            {loadingDots}
          </div>
        </div>
      );
    
    case 'card':
      return (
        <Card className={cn(
          "p-6 border-2 backdrop-blur-sm",
          colors.gradient,
          colors.border,
          animated && "hover:shadow-lg transition-all duration-300",
          className
        )}>
          {content}
          {loadingDots}
        </Card>
      );
    
    case 'overlay':
      if (status === 'idle') return null;
      return (
        <div className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4",
          animated && "animate-fade-in",
          className
        )}>
          <Card className="p-8 bg-white/95 backdrop-blur-md border-0 shadow-2xl max-w-sm w-full mx-4 text-center">
            <div className="mb-6">
              {getIcon()}
            </div>
            {message && (
              <h3 className={cn("font-bold mb-3", textSizes[size], colors.text)}>
                {message}
              </h3>
            )}
            {description && (
              <p className="text-brand-neutral-600 leading-relaxed">
                {description}
              </p>
            )}
            {loadingDots}
          </Card>
        </div>
      );
    
    case 'inline':
      if (status === 'idle') return null;
      return (
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full border",
          colors.bg,
          colors.border,
          animated && "animate-slide-in-right",
          className
        )}>
          {getIcon()}
          {message && (
            <span className={cn("font-medium", textSizes[size])}>
              {message}
            </span>
          )}
        </div>
      );

    case 'minimal':
      if (status === 'idle') return null;
      return (
        <div className={cn("flex items-center gap-2", className)}>
          {getIcon()}
          {message && (
            <span className={cn("font-medium", colors.text, textSizes[size])}>
              {message}
            </span>
          )}
        </div>
      );
    
    default:
      if (status === 'idle') return null;
      return (
        <div className={cn(
          "p-4 rounded-xl border-2",
          colors.gradient,
          colors.border,
          animated && "animate-fade-in",
          className
        )}>
          {content}
        </div>
      );
  }
};

// Enhanced hook for managing loading states
export const useLoadingState = (initialStatus: LoadingStatus = 'idle') => {
  const [status, setStatus] = React.useState<LoadingStatus>(initialStatus);
  const [message, setMessage] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');

  const updateLoading = React.useCallback((
    newStatus: LoadingStatus, 
    newMessage?: string, 
    newDescription?: string
  ) => {
    setStatus(newStatus);
    if (newMessage !== undefined) setMessage(newMessage);
    if (newDescription !== undefined) setDescription(newDescription);
  }, []);

  const startLoading = React.useCallback((msg?: string, desc?: string) => {
    updateLoading('loading', msg || 'Loading...', desc);
  }, [updateLoading]);

  const setSuccess = React.useCallback((msg?: string, desc?: string) => {
    updateLoading('success', msg || 'Success!', desc);
  }, [updateLoading]);

  const setError = React.useCallback((msg?: string, desc?: string) => {
    updateLoading('error', msg || 'An error occurred', desc);
  }, [updateLoading]);

  const reset = React.useCallback(() => {
    updateLoading('idle', '', '');
  }, [updateLoading]);

  return {
    status,
    message,
    description,
    updateLoading,
    startLoading,
    setSuccess,
    setError,
    reset
  };
};

// Enhanced Loading Page Component
export const LoadingPage: React.FC<{
  message?: string;
  description?: string;
  showLogo?: boolean;
}> = ({ 
  message = "Loading FitFatta...", 
  description = "Preparing your personalized fitness experience",
  showLogo = true 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-white to-brand-secondary-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {showLogo && (
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-primary-600 to-brand-secondary-600 bg-clip-text text-transparent">
              FitFatta
            </h1>
          </div>
        )}
        
        <LoadingIndicator
          status="loading"
          message={message}
          description={description}
          variant="hero"
          size="lg"
          animated={true}
        />
      </div>
    </div>
  );
};

export default LoadingIndicator;
