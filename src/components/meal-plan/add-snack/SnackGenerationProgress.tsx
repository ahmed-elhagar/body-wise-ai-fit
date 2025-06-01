
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SnackGenerationProgressProps {
  generationStep: string;
}

export const SnackGenerationProgress = ({ generationStep }: SnackGenerationProgressProps) => {
  const { t, isRTL } = useLanguage();

  const getStepText = (step: string) => {
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

  const getStepProgress = (step: string) => {
    switch (step) {
      case 'analyzing':
        return 33;
      case 'creating':
        return 66;
      case 'saving':
        return 90;
      default:
        return 10;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200">
      <CardContent className="p-6">
        <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-fitness-primary-500 to-fitness-accent-500 rounded-full flex items-center justify-center mb-4">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-white" />
              <Loader2 className="w-4 h-4 text-fitness-accent-200 absolute -top-1 -right-1 animate-spin" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-fitness-primary-800 mb-2">
            {t('mealPlan.addSnackDialog.generatingAISnack') || 'Generating AI Snack...'}
          </h3>
          
          <p className="text-fitness-primary-600 mb-6">
            {t('mealPlan.addSnackDialog.pleaseWait') || 'Please wait while we create the perfect snack for you...'}
          </p>
          
          <div className="space-y-3">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-sm font-medium text-fitness-primary-700">
                {getStepText(generationStep)}
              </span>
              <span className="text-xs text-fitness-primary-500">
                {getStepProgress(generationStep)}%
              </span>
            </div>
            
            <Progress 
              value={getStepProgress(generationStep)} 
              className="h-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
