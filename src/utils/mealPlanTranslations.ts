
import { useLanguage } from '@/contexts/LanguageContext';

export const useMealPlanTranslations = () => {
  const { t } = useLanguage();

  return {
    mealTypes: {
      breakfast: t('Breakfast'),
      lunch: t('Lunch'),
      dinner: t('Dinner'),
      snack: t('Snack'),
    },
    actions: {
      generate: t('Generate'),
      regenerate: t('Regenerate'),
      exchange: t('Exchange'),
      recipe: t('Recipe'),
      shopping: t('Shopping List'),
    },
    nutrition: {
      calories: t('Calories'),
      protein: t('Protein'),
      carbs: t('Carbs'),
      fat: t('Fat'),
      fiber: t('Fiber'),
    },
    status: {
      loading: t('Loading'),
      error: t('Error'),
      success: t('Success'),
      generating: t('Generating'),
    }
  };
};

export const getMealTypeTranslation = (mealType: string, t: (key: string) => string): string => {
  const translations: Record<string, string> = {
    breakfast: t('Breakfast'),
    lunch: t('Lunch'),
    dinner: t('Dinner'),
    snack: t('Snack'),
  };
  return translations[mealType] || mealType;
};
