
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingSteps } from "./LoadingSteps";
import { LoadingHeader } from "./LoadingHeader";
import { LoadingFooter } from "./LoadingFooter";
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
  
  // Get proper step objects with icons, titles, descriptions, and durations
  const steps = getGenerationSteps(t);
  const { currentStep, progress } = useLoadingProgress(steps, isGenerating);

  if (!isGenerating) return null;

  const title = generationType === 'regenerate' 
    ? t('mealPlan.regeneratingYourPlan') 
    : t('mealPlan.generatingYourPlan');

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur-md border-0 shadow-2xl">
        <LoadingHeader 
          icon={ChefHat}
          title={title}
          description={t('mealPlan.pleaseWait')}
        />
        
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2 bg-gray-200" />
            <div className={`flex justify-between text-xs text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Loading Steps */}
          <LoadingSteps steps={steps} currentStep={currentStep} />
        </div>

        <LoadingFooter message={t('mealPlan.pleaseWait')} />
      </Card>
    </div>
  );
};

export default MealPlanGenerationLoading;
