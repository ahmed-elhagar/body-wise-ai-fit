
import { useEffect, useState, useRef, useCallback } from "react";
import { LucideIcon } from "lucide-react";

interface Step {
  icon?: LucideIcon;
  title?: string;
  text?: string;
  description?: string;
  duration: number;
  id?: string;
}

export const useLoadingProgress = (steps: Step[], isActive: boolean) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const isActiveRef = useRef<boolean>(false);

  const clearExistingInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Prevent multiple instances
    if (isActiveRef.current === isActive) return;
    isActiveRef.current = isActive;

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
    
    console.log('🔄 Loading progress started:', {
      totalSteps: steps.length,
      totalDuration,
      stepTitles: steps.map(s => s.title || s.text || s.id)
    });

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      
      if (steps.length === 0) return;
      
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
        console.log('🔄 Loading progress completed');
        return;
      }
      
      setCurrentStep(newCurrentStep);

    }, 500); // Slower interval to reduce console spam

    return () => {
      clearExistingInterval();
    };
  }, [isActive, steps.length, clearExistingInterval]);

  return { currentStep, progress };
};
