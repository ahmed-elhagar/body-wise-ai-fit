
import { useState, useEffect, useCallback } from 'react';
import type { AIStep } from '@/components/ai/AILoadingSteps';

export interface UseAILoadingStepsOptions {
  autoProgress?: boolean;
  stepDuration?: number;
  completionDelay?: number; // Added delay for completion state
}

export const useAILoadingSteps = (
  steps: AIStep[],
  isActive: boolean,
  options: UseAILoadingStepsOptions = {}
) => {
  const { 
    autoProgress = true, 
    stepDuration = 2000,
    completionDelay = 1000 // Default delay after reaching last step
  } = options;
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Reset when becoming active
  useEffect(() => {
    if (isActive) {
      setCurrentStepIndex(0);
      setIsComplete(false);
    }
  }, [isActive]);

  // Auto progress through steps with smarter timing
  useEffect(() => {
    if (!isActive || !autoProgress || isComplete) return;

    // Calculate dynamic step duration based on estimated time if available
    const calcStepDuration = () => {
      const currentStep = steps[currentStepIndex];
      if (currentStep?.estimatedDuration) {
        // Convert estimated seconds to milliseconds, with a minimum
        return Math.max(currentStep.estimatedDuration * 800, 1200);
      }
      return stepDuration;
    };

    const timer = setTimeout(() => {
      setCurrentStepIndex(prev => {
        if (prev >= steps.length - 1) {
          // Last step - add delay before completion
          setTimeout(() => {
            setIsComplete(true);
          }, completionDelay);
          return prev;
        }
        return prev + 1;
      });
    }, calcStepDuration());

    return () => clearTimeout(timer);
  }, [isActive, autoProgress, currentStepIndex, steps, stepDuration, isComplete, completionDelay]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStepIndex(stepIndex);
      setIsComplete(stepIndex >= steps.length - 1);
    }
  }, [steps.length]);

  const nextStep = useCallback(() => {
    setCurrentStepIndex(prev => {
      const next = Math.min(prev + 1, steps.length - 1);
      if (next >= steps.length - 1) {
        setIsComplete(true);
      }
      return next;
    });
  }, [steps.length]);

  const complete = useCallback(() => {
    setCurrentStepIndex(steps.length - 1);
    setIsComplete(true);
  }, [steps.length]);

  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setIsComplete(false);
  }, []);

  const progress = Math.round((currentStepIndex / Math.max(steps.length - 1, 1)) * 100);

  return {
    currentStepIndex,
    isComplete,
    progress,
    goToStep,
    nextStep,
    complete,
    reset
  };
};

export default useAILoadingSteps;
