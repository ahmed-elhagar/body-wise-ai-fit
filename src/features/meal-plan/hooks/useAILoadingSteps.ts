
import { useState, useCallback } from 'react';

type Step = {
  id: string;
  label: string;
  duration: number;
};

export const useAILoadingSteps = () => {
  const initialSteps: Step[] = [
    { id: 'analyze', label: 'Analyzing your profile...', duration: 3000 },
    { id: 'nutrition', label: 'Calculating nutritional needs...', duration: 3000 },
    { id: 'generate', label: 'Creating personalized recipes...', duration: 3000 },
    { id: 'balance', label: 'Balancing meal nutrients...', duration: 3000 },
    { id: 'finalize', label: 'Finalizing your meal plan...', duration: 3000 },
  ];

  const [steps] = useState<Step[]>(initialSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  
  const nextStep = useCallback(() => {
    setCurrentStepIndex(prevIndex => {
      if (prevIndex >= steps.length - 1) return prevIndex;
      return prevIndex + 1;
    });
  }, [steps.length]);
  
  const resetSteps = useCallback(() => {
    setCurrentStepIndex(0);
  }, []);

  return {
    steps,
    currentStepIndex,
    nextStep,
    resetSteps
  };
};
