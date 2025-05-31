
import LoadingIndicator from "@/components/ui/loading-indicator";
import AILoadingDialog from "@/components/ui/ai-loading-dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLoadingProgress } from "./useLoadingProgress";
import { getGenerationSteps } from "./loadingStepsData";
import { ChefHat } from "lucide-react";

interface MealPlanGenerationLoadingProps {
  isGenerating: boolean;
  generationType?: 'initial' | 'regenerate' | 'ai';
}

const MealPlanGenerationLoading = ({ 
  isGenerating, 
  generationType = 'initial' 
}: MealPlanGenerationLoadingProps) => {
  const { t, isRTL } = useLanguage();
  
  const steps = getGenerationSteps(t);
  const { currentStep, progress } = useLoadingProgress(steps, isGenerating);

  if (!isGenerating) return null;

  const title = generationType === 'regenerate' 
    ? t('mealPlan.regeneratingYourPlan') 
    : t('mealPlan.generatingYourPlan');

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
      title={title}
      message={steps[currentStep]?.text || title}
      description={t('mealPlan.pleaseWait')}
      steps={dialogSteps}
      progress={progress}
      allowClose={false}
    />
  );
};

export default MealPlanGenerationLoading;
