
import React from 'react';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AIStep {
  id: string;
  label: string;
  description?: string;
  estimatedDuration?: number;
}

export interface AILoadingStepsProps {
  steps: AIStep[];
  currentStepIndex: number;
  isComplete?: boolean;
  className?: string;
}

export const AILoadingSteps: React.FC<AILoadingStepsProps> = ({
  steps,
  currentStepIndex,
  isComplete = false,
  className
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex && !isComplete;
        const isCompleted = index < currentStepIndex || isComplete;
        const isPending = index > currentStepIndex && !isComplete;

        return (
          <div
            key={step.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg transition-all duration-200",
              isActive && "bg-blue-50 border border-blue-200",
              isCompleted && "bg-green-50 border border-green-200",
              isPending && "bg-gray-50 border border-gray-200"
            )}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : isActive ? (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium",
                isActive && "text-blue-800",
                isCompleted && "text-green-800",
                isPending && "text-gray-600"
              )}>
                {step.label}
              </p>
              
              {step.description && (
                <p className={cn(
                  "text-xs mt-1",
                  isActive && "text-blue-600",
                  isCompleted && "text-green-600",
                  isPending && "text-gray-500"
                )}>
                  {step.description}
                </p>
              )}
            </div>
            
            {isActive && step.estimatedDuration && (
              <div className="text-xs text-blue-600 font-medium">
                ~{step.estimatedDuration}s
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AILoadingSteps;
