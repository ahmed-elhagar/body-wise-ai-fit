
import { useLanguage } from "@/contexts/LanguageContext";

export const useMealPlanTranslation = () => {
  const { t } = useLanguage();
  
  const mealPlanT = (key: string): string => {
    const value = t(`mealPlan.${key}`);
    // Handle nested objects like addSnackDialog
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return typeof value === 'string' ? value : key;
  };

  return { mealPlanT };
};

export const useGeneralTranslation = () => {
  const { t } = useLanguage();
  
  const generalT = (key: string): string => {
    const value = t(`general.${key}`);
    return typeof value === 'string' ? value : key;
  };

  return { generalT };
};

export const useAuthTranslation = () => {
  const { t } = useLanguage();
  
  const authT = (key: string): string => {
    const value = t(`auth.${key}`);
    return typeof value === 'string' ? value : key;
  };

  return { authT };
};

export const useProfileTranslation = () => {
  const { t } = useLanguage();
  
  const profileT = (key: string): string => {
    const value = t(`profile.${key}`);
    return typeof value === 'string' ? value : key;
  };

  return { profileT };
};

export const useWorkoutTranslation = () => {
  const { t } = useLanguage();
  
  const workoutT = (key: string): string => {
    const value = t(`workout.${key}`);
    return typeof value === 'string' ? value : key;
  };

  return { workoutT };
};
