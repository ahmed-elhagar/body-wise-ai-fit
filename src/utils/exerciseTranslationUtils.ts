
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
  'تمرين الضغط': 'Push-ups',
  'تمرين الطحن': 'Crunches',
  'تمرين الجسر': 'Bridge',
  'تمرين المتسلق': 'Mountain Climbers',
  'تمرين القفز': 'Jumping Jacks',
  'تمرين البيربي': 'Burpees',
  'تمرين اللونجز': 'Lunges',
  
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
  'Jump Rope': 'القفز بالحبل',
  'Push-ups': 'تمرين الضغط',
  'Crunches': 'تمرين الطحن',
  'Bridge': 'تمرين الجسر',
  'Mountain Climbers': 'تمرين المتسلق',
  'Jumping Jacks': 'تمرين القفز',
  'Burpees': 'تمرين البيربي',
  'Lunges': 'تمرين اللونجز'
};

// Exercise instructions translations
const instructionTranslations: Record<string, string> = {
  // Arabic to English instructions
  'جلس مستقيماً، امسك البار بقبضة واسعة، اسحب البار للصدر مع تحريك الكتفين للخلف': 'Sit upright, grip the bar with a wide grip, pull the bar to your chest while moving your shoulders back',
  'مع انحناء الجذع للأمام، امسك البار واسحبه نحو البطن مع الحفاظ على استقامة الظهر': 'With your torso bent forward, grip the bar and pull it toward your abdomen while keeping your back straight',
  'استلق على الأرض ارفع جسمك بشكل مستقيم واستمر لفترة': 'Lie face down, raise your body in a straight line and hold the position',
  'قف مستقيماً ثم انزل كأنك تجلس على كرسي': 'Stand straight then lower as if sitting on a chair',
  
  // English to Arabic (reverse mapping)
  'Sit upright, grip the bar with a wide grip, pull the bar to your chest while moving your shoulders back': 'جلس مستقيماً، امسك البار بقبضة واسعة، اسحب البار للصدر مع تحريك الكتفين للخلف',
  'With your torso bent forward, grip the bar and pull it toward your abdomen while keeping your back straight': 'مع انحناء الجذع للأمام، امسك البار واسحبه نحو البطن مع الحفاظ على استقامة الظهر',
  'Lie face down, raise your body in a straight line and hold the position': 'استلق على الأرض ارفع جسمك بشكل مستقيم واستمر لفترة',
  'Stand straight then lower as if sitting on a chair': 'قف مستقيماً ثم انزل كأنك تجلس على كرسي'
};

export const translateExerciseContent = (exercise: any, targetLanguage: 'en' | 'ar') => {
  if (!exercise) return exercise;

  const translatedExercise = { ...exercise };

  // Translate exercise name
  if (exercise.name) {
    // Check for direct translation first
    const directTranslation = exerciseNameTranslations[exercise.name];
    if (directTranslation) {
      translatedExercise.name = directTranslation;
    } else {
      // If no direct translation, check if we need to translate based on language detection
      const isArabic = /[\u0600-\u06FF]/.test(exercise.name);
      const needsTranslation = (targetLanguage === 'en' && isArabic) || (targetLanguage === 'ar' && !isArabic);
      
      if (needsTranslation) {
        // Try to find a translation by checking all entries
        const foundTranslation = Object.entries(exerciseNameTranslations).find(([key, value]) => {
          return key.toLowerCase().includes(exercise.name.toLowerCase()) || 
                 value.toLowerCase().includes(exercise.name.toLowerCase()) ||
                 exercise.name.toLowerCase().includes(key.toLowerCase()) ||
                 exercise.name.toLowerCase().includes(value.toLowerCase());
        });
        
        if (foundTranslation) {
          translatedExercise.name = targetLanguage === 'en' ? foundTranslation[1] : foundTranslation[0];
        }
      }
    }
  }

  // Translate instructions
  if (exercise.instructions) {
    const directInstructionTranslation = instructionTranslations[exercise.instructions];
    if (directInstructionTranslation) {
      translatedExercise.instructions = directInstructionTranslation;
    } else {
      // Check if instructions need translation based on language detection
      const isArabic = /[\u0600-\u06FF]/.test(exercise.instructions);
      const needsTranslation = (targetLanguage === 'en' && isArabic) || (targetLanguage === 'ar' && !isArabic);
      
      if (needsTranslation) {
        // Find partial matches for instructions
        const foundInstructionTranslation = Object.entries(instructionTranslations).find(([key, value]) => {
          return key.includes(exercise.instructions) || value.includes(exercise.instructions) ||
                 exercise.instructions.includes(key) || exercise.instructions.includes(value);
        });
        
        if (foundInstructionTranslation) {
          translatedExercise.instructions = targetLanguage === 'en' ? foundInstructionTranslation[1] : foundInstructionTranslation[0];
        }
      }
    }
  }

  // Translate YouTube search term to match the translated name
  if (translatedExercise.name !== exercise.name) {
    translatedExercise.youtube_search_term = translatedExercise.name;
  }

  console.log('🔤 Exercise Translation:', {
    original: exercise.name,
    translated: translatedExercise.name,
    targetLanguage,
    wasTranslated: exercise.name !== translatedExercise.name
  });

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
