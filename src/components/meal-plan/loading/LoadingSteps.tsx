
import { memo } from "react";
import { LoadingStepItem } from "./LoadingStepItem";
import { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  duration: number;
}

interface LoadingStepsProps {
  steps: Step[];
  currentStep: number;
}

export const LoadingSteps = memo(({ steps, currentStep }: LoadingStepsProps) => {
  console.log('🔄 LoadingSteps render (memoized):', { 
    totalSteps: steps.length, 
    currentStep,
    stepTitles: steps.map(s => s.title)
  });

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <LoadingStepItem
            key={index} // Use index instead of dynamic key
            icon={step.icon}
            title={step.title}
            description={step.description}
            isActive={isActive}
            isCompleted={isCompleted}
          />
        );
      })}
    </div>
  );
});

LoadingSteps.displayName = 'LoadingSteps';
