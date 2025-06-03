
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
  const { t, language } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = useMemo(() => [
    { 
      id: 'analyzing', 
      label: language === 'ar' ? 'تحليل ملفك الشخصي وتفضيلاتك' : 'Analyzing your profile and preferences' 
    },
    { 
      id: 'calculating', 
      label: language === 'ar' ? 'حساب المتطلبات الغذائية' : 'Calculating nutritional requirements' 
    },
    { 
      id: 'generating', 
      label: language === 'ar' ? 'إنشاء وجبات مخصصة لك' : 'Generating personalized meals' 
    },
    { 
      id: 'optimizing', 
      label: language === 'ar' ? 'تحسين تركيبات الوجبات' : 'Optimizing meal combinations' 
    },
    { 
      id: 'validating', 
      label: language === 'ar' ? 'التحقق من هيكل خطة الوجبات' : 'Validating meal plan structure' 
    },
    { 
      id: 'saving', 
      label: language === 'ar' ? 'حفظ خطة وجباتك' : 'Saving your meal plan' 
    },
    { 
      id: 'finalizing', 
      label: language === 'ar' ? 'إنهاء خطة وجباتك' : 'Finalizing your meal plan' 
    }
  ], [language]);

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
    }, 2000); // Slower progression for better UX (2 seconds per step)

    return () => clearInterval(interval);
  }, [isGenerating, steps.length]);

  if (!isGenerating) return null;

  return (
    <AILoadingDialog
      open={true}
      status="loading"
      title={language === 'ar' ? 'إنشاء خطة الوجبات بالذكاء الاصطناعي' : 'Generating AI Meal Plan'}
      message={steps[currentStepIndex]?.label || (language === 'ar' ? 'إنشاء خطة وجباتك...' : 'Generating your meal plan...')}
      description={language === 'ar' ? 'يرجى الانتظار بينما ننشئ خطة وجباتك الشخصية' : 'Please wait while we create your personalized meal plan'}
      steps={dialogSteps}
      progress={progress}
      allowClose={false}
    />
  );
};

export default MealPlanAILoadingDialog;
