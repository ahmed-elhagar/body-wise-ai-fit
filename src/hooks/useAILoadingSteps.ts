
import { useState, useEffect, useCallback } from 'react';
import type { AIStep } from '@/components/ai/AILoadingSteps';

export interface UseAILoadingStepsOptions {
  autoProgress?: boolean;
  stepDuration?: number;
}

export const useAILoadingSteps = (
  steps: AIStep[],
  isActive: boolean,
  options: UseAILoadingStepsOptions = {}
) => {
  const { autoProgress = true, stepDuration = 2000 } = options;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Reset when becoming active
  useEffect(() => {
    if (isActive) {
      setCurrentStepIndex(0);
      setIsComplete(false);
    }
  }, [isActive]);

  // Auto progress through steps
  useEffect(() => {
    if (!isActive || !autoProgress || isComplete) return;

    const timer = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev >= steps.length - 1) {
          setIsComplete(true);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isActive, autoProgress, stepDuration, steps.length, isComplete]);

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
