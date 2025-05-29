
import React from "react";
import { Card } from "@/components/ui/card";
import { ChefHat, Utensils } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingHeader } from "./loading/LoadingHeader";
import { LoadingProgressBar } from "./loading/LoadingProgressBar";
import { LoadingSteps } from "./loading/LoadingSteps";
import { LoadingFooter } from "./loading/LoadingFooter";
import { SimpleLoadingSpinner } from "./loading/SimpleLoadingSpinner";
import { getGenerationSteps, getShuffleSteps } from "./loading/loadingStepsData";
import { useLoadingProgress } from "./loading/useLoadingProgress";

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
  
  const generationSteps = getGenerationSteps(t);
  const shuffleSteps = getShuffleSteps(t);
  const steps = isShuffling ? shuffleSteps : generationSteps;
  
  const { currentStep, progress } = useLoadingProgress(steps, isGenerating || isShuffling);

  if (isGenerating || isShuffling) {
    const mainTitle = isShuffling ? t('mealPlan.shufflingMeals') : t('mealPlan.generatingMealPlan');
    const mainDescription = isShuffling ? t('mealPlan.shufflingMealsDesc') : t('mealPlan.generatingMealPlanDesc');
    const mainIcon = isShuffling ? Utensils : ChefHat;
    const footerMessage = isShuffling ? t('mealPlan.pleaseWaitShuffle') : t('mealPlan.pleaseWaitGenerate');

    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-2xl text-center max-w-lg w-full mx-4">
          <LoadingHeader
            icon={mainIcon}
            title={mainTitle}
            description={mainDescription}
          />
          
          <LoadingProgressBar progress={progress} />
          
          <LoadingSteps steps={steps} currentStep={currentStep} />
          
          <LoadingFooter message={footerMessage} />
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <SimpleLoadingSpinner message={t('mealPlan.loadingMealPlan')} />;
  }

  return null;
};

export default MealPlanLoadingStates;
