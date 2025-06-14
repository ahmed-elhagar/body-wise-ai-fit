
import React from 'react';
import { UnifiedAILoadingDialog } from '@/components/ai/UnifiedAILoadingDialog';

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
    { id: 'analyze-preferences', label: 'Analyzing your preferences', duration: 2000 },
    { id: 'calculate-nutrition', label: 'Calculating nutritional requirements', duration: 2000 },
    { id: 'generate-meals', label: 'Generating meal combinations', duration: 3000 },
    { id: 'optimize-balance', label: 'Optimizing for variety and balance', duration: 2000 },
    { id: 'finalize-plan', label: 'Finalizing your meal plan', duration: 1000 }
  ];

  return (
    <UnifiedAILoadingDialog
      isOpen={isGenerating}
      onClose={onClose}
      title="Generating Your Meal Plan"
      description="Creating personalized meals just for you..."
      steps={steps}
      position={position}
    />
  );
};
