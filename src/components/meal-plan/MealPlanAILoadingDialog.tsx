
import React, { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { UnifiedAILoadingDialog } from "@/components/ai/UnifiedAILoadingDialog";
import { useAILoadingSteps } from "@/hooks/useAILoadingSteps";
import type { AIStep } from "@/components/ai/AILoadingSteps";

interface MealPlanAILoadingDialogProps {
  isGenerating: boolean;
  onClose?: () => void;
}

const MealPlanAILoadingDialog = ({ 
  isGenerating, 
  onClose 
}: MealPlanAILoadingDialogProps) => {
  const { t, language } = useLanguage();

  const steps = useMemo((): AIStep[] => [
    { 
      id: 'analyzing', 
      label: language === 'ar' ? 'تحليل ملفك الشخصي وتفضيلاتك' : 'Analyzing your profile and preferences',
      description: language === 'ar' ? 'قراءة بياناتك الشخصية وتحديد متطلباتك' : 'Reading your personal data and identifying requirements',
      estimatedDuration: 3
    },
    { 
      id: 'calculating', 
      label: language === 'ar' ? 'حساب المتطلبات الغذائية' : 'Calculating nutritional requirements',
      description: language === 'ar' ? 'تحديد السعرات والعناصر الغذائية المطلوبة' : 'Determining required calories and nutrients',
      estimatedDuration: 4
    },
    { 
      id: 'generating', 
      label: language === 'ar' ? 'إنشاء وجبات مخصصة لك' : 'Generating personalized meals',
      description: language === 'ar' ? 'اختيار الوجبات المناسبة لأهدافك' : 'Selecting meals that fit your goals',
      estimatedDuration: 8
    },
    { 
      id: 'optimizing', 
      label: language === 'ar' ? 'تحسين تركيبات الوجبات' : 'Optimizing meal combinations',
      description: language === 'ar' ? 'ضمان التوازن الغذائي والتنوع' : 'Ensuring nutritional balance and variety',
      estimatedDuration: 5
    },
    { 
      id: 'validating', 
      label: language === 'ar' ? 'التحقق من هيكل خطة الوجبات' : 'Validating meal plan structure',
      description: language === 'ar' ? 'فحص جودة وصحة خطة الوجبات' : 'Checking meal plan quality and health',
      estimatedDuration: 3
    },
    { 
      id: 'saving', 
      label: language === 'ar' ? 'حفظ خطة وجباتك' : 'Saving your meal plan',
      description: language === 'ar' ? 'تخزين البيانات في قاعدة البيانات' : 'Storing data in the database',
      estimatedDuration: 2
    },
    { 
      id: 'finalizing', 
      label: language === 'ar' ? 'إنهاء خطة وجباتك' : 'Finalizing your meal plan',
      description: language === 'ar' ? 'التحضير للعرض النهائي' : 'Preparing for final display',
      estimatedDuration: 2
    }
  ], [language]);

  const { currentStepIndex, isComplete, progress } = useAILoadingSteps(
    steps, 
    isGenerating,
    { stepDuration: 3000 }
  );

  if (!isGenerating) return null;

  return (
    <UnifiedAILoadingDialog
      isOpen={true}
      title={language === 'ar' ? 'إنشاء خطة الوجبات بالذكاء الاصطناعي' : 'Generating AI Meal Plan'}
      description={language === 'ar' ? 'يرجى الانتظار بينما ننشئ خطة وجباتك الشخصية باستخدام الذكاء الاصطناعي' : 'Please wait while we create your personalized meal plan using AI'}
      steps={steps}
      currentStepIndex={currentStepIndex}
      isComplete={isComplete}
      progress={progress}
      estimatedTotalTime={27}
      allowClose={false}
    />
  );
};

export default MealPlanAILoadingDialog;
