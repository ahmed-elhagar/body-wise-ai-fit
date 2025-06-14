
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
    { label: 'Analyzing your preferences', duration: 2000 },
    { label: 'Calculating nutritional requirements', duration: 2000 },
    { label: 'Generating meal combinations', duration: 3000 },
    { label: 'Optimizing for variety and balance', duration: 2000 },
    { label: 'Finalizing your meal plan', duration: 1000 }
  ];

  return (
    <UnifiedAILoadingDialog
      isOpen={isGenerating}
      onClose={onClose}
      title="Generating Your Meal Plan"
      subtitle="Creating personalized meals just for you..."
      steps={steps}
      position={position}
    />
  );
};
