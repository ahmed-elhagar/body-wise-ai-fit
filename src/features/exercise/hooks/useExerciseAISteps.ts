
import { useMemo } from 'react';

export const useExerciseAISteps = (language: 'en' | 'ar') => {
  return useMemo(() => [
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
};
