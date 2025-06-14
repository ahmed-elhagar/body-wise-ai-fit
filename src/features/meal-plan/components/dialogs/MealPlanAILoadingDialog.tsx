
import { UnifiedAILoadingDialog } from "@/components/ai/UnifiedAILoadingDialog";
import { useAILoadingSteps } from "@/hooks/useAILoadingSteps";
import type { AIStep } from "@/components/ai/AILoadingSteps";

interface MealPlanAILoadingDialogProps {
  isGenerating: boolean;
  onClose: () => void;
  position?: string;
}

const mealPlanSteps: AIStep[] = [
  { id: 'analyze', label: 'Analyzing your profile...', estimatedDuration: 3 },
  { id: 'nutrition', label: 'Calculating nutritional needs...', estimatedDuration: 3 },
  { id: 'generate', label: 'Creating personalized recipes...', estimatedDuration: 4 },
  { id: 'balance', label: 'Balancing meal nutrients...', estimatedDuration: 3 },
  { id: 'finalize', label: 'Finalizing your meal plan...', estimatedDuration: 2 },
];

export const MealPlanAILoadingDialog = ({ isGenerating, onClose, position = "center" }: MealPlanAILoadingDialogProps) => {
  const { currentStepIndex, isComplete } = useAILoadingSteps(
    mealPlanSteps,
    isGenerating
  );

  return (
    <UnifiedAILoadingDialog
      isOpen={isGenerating}
      onClose={onClose}
      title={isComplete ? "Meal Plan Ready!" : "Generating Your Meal Plan"}
      description={isComplete ? "Your plan has been successfully created." : "Please wait while we create your personalized meals..."}
      steps={mealPlanSteps}
      currentStepIndex={currentStepIndex}
      position={position as "center" | "top-right"}
    />
  );
};

