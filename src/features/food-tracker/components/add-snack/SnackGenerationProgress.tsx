
import React, { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { UnifiedAILoadingDialog } from "@/features/chat/components";
import { useAILoadingSteps } from "@/features/ai/hooks/useAILoadingSteps";
import type { AIStep } from "@/features/ai/hooks/useAILoadingSteps";

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
      title: t('mealPlan.addSnack.analyzing') || 'Analyzing remaining calories',
      description: 'Calculating optimal snack size for your daily goals',
      status: 'pending' as const,
      estimatedDuration: 2
    },
    {
      id: 'generating-snack',
      title: t('mealPlan.addSnack.generating') || 'Generating AI Snack',
      description: 'Creating the perfect snack for your remaining calories',
      status: 'pending' as const,
      estimatedDuration: 5
    },
    {
      id: 'optimizing-nutrition',
      title: t('mealPlan.addSnack.optimizing') || 'Optimizing nutrition',
      description: 'Ensuring nutritional balance with your existing meals',
      status: 'pending' as const,
      estimatedDuration: 3
    },
    {
      id: 'finalizing-snack',
      title: t('mealPlan.addSnack.finalizing') || 'Finalizing snack',
      description: 'Adding snack to your meal plan',
      status: 'pending' as const,
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
