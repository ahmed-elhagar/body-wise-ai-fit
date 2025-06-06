
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Brain, Zap } from 'lucide-react';
import { AILoadingSteps, type AIStep } from './AILoadingSteps';
import { cn } from '@/lib/utils';

export interface UnifiedAILoadingDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  steps: AIStep[];
  currentStepIndex: number;
  isComplete?: boolean;
  progress?: number;
  estimatedTotalTime?: number;
  onClose?: () => void;
  allowClose?: boolean;
  className?: string;
  position?: 'center' | 'top-right'; // Added position prop for more flexible placement
}

export const UnifiedAILoadingDialog: React.FC<UnifiedAILoadingDialogProps> = ({
  isOpen,
  title,
  description,
  steps,
  currentStepIndex,
  isComplete = false,
  progress,
  estimatedTotalTime,
  onClose,
  allowClose = false,
  className,
  position = 'center' // Default to center
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isOpen || isComplete) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isComplete]);

  useEffect(() => {
    if (isOpen && !isComplete) {
      setElapsedTime(0);
    }
  }, [isOpen, isComplete]);

  // Auto-close after completion (give user time to see success message)
  // Reduced from 2000ms to 1500ms for faster auto-close
  useEffect(() => {
    if (isComplete && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onClose]);

  const calculateProgress = () => {
    if (progress !== undefined) return progress;
    if (steps.length === 0) return 0;
    return Math.round((currentStepIndex / Math.max(steps.length - 1, 1)) * 100);
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  // If position is top-right, render a different style of dialog (as an overlay)
  if (position === 'top-right') {
    if (!isOpen) return null;
    
    return (
      <div className={cn(
        "fixed top-20 right-4 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden",
        className
      )}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">{title}</h3>
            </div>
            {isComplete && <Zap className="w-4 h-4 text-green-600" />}
          </div>
          
          <Progress value={calculateProgress()} className="h-1 mb-2" />
          
          {!isComplete ? (
            <p className="text-xs text-gray-600">
              {steps[currentStepIndex]?.label}...
            </p>
          ) : (
            <p className="text-xs text-green-600 font-medium">
              Operation completed successfully!
            </p>
          )}
        </div>
      </div>
    );
  }

  // Standard centered dialog
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={allowClose && onClose ? () => onClose() : undefined}
    >
      <DialogContent 
        className={cn("max-w-lg", className)}
        hideClose={!allowClose}
      >
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-yellow-800" />
              </div>
            </div>
          </div>
          
          <DialogTitle className="text-xl font-bold text-gray-800">
            {title}
          </DialogTitle>
          
          {description && (
            <p className="text-sm text-gray-600 mt-2">
              {description}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-800">
                {calculateProgress()}%
              </span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>

          {/* Time Information */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Elapsed: {formatTime(elapsedTime)}</span>
            {estimatedTotalTime && !isComplete && (
              <span>Est. Total: {formatTime(estimatedTotalTime)}</span>
            )}
            {isComplete && (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Completed!
              </span>
            )}
          </div>

          {/* Steps */}
          <AILoadingSteps
            steps={steps}
            currentStepIndex={currentStepIndex}
            isComplete={isComplete}
          />

          {/* Current Step Highlight */}
          {!isComplete && steps[currentStepIndex] && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-800">
                  Currently: {steps[currentStepIndex].label}
                </span>
              </div>
              {steps[currentStepIndex].description && (
                <p className="text-xs text-blue-600 mt-1 ml-4">
                  {steps[currentStepIndex].description}
                </p>
              )}
            </div>
          )}

          {/* Completion Message */}
          {isComplete && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-sm font-medium text-green-800">
                ✨ AI operation completed successfully!
              </p>
              <p className="text-xs text-green-600 mt-1">
                Your content will be updated shortly...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedAILoadingDialog;
