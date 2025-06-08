import React, { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import AILoadingDialog from "@/components/ui/ai-loading-dialog";
import SimpleLoadingIndicator from "@/components/ui/simple-loading-indicator";
import { useLoadingProgress } from "./loading/useLoadingProgress";
import { getGenerationSteps, getShuffleSteps } from "./loading/loadingStepsData";

interface MealPlanLoadingStatesProps {
  isGenerating: boolean;
  isLoading: boolean;
  isShuffling?: boolean;
}

export const MealPlanLoadingStates = ({ 
  isGenerating, 
  isLoading,
  isShuffling = false
}: MealPlanLoadingStatesProps) => {
  const { t, isRTL } = useLanguage();
  
  // Memoize steps to prevent constant recreation
  const steps = useMemo(() => {
    return isShuffling ? getShuffleSteps(t) : getGenerationSteps(t);
  }, [isShuffling, t]);
  
  const { currentStep, progress } = useLoadingProgress(steps, isGenerating || isShuffling);

  if (isGenerating || isShuffling) {
    const mainTitle = isShuffling ? 'Shuffling Meals' : 'Generating Meal Plan';
    const mainDescription = isShuffling ? 'Creating new meal combinations...' : 'Creating your personalized meal plan...';

    // Convert steps to AI dialog format
    const dialogSteps = steps.map((step, index) => ({
      id: step.id,
      label: step.text,
      status: index < currentStep ? 'completed' as const : 
              index === currentStep ? 'active' as const : 'pending' as const
    }));

    return (
      <AILoadingDialog
        open={true}
        status="loading"
        title={mainTitle}
        message={steps[currentStep]?.text || mainTitle}
        description={mainDescription}
        steps={dialogSteps}
        progress={progress}
        allowClose={false}
      />
    );
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`}>
        <SimpleLoadingIndicator
          message="Loading Meal Plan"
          description="Please wait while we fetch your meal plan..."
          size="lg"
        />
      </div>
    );
  }

  return null;
};

export default MealPlanLoadingStates;
