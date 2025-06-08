
import { useI18n } from '@/hooks/useI18n';

export const useMealPlanTranslation = () => {
  const { t } = useI18n();
  
  const mealPlanT = (key: string, options?: any) => {
    return t(`mealPlan:${key}`, options) || t(key, options) || key;
  };

  return { mealPlanT };
};

export const useExerciseTranslation = () => {
  const { t } = useI18n();
  
  const exerciseT = (key: string, options?: any) => {
    return t(`exercise:${key}`, options) || t(key, options) || key;
  };

  return { exerciseT };
};
