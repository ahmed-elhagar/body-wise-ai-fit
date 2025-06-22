
import React, { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { UnifiedAILoadingDialog } from "@/features/chat/components";
import { useAILoadingSteps } from "@/features/ai/hooks/useAILoadingSteps";

// Import the exact AIStep interface from the chat components
import type { AIStep } from "@/features/chat/components/AILoadingSteps";

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
      label: 'Analyzing calories',
      description: 'Calculating optimal snack size for your daily goals',
      estimatedDuration: 2
    },
    {
      id: 'generating-snack',
      label: 'Generating snack',
      description: 'Creating the perfect snack for your remaining calories',
      estimatedDuration: 5
    },
    {
      id: 'optimizing-nutrition',
      label: 'Optimizing nutrition',
      description: 'Ensuring nutritional balance with your existing meals',
      estimatedDuration: 3
    },
    {
      id: 'finalizing-snack',
      label: 'Finalizing snack',
      description: 'Adding snack to your meal plan',
      estimatedDuration: 2
    }
  ], []);

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
