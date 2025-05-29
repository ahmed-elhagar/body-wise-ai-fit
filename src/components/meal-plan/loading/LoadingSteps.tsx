
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

export const LoadingSteps = ({ steps, currentStep }: LoadingStepsProps) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <LoadingStepItem
            key={index}
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
};
