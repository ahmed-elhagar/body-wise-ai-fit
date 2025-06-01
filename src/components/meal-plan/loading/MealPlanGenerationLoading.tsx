import LoadingIndicator from "@/components/ui/loading-indicator";
import AILoadingDialog from "@/components/ui/ai-loading-dialog";
import { useI18n } from "@/hooks/useI18n";
import { useLoadingProgress } from "./useLoadingProgress";
import { getGenerationSteps } from "./loadingStepsData";

interface MealPlanGenerationLoadingProps {
  isGenerating: boolean;
  generationType?: 'initial' | 'regenerate' | 'ai';
}

const MealPlanGenerationLoading = ({ 
  isGenerating, 
  generationType = 'initial' 
}: MealPlanGenerationLoadingProps) => {
  const { t, isRTL } = useI18n();
  
  const steps = getGenerationSteps(t);
  const { currentStep, progress } = useLoadingProgress(steps, isGenerating);

  if (!isGenerating) return null;

  const title = generationType === 'regenerate' 
    ? 'Regenerating Your Plan' 
    : 'Generating Your Plan';

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
      description="Please wait while we create your personalized meal plan"
      steps={dialogSteps}
      progress={progress}
      allowClose={false}
    />
  );
};

export default MealPlanGenerationLoading;
