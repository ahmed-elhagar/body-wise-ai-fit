
import { useMealPlanTranslations } from '@/hooks/useMealPlanTranslations';

// Re-export for backward compatibility
export const useMealPlanTranslation = () => {
  const { t, language, isRTL, getDayName, getMealTypeTranslation } = useMealPlanTranslations();
  
  return {
    mealPlanT: t,
    language,
    isRTL,
    getDayName,
    getMealTypeTranslation
  };
};

// Main export
export { useMealPlanTranslations };
