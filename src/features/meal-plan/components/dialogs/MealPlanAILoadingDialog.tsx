
import { UnifiedAILoadingDialog } from "@/components/ai/UnifiedAILoadingDialog";
import { useAILoadingSteps } from "@/features/meal-plan/hooks/useAILoadingSteps";
import { useState, useEffect } from "react";

interface MealPlanAILoadingDialogProps {
  isGenerating: boolean;
  onClose: () => void;
  position?: string;
}

export const MealPlanAILoadingDialog = ({ isGenerating, onClose, position = "center" }: MealPlanAILoadingDialogProps) => {
  const { steps, currentStepIndex, nextStep, resetSteps } = useAILoadingSteps();

  // Auto-progress through steps for demo purposes
  useEffect(() => {
    if (isGenerating) {
      resetSteps();
      const interval = setInterval(() => {
        nextStep();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isGenerating, nextStep, resetSteps]);

  return (
    <UnifiedAILoadingDialog
      isOpen={isGenerating}
      onClose={onClose}
      title="Generating Your Meal Plan"
      description="Please wait while we create your personalized meals..."
      steps={steps}
      currentStepIndex={currentStepIndex}
      position={position as "center" | "top-right"}
    />
  );
};
