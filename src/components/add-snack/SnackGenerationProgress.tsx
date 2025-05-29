
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChefHat, Brain, Save } from "lucide-react";

interface SnackGenerationProgressProps {
  step: string;
}

const SnackGenerationProgress = ({ step }: SnackGenerationProgressProps) => {
  const { t } = useLanguage();

  const steps = [
    { key: 'analyzing', icon: Brain, label: t('addSnack.analyzing'), progress: 30 },
    { key: 'creating', icon: ChefHat, label: t('addSnack.creating'), progress: 70 },
    { key: 'saving', icon: Save, label: t('addSnack.saving'), progress: 100 }
  ];

  const currentStep = steps.find(s => s.key === step);
  const currentProgress = currentStep?.progress || 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-green-200 rounded-full flex items-center justify-center animate-pulse">
          {currentStep ? (
            <currentStep.icon className="w-8 h-8 text-green-600" />
          ) : (
            <ChefHat className="w-8 h-8 text-green-600" />
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-green-800">
            {t('addSnack.generating')}
          </h3>
          <p className="text-sm text-green-700">
            {currentStep?.label || t('addSnack.preparing')}
          </p>
        </div>

        <div className="space-y-2">
          <Progress value={currentProgress} className="h-2" />
          <p className="text-xs text-green-600">{currentProgress}%</p>
        </div>
      </div>
    </Card>
  );
};

export default SnackGenerationProgress;
