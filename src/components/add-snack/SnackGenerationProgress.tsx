
import EnhancedLoadingIndicator from "@/components/ui/enhanced-loading-indicator";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface SnackGenerationProgressProps {
  step: string;
}

const SnackGenerationProgress = ({ step }: SnackGenerationProgressProps) => {
  const { t, isRTL } = useLanguage();

  const customSteps = [
    t('mealPlan.addSnack.generationSteps.analyzing') || 'Analyzing your profile...',
    t('mealPlan.addSnack.generationSteps.creating') || 'Creating perfect snack...',
    t('mealPlan.addSnack.generationSteps.saving') || 'Saving to your plan...',
    t('mealPlan.addSnack.generationSteps.preparing') || 'Preparing final result...'
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <EnhancedLoadingIndicator
        status="loading"
        type="recipe"
        message={t('mealPlan.addSnack.generating') || "Generating AI Snack"}
        description="Creating the perfect snack for your remaining calories"
        size="lg"
        variant="default"
        showSteps={true}
        customSteps={customSteps}
      />
    </Card>
  );
};

export default SnackGenerationProgress;
