
import { useI18n } from '@/hooks/useI18n';

export const useMealPlanTranslation = () => {
  const { t } = useI18n();
  
  const mealPlanT = (key: string, options?: any): string => {
    const result = t(`mealPlan:${key}`, options) || t(key, options) || key;
    return typeof result === 'string' ? result : key;
  };

  return { mealPlanT };
};

export const useExerciseTranslation = () => {
  const { t } = useI18n();
  
  const exerciseT = (key: string, options?: any): string => {
    const result = t(`exercise:${key}`, options) || t(key, options) || key;
    return typeof result === 'string' ? result : key;
  };

  return { exerciseT };
};
