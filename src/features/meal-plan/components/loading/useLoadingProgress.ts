
import { useState, useEffect } from 'react';

interface LoadingStep {
  id: string;
  text: string;
  duration?: number;
}

export const useLoadingProgress = (steps: LoadingStep[], isActive: boolean) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    const totalSteps = steps.length;
    if (totalSteps === 0) return;

    const stepDuration = 2000; // 2 seconds per step
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= totalSteps) {
          clearInterval(interval);
          setProgress(100);
          return totalSteps - 1;
        }
        setProgress((next / totalSteps) * 100);
        return next;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [steps, isActive]);

  return { currentStep, progress };
};
