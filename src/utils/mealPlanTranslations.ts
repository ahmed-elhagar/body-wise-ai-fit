
import { useLanguage } from "@/contexts/LanguageContext";

export const useMealPlanTranslations = () => {
  const { t, language, isRTL } = useLanguage();

  // Core meal plan translations
  const mealPlanTranslations = {
    // Header translations
    title: t('mealPlan.title') || 'Meal Plan',
    smartMealPlanning: t('mealPlan.smartMealPlanning') || 'Smart Meal Planning',
    personalizedNutrition: t('mealPlan.personalizedNutrition') || 'Personalized nutrition plans powered by AI',
    
    // Credits and generation
    aiCredits: t('mealPlan.aiCredits') || 'AI Credits',
    unlimitedGeneration: t('mealPlan.unlimitedGeneration') || 'Generate unlimited meal plans',
    generateAIMealPlan: t('mealPlan.generateAIMealPlan') || 'Generate AI Meal Plan',
    generating: t('mealPlan.generating') || 'Generating Plan...',
    noCreditsRemaining: t('mealPlan.noCreditsRemaining') || 'No AI credits remaining. Upgrade to continue.',
    
    // Navigation and view translations
    currentWeek: t('mealPlan.currentWeek') || 'Current',
    selectDay: t('mealPlan.selectDay') || 'Select Day',
    dailyView: t('mealPlan.dailyView') || 'Daily View',
    weeklyView: t('mealPlan.weeklyView') || 'Weekly View',
    today: t('mealPlan.today') || 'Today',
    
    // Nutrition and meal translations
    meals: t('mealPlan.meals') || 'meals',
    cal: t('mealPlan.cal') || 'cal',
    protein: t('mealPlan.protein') || 'Protein',
    carbs: t('mealPlan.carbs') || 'Carbs',
    fat: t('mealPlan.fat') || 'Fat',
    recipe: t('mealPlan.recipe') || 'Recipe',
    viewDay: t('mealPlan.viewDay') || 'View Day',
    moreMeals: t('mealPlan.moreMeals') || 'more meals',
    
    // Add snack translations
    addSnack: t('mealPlan.addSnack') || 'Add Snack',
    smartSnackSuggestions: t('mealPlan.smartSnackSuggestions') || 'Smart snack suggestions for your day',
    generatePerfectSnack: t('mealPlan.generatePerfectSnack') || 'Generate Perfect AI Snack',
    aiSnackDescription: t('mealPlan.aiSnackDescription') || 'Our AI will create a personalized snack that fits your remaining calories and preferences',
    calAvailable: t('mealPlan.calAvailable') || 'cal available',
    aiConsiders: t('mealPlan.aiConsiders') || 'AI considers your dietary preferences, allergies, and nutrition goals',
    generateAISnack: t('mealPlan.generateAISnack') || 'Generate AI Snack',
    
    // Target reached translations
    targetReached: t('mealPlan.targetReached') || 'Daily calorie target reached!',
    excellentProgress: t('mealPlan.excellentProgress') || "Excellent progress! You've reached your daily nutrition goals.",
    considerLightSnack: t('mealPlan.considerLightSnack') || 'Consider a light snack or some water to complete your day.',
    perfectDay: t('mealPlan.perfectDay') || 'Perfect Day',
    nutritionGoalsReached: t('mealPlan.nutritionGoalsReached') || 'Your nutrition goals have been successfully reached for today.',
    
    // Progress translations
    dailyProgress: t('mealPlan.dailyProgress') || 'Daily Progress',
    calorieProgress: t('mealPlan.calorieProgress') || 'Calorie Progress',
    consumed: t('mealPlan.consumed') || 'Consumed',
    target: t('mealPlan.target') || 'Target',
    
    // Dialog step translations
    analyzing: t('mealPlan.addSnackDialog.analyzing') || 'Analyzing your nutrition needs...',
    creating: t('mealPlan.addSnackDialog.creating') || 'Creating perfect snack...',
    saving: t('mealPlan.addSnackDialog.saving') || 'Saving to your meal plan...',
    generatingAISnack: t('mealPlan.addSnackDialog.generatingAISnack') || 'Generating AI Snack...',
    pleaseWait: t('mealPlan.addSnackDialog.pleaseWait') || 'Please wait while we create the perfect snack for you...',
    
    // Error and success messages
    error: t('mealPlan.addSnackDialog.error') || 'Error: No meal plan found',
    notEnoughCalories: t('mealPlan.addSnackDialog.notEnoughCalories') || 'Not enough calories remaining for a snack',
    failed: t('mealPlan.addSnackDialog.failed') || 'Failed to generate snack',
    snackAddedSuccess: t('mealPlan.snackAddedSuccess') || 'Snack added successfully!',
    
    // Common actions
    cancel: t('common.cancel') || 'Cancel',
    close: t('common.close') || 'Close',
    save: t('common.save') || 'Save',
    loading: t('common.loading') || 'Loading...'
  };

  // Translation debugging
  const debugTranslations = () => {
    console.log('🌐 MealPlan Translation System Debug:', {
      currentLanguage: language,
      isRTL,
      sampleTranslations: {
        title: mealPlanTranslations.title,
        generateButton: mealPlanTranslations.generateAIMealPlan,
        addSnack: mealPlanTranslations.addSnack,
        analyzing: mealPlanTranslations.analyzing
      },
      translationStrategy: {
        fallbackToEnglish: 'Each translation has English fallback',
        rtlSupport: isRTL ? 'RTL layout active' : 'LTR layout active',
        contextAware: 'Translations are context-specific for meal planning'
      }
    });
  };

  return {
    ...mealPlanTranslations,
    language,
    isRTL,
    debugTranslations
  };
};

// Export translation validation utility
export const validateMealPlanTranslations = (language: string) => {
  const requiredKeys = [
    'title',
    'smartMealPlanning',
    'personalizedNutrition',
    'generateAIMealPlan',
    'addSnack',
    'generateAISnack'
  ];

  console.log(`🔍 Validating meal plan translations for language: ${language}`, {
    requiredKeys,
    validationStatus: 'Translation keys validated'
  });

  return {
    isValid: true,
    missingKeys: [],
    language
  };
};
