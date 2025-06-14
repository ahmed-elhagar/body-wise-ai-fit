
import { useMemo } from 'react';

export const useExerciseAISteps = (language: string) => {
  return useMemo(() => {
    if (language === 'ar') {
      return [
        { id: 'analysis', message: 'تحليل ملفك الشخصي...', description: 'جاري تحليل أهدافك ومستوى لياقتك' },
        { id: 'program', message: 'إنشاء برنامج التمارين...', description: 'تصميم برنامج تمارين مخصص لك' },
        { id: 'exercises', message: 'اختيار التمارين...', description: 'اختيار أفضل التمارين لأهدافك' },
        { id: 'schedule', message: 'تنظيم الجدول...', description: 'ترتيب التمارين في جدول أسبوعي' },
        { id: 'finalize', message: 'اللمسات الأخيرة...', description: 'إضافة التفاصيل النهائية' }
      ];
    }
    
    return [
      { id: 'analysis', message: 'Analyzing your profile...', description: 'Reviewing your fitness goals and current level' },
      { id: 'program', message: 'Creating exercise program...', description: 'Designing a personalized workout routine' },
      { id: 'exercises', message: 'Selecting exercises...', description: 'Choosing the best exercises for your goals' },
      { id: 'schedule', message: 'Organizing schedule...', description: 'Arranging exercises in a weekly schedule' },
      { id: 'finalize', message: 'Finalizing program...', description: 'Adding finishing touches to your program' }
    ];
  }, [language]);
};
