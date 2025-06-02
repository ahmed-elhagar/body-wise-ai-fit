
import { useLanguage } from '@/contexts/LanguageContext';

export const useMealPlanTranslations = () => {
  const { t, language, isRTL } = useLanguage();

  // Helper function to safely get translations with fallbacks
  const mealPlanT = (key: string, fallback?: string) => {
    const fullKey = key.startsWith('mealPlan.') ? key : `mealPlan.${key}`;
    const translation = t(fullKey);
    return typeof translation === 'string' && translation !== fullKey 
      ? translation 
      : fallback || key;
  };

  // Meal type translations
  const getMealTypeTranslation = (mealType: string) => {
    const translations = {
      breakfast: mealPlanT('mealTypes.breakfast', 'Breakfast'),
      lunch: mealPlanT('mealTypes.lunch', 'Lunch'),
      dinner: mealPlanT('mealTypes.dinner', 'Dinner'),
      snack: mealPlanT('mealTypes.snack', 'Snack'),
      snack1: mealPlanT('mealTypes.snack', 'Snack'),
      snack2: mealPlanT('mealTypes.snack', 'Snack')
    };
    return translations[mealType as keyof typeof translations] || mealType;
  };

  // Day name translations
  const getDayName = (dayNumber: number) => {
    const dayNames = {
      1: mealPlanT('dayNames.1', 'Saturday'),
      2: mealPlanT('dayNames.2', 'Sunday'),
      3: mealPlanT('dayNames.3', 'Monday'),
      4: mealPlanT('dayNames.4', 'Tuesday'),
      5: mealPlanT('dayNames.5', 'Wednesday'),
      6: mealPlanT('dayNames.6', 'Thursday'),
      7: mealPlanT('dayNames.7', 'Friday')
    };
    return dayNames[dayNumber as keyof typeof dayNames] || `Day ${dayNumber}`;
  };

  return {
    t: mealPlanT,
    language,
    isRTL,
    getMealTypeTranslation,
    getDayName,
    // Common translations
    translations: {
      title: mealPlanT('title', 'Meal Plan'),
      smartMealPlanning: mealPlanT('smartMealPlanning', 'Smart Meal Planning'),
      personalizedNutrition: mealPlanT('personalizedNutrition', 'Personalized nutrition plans powered by AI'),
      generateAIMealPlan: mealPlanT('generateAIMealPlan', 'Generate AI Meal Plan'),
      generating: mealPlanT('generating', 'Generating...'),
      addSnack: mealPlanT('addSnack', 'Add Snack'),
      aiCredits: mealPlanT('aiCredits', 'AI Credits'),
      recipe: mealPlanT('recipe', 'Recipe'),
      calories: mealPlanT('cal', 'cal'),
      protein: mealPlanT('protein', 'Protein'),
      carbs: mealPlanT('carbs', 'Carbs'),
      fat: mealPlanT('fat', 'Fat'),
      dailyProgress: mealPlanT('dailyProgress', 'Daily Progress'),
      targetReached: mealPlanT('targetReached', 'Daily calorie target reached!'),
      excellentProgress: mealPlanT('excellentProgress', "Excellent progress! You've reached your daily nutrition goals."),
      perfectDay: mealPlanT('perfectDay', 'Perfect Day'),
      considerLightSnack: mealPlanT('considerLightSnack', 'Consider a light snack or some water to complete your day.'),
      consumed: mealPlanT('consumed', 'Consumed'),
      target: mealPlanT('target', 'Target'),
      calAvailable: mealPlanT('calAvailable', 'cal available'),
      close: mealPlanT('close', 'Close'),
      cancel: mealPlanT('cancel', 'Cancel')
    }
  };
};
