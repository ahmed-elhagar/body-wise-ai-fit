
import { useLanguage, Language } from "@/contexts/LanguageContext";

export const useExerciseTranslation = () => {
  const { t, language } = useLanguage();
  
  const exerciseT = (key: string): string => {
    const value = t(`exercise.${key}`);
    return typeof value === 'string' ? value : key;
  };

  const muscleGroupT = (muscleGroup: string): string => {
    const value = t(`exercise.muscleGroups.${muscleGroup}`);
    return typeof value === 'string' ? value : muscleGroup;
  };

  const difficultyT = (difficulty: string): string => {
    const value = t(`exercise.difficulty.${difficulty}`);
    return typeof value === 'string' ? value : difficulty;
  };

  return { 
    exerciseT, 
    muscleGroupT, 
    difficultyT,
    language: language as Language
  };
};

export const translateExerciseContent = (exercise: any, language: string) => {
  // For now, return the exercise as-is since we don't have translation data
  // This can be enhanced later with actual translation logic
  return exercise;
};
