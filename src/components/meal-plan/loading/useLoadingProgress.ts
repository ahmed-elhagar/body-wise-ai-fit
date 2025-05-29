
import { useEffect, useState, useRef, useCallback } from "react";
import { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  duration: number;
}

export const useLoadingProgress = (steps: Step[], isActive: boolean) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearExistingInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isActive || steps.length === 0) {
      clearExistingInterval();
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    // Clear any existing interval first
    clearExistingInterval();
    
    // Reset state
    setCurrentStep(0);
    setProgress(0);
    startTimeRef.current = Date.now();
    
    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
    
    console.log('🔄 Loading progress started with stable interval:', {
      totalSteps: steps.length,
      totalDuration,
      stepDurations: steps.map(s => s.duration)
    });

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      
      // Calculate overall progress (0-95% to leave room for completion)
      const progressValue = Math.min((elapsed / totalDuration) * 95, 95);
      setProgress(progressValue);

      // Calculate which step we should be on based on elapsed time
      let cumulativeDuration = 0;
      let newCurrentStep = 0;
      
      for (let i = 0; i < steps.length; i++) {
        cumulativeDuration += steps[i].duration;
        if (elapsed <= cumulativeDuration) {
          newCurrentStep = i;
          break;
        }
      }
      
      // If we've exceeded all step durations, stay on the last step
      if (elapsed > totalDuration) {
        newCurrentStep = steps.length - 1;
        setProgress(95); // Cap at 95%
        clearExistingInterval();
        console.log('🔄 Loading progress completed - interval cleared');
        return;
      }
      
      setCurrentStep(newCurrentStep);
      
      console.log('🔄 Loading progress update:', {
        elapsed,
        progress: progressValue,
        currentStep: newCurrentStep,
        stepTitle: steps[newCurrentStep]?.title
      });

    }, 200); // Slightly slower interval for smoother progress

    return () => {
      console.log('🔄 Loading progress cleanup - effect cleanup');
      clearExistingInterval();
    };
  }, [isActive, steps.length, clearExistingInterval]); // Remove steps from dependencies to prevent constant recreation

  return { currentStep, progress };
};
