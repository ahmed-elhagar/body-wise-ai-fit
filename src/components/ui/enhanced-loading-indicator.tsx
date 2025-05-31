
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle, AlertCircle, Clock, Sparkles, Brain, ChefHat, Target, Dumbbell } from "lucide-react";
import { Card } from "./card";

export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';
export type LoadingType = 'meal-plan' | 'exercise' | 'recipe' | 'analysis' | 'general';

interface LoadingTextConfig {
  initial: string;
  steps: string[];
  success: string;
  error: string;
}

const loadingConfigs: Record<LoadingType, LoadingTextConfig> = {
  'meal-plan': {
    initial: 'Generating your meal plan...',
    steps: [
      'Analyzing your dietary preferences...',
      'Calculating nutritional requirements...',
      'Selecting perfect recipes...',
      'Optimizing meal combinations...',
      'Finalizing your personalized plan...'
    ],
    success: 'Meal plan generated successfully!',
    error: 'Failed to generate meal plan'
  },
  'exercise': {
    initial: 'Creating your workout program...',
    steps: [
      'Analyzing your fitness level...',
      'Selecting appropriate exercises...',
      'Building workout schedule...',
      'Optimizing progression plan...',
      'Finalizing your program...'
    ],
    success: 'Workout program created successfully!',
    error: 'Failed to create workout program'
  },
  'recipe': {
    initial: 'Generating detailed recipe...',
    steps: [
      'Analyzing meal requirements...',
      'Creating ingredient list...',
      'Writing step-by-step instructions...',
      'Adding nutritional information...',
      'Finalizing recipe details...'
    ],
    success: 'Recipe generated successfully!',
    error: 'Failed to generate recipe'
  },
  'analysis': {
    initial: 'Analyzing your data...',
    steps: [
      'Processing uploaded content...',
      'Analyzing nutritional values...',
      'Calculating recommendations...',
      'Generating insights...',
      'Preparing results...'
    ],
    success: 'Analysis completed successfully!',
    error: 'Analysis failed'
  },
  'general': {
    initial: 'Processing...',
    steps: [
      'Initializing request...',
      'Processing data...',
      'Applying changes...',
      'Updating information...',
      'Completing operation...'
    ],
    success: 'Operation completed successfully!',
    error: 'Operation failed'
  }
};

const getIconForType = (type: LoadingType) => {
  switch (type) {
    case 'meal-plan': return ChefHat;
    case 'exercise': return Dumbbell;
    case 'recipe': return Sparkles;
    case 'analysis': return Brain;
    default: return Target;
  }
};

export interface EnhancedLoadingIndicatorProps {
  status: LoadingStatus;
  type?: LoadingType;
  message?: string;
  description?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card' | 'overlay' | 'inline';
  showSteps?: boolean;
  duration?: number;
  onStatusChange?: (status: LoadingStatus) => void;
  customSteps?: string[];
}

const EnhancedLoadingIndicator: React.FC<EnhancedLoadingIndicatorProps> = ({
  status,
  type = 'general',
  message,
  description,
  className,
  size = 'md',
  variant = 'default',
  showSteps = false,
  duration,
  onStatusChange,
  customSteps
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message || loadingConfigs[type].initial);

  const config = loadingConfigs[type];
  const steps = customSteps || config.steps;
  const Icon = getIconForType(type);

  // Auto-hide success/error states after duration
  useEffect(() => {
    if (duration && (status === 'success' || status === 'error')) {
      const timer = setTimeout(() => {
        onStatusChange?.('idle');
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [status, duration, onStatusChange]);

  // Cycle through loading steps
  useEffect(() => {
    if (status === 'loading' && showSteps && steps.length > 0) {
      const stepDuration = 2000; // 2 seconds per step
      const interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          const nextIndex = (prev + 1) % steps.length;
          setCurrentMessage(steps[nextIndex]);
          return nextIndex;
        });
      }, stepDuration);

      return () => clearInterval(interval);
    } else if (status === 'success') {
      setCurrentMessage(config.success);
    } else if (status === 'error') {
      setCurrentMessage(config.error);
    } else if (!message) {
      setCurrentMessage(config.initial);
    }
  }, [status, showSteps, steps, config, message]);

  const getIcon = () => {
    const iconProps = {
      className: cn(
        size === 'sm' && "w-4 h-4",
        size === 'md' && "w-5 h-5",
        size === 'lg' && "w-6 h-6"
      )
    };

    switch (status) {
      case 'loading':
        return <Loader2 {...iconProps} className={cn(iconProps.className, "animate-spin text-fitness-primary-500")} />;
      case 'success':
        return <CheckCircle {...iconProps} className={cn(iconProps.className, "text-success-500")} />;
      case 'error':
        return <AlertCircle {...iconProps} className={cn(iconProps.className, "text-error-500")} />;
      case 'idle':
        return <Clock {...iconProps} className={cn(iconProps.className, "text-fitness-neutral-400")} />;
      default:
        return <Icon {...iconProps} className={cn(iconProps.className, "text-fitness-primary-500")} />;
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
      aria-label={currentMessage}
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        <div className={cn("font-medium", size === 'sm' && "text-sm")}>
          {currentMessage}
        </div>
        {description && (
          <div className={cn("text-fitness-neutral-500 mt-1", size === 'sm' && "text-xs", size === 'md' && "text-sm")}>
            {description}
          </div>
        )}
        {showSteps && status === 'loading' && (
          <div className="mt-2">
            <div className="w-full bg-fitness-neutral-200 rounded-full h-1">
              <div 
                className="bg-fitness-primary-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
            <div className="text-xs text-fitness-neutral-500 mt-1">
              Step {currentStepIndex + 1} of {steps.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render variants
  switch (variant) {
    case 'card':
      return (
        <Card className={cn("p-6", colors.bg, colors.border, className)}>
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
          <Card className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-w-sm mx-4">
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
          <span className={cn("font-medium", size === 'sm' && "text-sm")}>{currentMessage}</span>
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

export default EnhancedLoadingIndicator;
