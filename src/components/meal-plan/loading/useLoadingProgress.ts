
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!isActive || steps.length === 0) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    let elapsed = 0;
    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
    
    console.log('🔄 Loading progress started:', {
      totalSteps: steps.length,
      totalDuration,
      stepDurations: steps.map(s => s.duration)
    });

    const interval = setInterval(() => {
      elapsed += 100;
      
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
      }
      
      setCurrentStep(newCurrentStep);
      
      console.log('🔄 Loading progress update:', {
        elapsed,
        progress: progressValue,
        currentStep: newCurrentStep,
        stepTitle: steps[newCurrentStep]?.title
      });

      // Stop the interval when we've exceeded the total duration
      if (elapsed >= totalDuration) {
        console.log('🔄 Loading progress completed');
        clearInterval(interval);
      }
    }, 100);

    return () => {
      console.log('🔄 Loading progress cleanup');
      clearInterval(interval);
    };
  }, [isActive, steps]);

  return { currentStep, progress };
};
