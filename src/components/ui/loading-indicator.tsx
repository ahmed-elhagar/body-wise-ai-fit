
import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Card } from "./card";

export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingIndicatorProps {
  status: LoadingStatus;
  message?: string;
  description?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card' | 'overlay' | 'inline';
  showIcon?: boolean;
  duration?: number; // Auto-hide success/error after duration (ms)
  onStatusChange?: (status: LoadingStatus) => void;
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
  onStatusChange
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
    
    const iconProps = {
      className: cn(
        "animate-spin-slow",
        size === 'sm' && "w-4 h-4",
        size === 'md' && "w-5 h-5",
        size === 'lg' && "w-6 h-6"
      )
    };

    switch (status) {
      case 'loading':
        return <Loader2 {...iconProps} className={cn(iconProps.className, "text-fitness-primary-500")} />;
      case 'success':
        return <CheckCircle {...iconProps} className={cn(iconProps.className.replace('animate-spin-slow', ''), "text-success-500")} />;
      case 'error':
        return <AlertCircle {...iconProps} className={cn(iconProps.className.replace('animate-spin-slow', ''), "text-error-500")} />;
      case 'idle':
        return <Clock {...iconProps} className={cn(iconProps.className.replace('animate-spin-slow', ''), "text-fitness-neutral-400")} />;
      default:
        return null;
    }
  };

  const getStatusColors = () => {
    switch (status) {
      case 'loading':
        return {
          text: "text-fitness-primary-700",
          bg: "bg-fitness-primary-50",
          border: "border-fitness-primary-200"
        };
      case 'success':
        return {
          text: "text-success-700",
          bg: "bg-success-50",
          border: "border-success-200"
        };
      case 'error':
        return {
          text: "text-error-700",
          bg: "bg-error-50",
          border: "border-error-200"
        };
      case 'idle':
        return {
          text: "text-fitness-neutral-600",
          bg: "bg-fitness-neutral-50",
          border: "border-fitness-neutral-200"
        };
      default:
        return {
          text: "text-fitness-neutral-600",
          bg: "bg-fitness-neutral-50",
          border: "border-fitness-neutral-200"
        };
    }
  };

  const colors = getStatusColors();
  
  const baseClasses = cn(
    "flex items-center gap-3 transition-all duration-300",
    colors.text,
    size === 'sm' && "text-sm",
    size === 'md' && "text-base",
    size === 'lg' && "text-lg"
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
          <div className={cn("font-medium", size === 'sm' && "text-sm")}>
            {message}
          </div>
        )}
        {description && (
          <div className={cn("text-fitness-neutral-500 mt-1", size === 'sm' && "text-xs", size === 'md' && "text-sm")}>
            {description}
          </div>
        )}
      </div>
    </div>
  );

  // Render variants
  switch (variant) {
    case 'card':
      return (
        <Card className={cn("card-padding", colors.bg, colors.border, className)}>
          {content}
        </Card>
      );
    
    case 'overlay':
      if (status === 'idle') return null;
      return (
        <div className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center",
          className
        )}>
          <Card className="card-padding bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-w-sm mx-4">
            {content}
          </Card>
        </div>
      );
    
    case 'inline':
      if (status === 'idle') return null;
      return (
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg",
          colors.bg,
          colors.border,
          "border",
          className
        )}>
          {getIcon()}
          {message && <span className={cn("font-medium", size === 'sm' && "text-sm")}>{message}</span>}
        </div>
      );
    
    default:
      if (status === 'idle') return null;
      return (
        <div className={cn(
          "p-4 rounded-lg border",
          colors.bg,
          colors.border,
          className
        )}>
          {content}
        </div>
      );
  }
};

// Hook for managing loading states
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

export default LoadingIndicator;
