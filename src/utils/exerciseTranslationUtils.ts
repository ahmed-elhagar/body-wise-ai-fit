
import { useI18n, Language } from '@/hooks/useI18n';

export const translateExerciseName = (exerciseName: string, targetLanguage: Language): string => {
  // This would normally use the translation service
  // For now, return the original name
  return exerciseName;
};

export const translateMuscleGroup = (muscleGroup: string, targetLanguage: Language): string => {
  const translations: Record<string, Record<Language, string>> = {
    'chest': {
      'en': 'Chest',
      'ar': 'الصدر'
    },
    'back': {
      'en': 'Back', 
      'ar': 'الظهر'
    },
    'shoulders': {
      'en': 'Shoulders',
      'ar': 'الكتفين'
    },
    'arms': {
      'en': 'Arms',
      'ar': 'الذراعين'
    },
    'legs': {
      'en': 'Legs',
      'ar': 'الساقين'
    },
    'core': {
      'en': 'Core',
      'ar': 'البطن'
    }
  };

  return translations[muscleGroup.toLowerCase()]?.[targetLanguage] || muscleGroup;
};

export const useExerciseTranslations = () => {
  const { language } = useI18n();

  const translateExercise = (exerciseName: string) => {
    return translateExerciseName(exerciseName, language);
  };

  const translateMuscle = (muscleGroup: string) => {
    return translateMuscleGroup(muscleGroup, language);
  };

  return {
    translateExercise,
    translateMuscle
  };
};
