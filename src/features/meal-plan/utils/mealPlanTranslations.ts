
import { useLanguage } from '@/contexts/LanguageContext';

export const useMealPlanTranslations = () => {
  const { t } = useLanguage();

  return {
    title: t('Smart Meal Plan'),
    smartMealPlanning: t('Smart Meal Planning'),
    personalizedNutrition: t('AI-powered personalized nutrition'),
    generateAIMealPlan: t('Generate AI Meal Plan'),
    generating: t('Generating...'),
    addSnack: t('Add Snack'),
    mealTypes: {
      breakfast: t('Breakfast'),
      lunch: t('Lunch'),
      dinner: t('Dinner'),
      snack: t('Snack'),
      snack1: t('Snack 1'),
      snack2: t('Snack 2')
    },
    cal: t('cal'),
    recipe: t('Recipe'),
    exchange: t('Exchange'),
    isRTL: false // Add RTL detection logic here if needed
  };
};
