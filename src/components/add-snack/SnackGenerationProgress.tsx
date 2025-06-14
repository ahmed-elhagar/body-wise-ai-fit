
import React, { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { UnifiedAILoadingDialog } from "@/components/ai/UnifiedAILoadingDialog";
import { useAILoadingSteps } from "@/hooks/useAILoadingSteps";
import type { AIStep } from "@/components/ai/AILoadingSteps";

interface SnackGenerationProgressProps {
  step: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const SnackGenerationProgress = ({ 
  step, 
  isOpen = true,
  onClose 
}: SnackGenerationProgressProps) => {
  const { t, isRTL } = useLanguage();

  const steps = useMemo((): AIStep[] => [
    {
      id: 'analyzing-calories',
      label: t('mealPlan.addSnack.analyzing') || 'Analyzing remaining calories',
      description: 'Calculating optimal snack size for your daily goals',
      estimatedDuration: 2
    },
    {
      id: 'generating-snack',
      label: t('mealPlan.addSnack.generating') || 'Generating AI Snack',
      description: 'Creating the perfect snack for your remaining calories',
      estimatedDuration: 5
    },
    {
      id: 'optimizing-nutrition',
      label: t('mealPlan.addSnack.optimizing') || 'Optimizing nutrition',
      description: 'Ensuring nutritional balance with your existing meals',
      estimatedDuration: 3
    },
    {
      id: 'finalizing-snack',
      label: t('mealPlan.addSnack.finalizing') || 'Finalizing snack',
      description: 'Adding snack to your meal plan',
      estimatedDuration: 2
    }
  ], [t]);

  const { currentStepIndex, isComplete, progress } = useAILoadingSteps(
    steps, 
    isOpen,
    { stepDuration: 2500 }
  );

  return (
    <UnifiedAILoadingDialog
      isOpen={isOpen}
      title={t('mealPlan.addSnack.generatingTitle') || 'Generating Smart Snack'}
      description={t('mealPlan.addSnack.generatingDescription') || 'Creating an AI-powered snack recommendation based on your remaining calories and nutritional needs'}
      steps={steps}
      currentStepIndex={currentStepIndex}
      isComplete={isComplete}
      progress={progress}
      estimatedTotalTime={12}
      allowClose={false}
    />
  );
};

export default SnackGenerationProgress;
