
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface SnackGenerationProgressProps {
  generationStep: string;
}

export const SnackGenerationProgress = ({ generationStep }: SnackGenerationProgressProps) => {
  const { t } = useI18n();

  const getStepLabel = (step: string) => {
    switch (step) {
      case 'analyzing':
        return t('mealPlan.addSnackDialog.analyzing') || 'Analyzing your nutrition needs...';
      case 'creating':
        return t('mealPlan.addSnackDialog.creating') || 'Creating perfect snack...';
      case 'saving':
        return t('mealPlan.addSnackDialog.saving') || 'Saving to your meal plan...';
      default:
        return t('mealPlan.addSnackDialog.generatingAISnack') || 'Generating AI Snack...';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-fitness-accent-200">
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-fitness-accent-500 to-fitness-accent-600 rounded-full flex items-center justify-center animate-pulse mb-4">
          <Sparkles className="w-8 h-8 text-white animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-fitness-accent-800 mb-2">
          {getStepLabel(generationStep)}
        </h3>
        <div className="w-full bg-fitness-accent-100 rounded-full h-2 mb-4">
          <div className="bg-gradient-to-r from-fitness-accent-500 to-fitness-accent-600 h-2 rounded-full transition-all duration-500 w-1/3"></div>
        </div>
        <p className="text-fitness-accent-600 text-sm">
          {t('mealPlan.addSnackDialog.pleaseWait') || 'Please wait while we create the perfect snack for you...'}
        </p>
      </CardContent>
    </Card>
  );
};
