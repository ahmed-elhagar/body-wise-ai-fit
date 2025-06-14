
import { useState, useEffect } from 'react';

interface LoadingStep {
  id: string;
  message: string;
  description: string;
}

interface UseAILoadingStepsOptions {
  stepDuration?: number;
}

export const useAILoadingSteps = (
  steps: LoadingStep[],
  isActive: boolean,
  options: UseAILoadingStepsOptions = {}
) => {
  const { stepDuration = 3000 } = options;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setCurrentStepIndex(0);
      setIsComplete(false);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsComplete(true);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isActive, steps.length, stepDuration]);

  const progress = isActive ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  return {
    currentStepIndex,
    currentStep: steps[currentStepIndex],
    isComplete,
    progress
  };
};
