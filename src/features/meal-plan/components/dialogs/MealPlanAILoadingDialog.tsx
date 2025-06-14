
import React from 'react';
import { UnifiedAILoadingDialog } from '@/components/ai/UnifiedAILoadingDialog';
import { useAILoadingSteps } from '@/hooks/useAILoadingSteps';

interface MealPlanAILoadingDialogProps {
  isGenerating: boolean;
  onClose: () => void;
  position?: 'center' | 'top-right';
}

export const MealPlanAILoadingDialog = ({
  isGenerating,
  onClose,
  position = 'center'
}: MealPlanAILoadingDialogProps) => {
  const steps = [
    { id: 'analyze-preferences', label: 'Analyzing your preferences', estimatedDuration: 2 },
    { id: 'calculate-nutrition', label: 'Calculating nutritional requirements', estimatedDuration: 2 },
    { id: 'generate-meals', label: 'Generating meal combinations', estimatedDuration: 3 },
    { id: 'optimize-balance', label: 'Optimizing for variety and balance', estimatedDuration: 2 },
    { id: 'finalize-plan', label: 'Finalizing your meal plan', estimatedDuration: 1 }
  ];

  const { currentStepIndex, isComplete } = useAILoadingSteps(
    steps,
    isGenerating,
    {
      autoProgress: true,
      stepDuration: 2000
    }
  );

  return (
    <UnifiedAILoadingDialog
      isOpen={isGenerating}
      onClose={onClose}
      title="Generating Your Meal Plan"
      description="Creating personalized meals just for you..."
      steps={steps}
      currentStepIndex={currentStepIndex}
      isComplete={isComplete}
      position={position}
    />
  );
};
