
import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslationHelper = () => {
  const { t } = useLanguage();
  
  const translateMealType = (mealType: string) => {
    return t(`mealTypes.${mealType}`);
  };

  const translateExerciseType = (exerciseType: string) => {
    return t(`exerciseTypes.${exerciseType}`);
  };

  const translateBodyPart = (bodyPart: string) => {
    return t(`bodyParts.${bodyPart}`);
  };

  const translateEquipment = (equipment: string) => {
    return t(`equipment.${equipment}`);
  };

  const translateDifficulty = (difficulty: string) => {
    return t(`difficulty.${difficulty}`);
  };

  return {
    translateMealType,
    translateExerciseType,
    translateBodyPart,
    translateEquipment,
    translateDifficulty
  };
};
