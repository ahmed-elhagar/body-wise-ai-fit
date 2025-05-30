
import { useLanguage } from '@/contexts/LanguageContext';

// Exercise name translations mapping (string to string)
const exerciseNameTranslations: Record<string, string> = {
  // Arabic to English exercise names
  'السحب للأسفل بالكابل': 'Cable Lat Pulldown',
  'التجديف بالبار المحني': 'Bent Over Barbell Row',
  'الضغط بالدمبل': 'Dumbbell Press',
  'تمرين العقلة': 'Pull-ups',
  'القرفصاء': 'Squats',
  'الضغط على البنش': 'Bench Press',
  'الرفعة الميتة': 'Deadlift',
  'تمرين البلانك': 'Plank',
  'الجري في المكان': 'Running in Place',
  'القفز بالحبل': 'Jump Rope',
  
  // English to Arabic (reverse mapping)
  'Cable Lat Pulldown': 'السحب للأسفل بالكابل',
  'Bent Over Barbell Row': 'التجديف بالبار المحني',
  'Dumbbell Press': 'الضغط بالدمبل',
  'Pull-ups': 'تمرين العقلة',
  'Squats': 'القرفصاء',
  'Bench Press': 'الضغط على البنش',
  'Deadlift': 'الرفعة الميتة',
  'Plank': 'تمرين البلانك',
  'Running in Place': 'الجري في المكان',
  'Jump Rope': 'القفز بالحبل'
};

// Exercise instructions translations
const instructionTranslations: Record<string, string> = {
  // Arabic to English instructions
  'جلس مستقيماً، امسك البار بقبضة واسعة، اسحب البار للصدر مع تحريك الكتفين للخلف': 'Sit upright, grip the bar with a wide grip, pull the bar to your chest while moving your shoulders back',
  'مع انحناء الجذع للأمام، امسك البار واسحبه نحو البطن مع الحفاظ على استقامة الظهر': 'With your torso bent forward, grip the bar and pull it toward your abdomen while keeping your back straight',
  
  // English to Arabic (reverse mapping)
  'Sit upright, grip the bar with a wide grip, pull the bar to your chest while moving your shoulders back': 'جلس مستقيماً، امسك البار بقبضة واسعة، اسحب البار للصدر مع تحريك الكتفين للخلف',
  'With your torso bent forward, grip the bar and pull it toward your abdomen while keeping your back straight': 'مع انحناء الجذع للأمام، امسك البار واسحبه نحو البطن مع الحفاظ على استقامة الظهر'
};

export const translateExerciseContent = (exercise: any, targetLanguage: 'en' | 'ar') => {
  if (!exercise) return exercise;

  const translatedExercise = { ...exercise };

  // Translate exercise name
  if (exercise.name) {
    const translatedName = exerciseNameTranslations[exercise.name];
    if (translatedName) {
      translatedExercise.name = translatedName;
    } else {
      // If no direct translation found, check if it's already in the target language
      const isArabic = /[\u0600-\u06FF]/.test(exercise.name);
      const needsTranslation = (targetLanguage === 'en' && isArabic) || (targetLanguage === 'ar' && !isArabic);
      
      if (needsTranslation) {
        // Find reverse translation
        const reverseTranslation = Object.entries(exerciseNameTranslations).find(
          ([key, value]) => value === exercise.name || key === exercise.name
        );
        if (reverseTranslation) {
          translatedExercise.name = targetLanguage === 'en' ? reverseTranslation[1] : reverseTranslation[0];
        }
      }
    }
  }

  // Translate instructions
  if (exercise.instructions) {
    const translatedInstructions = instructionTranslations[exercise.instructions];
    if (translatedInstructions) {
      translatedExercise.instructions = translatedInstructions;
    } else {
      // Check if instructions need translation based on language detection
      const isArabic = /[\u0600-\u06FF]/.test(exercise.instructions);
      const needsTranslation = (targetLanguage === 'en' && isArabic) || (targetLanguage === 'ar' && !isArabic);
      
      if (needsTranslation) {
        // Find reverse translation
        const reverseTranslation = Object.entries(instructionTranslations).find(
          ([key, value]) => value === exercise.instructions || key === exercise.instructions
        );
        if (reverseTranslation) {
          translatedExercise.instructions = targetLanguage === 'en' ? reverseTranslation[1] : reverseTranslation[0];
        }
      }
    }
  }

  // Translate YouTube search term to match the translated name
  if (translatedExercise.name !== exercise.name) {
    translatedExercise.youtube_search_term = translatedExercise.name;
  }

  return translatedExercise;
};

// Hook to get translated exercise content
export const useTranslatedExercise = (exercise: any) => {
  const { language } = useLanguage();
  return translateExerciseContent(exercise, language);
};

// Utility to detect if text is Arabic
export const isArabicText = (text: string): boolean => {
  return /[\u0600-\u06FF]/.test(text);
};

// Utility to get exercise name in specific language
export const getExerciseNameInLanguage = (exerciseName: string, targetLanguage: 'en' | 'ar'): string => {
  const translation = exerciseNameTranslations[exerciseName];
  if (translation) return translation;
  
  // If no direct translation, return original name
  return exerciseName;
};
