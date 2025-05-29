
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Brain, ChefHat, Save } from "lucide-react";
import { useEffect, useState } from "react";

interface SnackGenerationProgressProps {
  step: string;
}

const SnackGenerationProgress = ({ step }: SnackGenerationProgressProps) => {
  const { t, isRTL } = useLanguage();
  const [progress, setProgress] = useState(0);

  const steps = {
    analyzing: { icon: Brain, progress: 25, text: t('mealPlan.addSnack.generationSteps.analyzing') },
    creating: { icon: ChefHat, progress: 50, text: t('mealPlan.addSnack.generationSteps.creating') },
    saving: { icon: Save, progress: 75, text: t('mealPlan.addSnack.generationSteps.saving') },
    preparing: { icon: Sparkles, progress: 100, text: t('mealPlan.addSnack.generationSteps.preparing') }
  };

  const currentStep = steps[step as keyof typeof steps] || steps.analyzing;
  const Icon = currentStep.icon;

  useEffect(() => {
    setProgress(currentStep.progress);
  }, [currentStep.progress]);

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-purple-800 mb-1">{t('mealPlan.addSnack.generating')}</h3>
          <p className="text-sm text-purple-600">{currentStep.text}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Progress value={progress} className="h-3 bg-purple-100" />
        <div className={`flex justify-between text-xs text-purple-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span>{t('mealPlan.addSnack.analyzing')}</span>
          <span>{progress}%</span>
        </div>
      </div>
    </Card>
  );
};

export default SnackGenerationProgress;
