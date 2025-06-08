
import React, { useMemo } from "react";
import { useI18n } from "@/hooks/useI18n";
import { UnifiedAILoadingDialog } from "@/components/ai/UnifiedAILoadingDialog";
import { useAILoadingSteps } from "@/hooks/useAILoadingSteps";
import type { AIStep } from "@/components/ai/AILoadingSteps";

interface ExerciseAILoadingDialogProps {
  isGenerating: boolean;
  type?: 'program' | 'exchange';
  onClose?: () => void;
}

const ExerciseAILoadingDialog = ({ 
  isGenerating,
  type = 'program',
  onClose 
}: ExerciseAILoadingDialogProps) => {
  const { t, language } = useI18n();

  const programSteps = useMemo((): AIStep[] => [
    {
      id: 'analyzing-profile',
      label: language === 'ar' ? 'تحليل ملفك الرياضي' : 'Analyzing your fitness profile',
      description: language === 'ar' ? 'قراءة أهدافك ومستوى لياقتك' : 'Reading your goals and fitness level',
      estimatedDuration: 3
    },
    {
      id: 'calculating-intensity',
      label: language === 'ar' ? 'حساب شدة التمارين' : 'Calculating exercise intensity',
      description: language === 'ar' ? 'تحديد الشدة المناسبة لك' : 'Determining appropriate intensity for you',
      estimatedDuration: 4
    },
    {
      id: 'selecting-exercises',
      label: language === 'ar' ? 'اختيار التمارين المناسبة' : 'Selecting suitable exercises',
      description: language === 'ar' ? 'اختيار التمارين المناسبة لأهدافك' : 'Choosing exercises that match your goals',
      estimatedDuration: 6
    },
    {
      id: 'creating-schedule',
      label: language === 'ar' ? 'إنشاء جدول التمارين' : 'Creating exercise schedule',
      description: language === 'ar' ? 'تنظيم التمارين في برنامج أسبوعي' : 'Organizing exercises into a weekly program',
      estimatedDuration: 4
    },
    {
      id: 'optimizing-progression',
      label: language === 'ar' ? 'تحسين التقدم' : 'Optimizing progression',
      description: language === 'ar' ? 'ضمان التحسن التدريجي' : 'Ensuring gradual improvement',
      estimatedDuration: 3
    },
    {
      id: 'finalizing-program',
      label: language === 'ar' ? 'إنهاء البرنامج' : 'Finalizing program',
      description: language === 'ar' ? 'حفظ برنامجك الرياضي' : 'Saving your exercise program',
      estimatedDuration: 2
    }
  ], [language]);

  const exchangeSteps = useMemo((): AIStep[] => [
    {
      id: 'analyzing-current',
      label: language === 'ar' ? 'تحليل التمرين الحالي' : 'Analyzing current exercise',
      description: language === 'ar' ? 'فهم متطلبات التمرين الحالي' : 'Understanding current exercise requirements',
      estimatedDuration: 2
    },
    {
      id: 'finding-alternatives',
      label: language === 'ar' ? 'البحث عن البدائل' : 'Finding alternatives',
      description: language === 'ar' ? 'البحث عن تمارين بديلة مناسبة' : 'Searching for suitable alternative exercises',
      estimatedDuration: 4
    },
    {
      id: 'matching-intensity',
      label: language === 'ar' ? 'مطابقة الشدة' : 'Matching intensity',
      description: language === 'ar' ? 'ضمان نفس مستوى الصعوبة' : 'Ensuring same difficulty level',
      estimatedDuration: 3
    },
    {
      id: 'finalizing-exchange',
      label: language === 'ar' ? 'إنهاء الاستبدال' : 'Finalizing exchange',
      description: language === 'ar' ? 'تحديث برنامجك الرياضي' : 'Updating your exercise program',
      estimatedDuration: 2
    }
  ], [language]);

  const steps = type === 'program' ? programSteps : exchangeSteps;
  const totalTime = type === 'program' ? 22 : 11;

  const { currentStepIndex, isComplete, progress } = useAILoadingSteps(
    steps, 
    isGenerating,
    { stepDuration: type === 'program' ? 3500 : 2500 }
  );

  const getTitle = () => {
    if (type === 'exchange') {
      return language === 'ar' ? 'استبدال التمرين بالذكاء الاصطناعي' : 'AI Exercise Exchange';
    }
    return language === 'ar' ? 'إنشاء برنامج رياضي بالذكاء الاصطناعي' : 'Generating AI Exercise Program';
  };

  const getDescription = () => {
    if (type === 'exchange') {
      return language === 'ar' ? 'البحث عن تمرين بديل مناسب لك' : 'Finding a suitable alternative exercise for you';
    }
    return language === 'ar' ? 'إنشاء برنامج رياضي مخصص لأهدافك ومستوى لياقتك' : 'Creating a personalized exercise program for your goals and fitness level';
  };

  return (
    <UnifiedAILoadingDialog
      isOpen={isGenerating}
      title={getTitle()}
      description={getDescription()}
      steps={steps}
      currentStepIndex={currentStepIndex}
      isComplete={isComplete}
      progress={progress}
      estimatedTotalTime={totalTime}
      allowClose={false}
    />
  );
};

export default ExerciseAILoadingDialog;
