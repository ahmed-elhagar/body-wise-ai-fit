
import { useLanguage } from "@/contexts/LanguageContext";
import AILoadingDialog from "@/components/ui/ai-loading-dialog";
import { useMemo, useState, useEffect } from "react";

interface MealPlanAILoadingDialogProps {
  isGenerating: boolean;
  onClose?: () => void;
}

const MealPlanAILoadingDialog = ({ 
  isGenerating, 
  onClose 
}: MealPlanAILoadingDialogProps) => {
  const { t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = useMemo(() => [
    { id: 'analyzing', label: t('Analyzing your profile and preferences') },
    { id: 'calculating', label: t('Calculating nutritional requirements') },
    { id: 'generating', label: t('Generating personalized meals') },
    { id: 'optimizing', label: t('Optimizing meal combinations') },
    { id: 'finalizing', label: t('Finalizing your meal plan') }
  ], [t]);

  const dialogSteps = useMemo(() => 
    steps.map((step, index) => ({
      id: step.id,
      label: step.label,
      status: index < currentStepIndex ? 'completed' as const : 
              index === currentStepIndex ? 'active' as const : 'pending' as const
    })), [steps, currentStepIndex]
  );

  const progress = useMemo(() => 
    Math.round((currentStepIndex / (steps.length - 1)) * 100), 
    [currentStepIndex, steps.length]
  );

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isGenerating, steps.length]);

  if (!isGenerating) return null;

  return (
    <AILoadingDialog
      open={true}
      status="loading"
      title={t('Generating AI Meal Plan')}
      message={steps[currentStepIndex]?.label || t('Generating your meal plan...')}
      description={t('Please wait while we create your personalized meal plan')}
      steps={dialogSteps}
      progress={progress}
      allowClose={false}
    />
  );
};

export default MealPlanAILoadingDialog;
