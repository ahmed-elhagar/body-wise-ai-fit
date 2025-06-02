
import { useLanguage } from '@/contexts/LanguageContext';
import { useMemo } from 'react';

export const useMealPlanTranslations = () => {
  const { t, language, isRTL } = useLanguage();

  // Memoize translation function to prevent re-renders
  const mealPlanT = useMemo(() => (key: string, fallback?: string) => {
    try {
      const fullKey = key.startsWith('mealPlan.') ? key : `mealPlan.${key}`;
      const translation = t(fullKey);
      
      if (typeof translation === 'string' && translation !== fullKey && translation.trim().length > 0) {
        return translation;
      }
      
      if (fallback) return fallback;
      
      const readableKey = key.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || key;
      return readableKey.charAt(0).toUpperCase() + readableKey.slice(1);
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      return fallback || key;
    }
  }, [t]);

  // Memoize meal type translations
  const getMealTypeTranslation = useMemo(() => (mealType: string) => {
    const translations = {
      breakfast: mealPlanT('breakfast', 'Breakfast'),
      lunch: mealPlanT('lunch', 'Lunch'),
      dinner: mealPlanT('dinner', 'Dinner'),
      snack: mealPlanT('snack', 'Snack'),
      snack1: mealPlanT('snack', 'Snack'),
      snack2: mealPlanT('snack', 'Snack')
    };
    return translations[mealType as keyof typeof translations] || mealType;
  }, [mealPlanT]);

  // Memoize day name translations
  const getDayName = useMemo(() => (dayNumber: number) => {
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
  }, [mealPlanT]);

  // Memoize meal types object
  const mealTypes = useMemo(() => ({
    breakfast: mealPlanT('breakfast', 'Breakfast'),
    lunch: mealPlanT('lunch', 'Lunch'), 
    dinner: mealPlanT('dinner', 'Dinner'),
    snack: mealPlanT('snack', 'Snack'),
    snack1: mealPlanT('snack', 'Snack'),
    snack2: mealPlanT('snack', 'Snack')
  }), [mealPlanT]);

  // Memoize all translations to prevent object recreation
  const translations = useMemo(() => ({
    title: mealPlanT('title', 'Meal Plan'),
    smartMealPlanning: mealPlanT('smartMealPlanning', 'Smart Meal Planning'),
    personalizedNutrition: mealPlanT('personalizedNutrition', 'Personalized nutrition plans powered by AI'),
    generateAIMealPlan: mealPlanT('generateAIMealPlan', 'Generate AI Meal Plan'),
    generateAI: mealPlanT('generateAI', 'Generate AI'),
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
    cancel: mealPlanT('cancel', 'Cancel'),
    noMealPlan: mealPlanT('noMealPlan', 'No Meal Plan Found'),
    generateFirstPlan: mealPlanT('generateFirstPlan', 'Generate your personalized weekly meal plan with AI'),
    aiPowered: mealPlanT('aiPowered', 'AI Powered'),
    currentWeek: mealPlanT('currentWeek', 'Current Week'),
    selectDay: mealPlanT('selectDay', 'Select Day'),
    today: mealPlanT('today', 'Today'),
    dailyView: mealPlanT('dailyView', 'Daily View'),
    weeklyView: mealPlanT('weeklyView', 'Weekly View'),
    breakfast: mealPlanT('breakfast', 'Breakfast'),
    lunch: mealPlanT('lunch', 'Lunch'),
    dinner: mealPlanT('dinner', 'Dinner'),
    snack: mealPlanT('snack', 'Snack'),
    loading: mealPlanT('loading', 'Loading...'),
    loadingDescription: mealPlanT('loadingDescription', 'Please wait while we fetch your personalized meal plan...'),
    errorLoadingMealPlan: mealPlanT('errorLoadingMealPlan', 'Error Loading Meal Plan'),
    somethingWentWrong: mealPlanT('somethingWentWrong', 'Something went wrong'),
    tryAgain: mealPlanT('tryAgain', 'Try Again'),
    goToDashboard: mealPlanT('goToDashboard', 'Go to Dashboard'),
    authenticationRequired: mealPlanT('authenticationRequired', 'Authentication Required'),
    pleaseSignIn: mealPlanT('pleaseSignIn', 'Please sign in to continue'),
    signIn: mealPlanT('signIn', 'Sign In'),
    exchange: mealPlanT('exchange', 'Exchange')
  }), [mealPlanT]);

  return {
    t: mealPlanT,
    language,
    isRTL,
    getMealTypeTranslation,
    getDayName,
    translations,
    
    // Direct access to commonly used properties for backward compatibility
    mealTypes,
    cal: mealPlanT('cal', 'cal'),
    recipe: mealPlanT('recipe', 'Recipe'),
    exchange: mealPlanT('exchange', 'Exchange'),
    
    // Individual properties for backward compatibility
    ...translations
  };
};
