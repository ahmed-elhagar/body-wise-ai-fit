
import { useState, useEffect, useCallback } from 'react';
import type { AIStep, UseAILoadingStepsOptions } from '../types/AIStep';

export const useAILoadingSteps = (
  steps: AIStep[],
  isActive: boolean,
  options: UseAILoadingStepsOptions = {}
) => {
  const { 
    autoProgress = true, 
    stepDuration = 2000,
    completionDelay = 1000
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

  // Auto progress through steps and handle completion
  useEffect(() => {
    if (!isActive || !autoProgress || isComplete) return;

    if (currentStepIndex >= steps.length - 1) {
      const timer = setTimeout(() => {
        setIsComplete(true);
      }, completionDelay);
      return () => clearTimeout(timer);
    }

    const calcStepDuration = () => {
      const currentStep = steps[currentStepIndex];
      if (currentStep?.estimatedDuration) {
        return Math.max(currentStep.estimatedDuration * 800, 1200);
      }
      return stepDuration;
    };

    const timer = setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
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

  const progress = steps.length > 0 ? Math.round(((currentStepIndex + (isComplete ? 1 : 0)) / steps.length) * 100) : 0;

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
