
import { useLanguage } from '@/contexts/LanguageContext';

export const useMealPlanTranslations = () => {
  const { t, language } = useLanguage();
  
  // Check if we're in RTL mode
  const isRTL = language === 'ar';
  
  return {
    // Core functionality
    title: t('mealPlan.title'),
    generateAIMealPlan: t('mealPlan.generateAIMealPlan'),
    generateMealPlan: t('mealPlan.generateMealPlan'),
    generateNewPlan: t('mealPlan.generateNewPlan'),
    regenerate: t('mealPlan.regenerate'),
    shuffleMeals: t('mealPlan.shuffleMeals'),
    viewRecipe: t('mealPlan.viewRecipe'),
    exchangeMeal: t('mealPlan.exchangeMeal'),
    addSnack: t('mealPlan.addSnack'),
    
    // Navigation & Time
    currentWeek: t('mealPlan.currentWeek'),
    futureWeek: t('mealPlan.futureWeek'),
    dailyOverview: t('mealPlan.dailyOverview'),
    weeklyView: t('mealPlan.weeklyView'),
    dailyView: t('mealPlan.dailyView'),
    selectDay: t('mealPlan.selectDay'),
    today: t('mealPlan.today'),
    
    // Nutrition & Stats
    totalCalories: t('mealPlan.totalCalories'),
    totalProtein: t('mealPlan.totalProtein'),
    weeklyCalories: t('mealPlan.weeklyCalories'),
    weeklyProtein: t('mealPlan.weeklyProtein'),
    cal: t('mealPlan.cal'),
    calories: t('mealPlan.calories'),
    protein: t('mealPlan.protein'),
    carbs: t('mealPlan.carbs'),
    fat: t('mealPlan.fat'),
    calPerDay: t('mealPlan.calPerDay'),
    
    // UI Elements
    items: t('mealPlan.items'),
    item: t('mealPlan.item'),
    meals: t('mealPlan.meals'),
    servings: t('mealPlan.servings'),
    minutes: t('mealPlan.minutes'),
    of: t('mealPlan.of'),
    target: t('mealPlan.target'),
    recipe: t('mealPlan.recipe'),
    exchange: t('mealPlan.exchange'),
    shoppingList: t('mealPlan.shoppingList'),
    
    // States & Messages
    noMealPlan: t('mealPlan.noMealPlan'),
    generateFirstPlan: t('mealPlan.generateFirstPlan'),
    noMealsPlanned: t('mealPlan.noMealsPlanned'),
    personalizedPlan: t('mealPlan.personalizedPlan'),
    aiPowered: t('mealPlan.aiPowered'),
    aiPoweredNutrition: t('mealPlan.aiPoweredNutrition'),
    loading: t('mealPlan.loading'),
    generating: t('mealPlan.generating'),
    smartMealPlanning: t('mealPlan.smartMealPlanning'),
    personalizedNutrition: t('mealPlan.personalizedNutrition'),
    
    // Success/Error Messages
    snackAddedSuccess: t('mealPlan.snackAddedSuccess'),
    shoppingListUpdated: t('mealPlan.shoppingListUpdated'),
    planGeneratedSuccess: t('mealPlan.planGeneratedSuccess'),
    planGenerationFailed: t('mealPlan.planGenerationFailed'),
    
    // Stats
    dailyProgress: t('mealPlan.dailyProgress'),
    calorieProgress: t('mealPlan.calorieProgress'),
    consumed: t('mealPlan.consumed'),
    mealsToday: t('mealPlan.mealsToday'),
    complete: t('mealPlan.complete'),
    
    // Meal Types - Fixed the missing property
    mealTypes: {
      breakfast: t('mealPlan.breakfast'),
      lunch: t('mealPlan.lunch'),
      dinner: t('mealPlan.dinner'),
      snack: t('mealPlan.snack'),
      snack1: t('mealPlan.snack1'),
      snack2: t('mealPlan.snack2')
    },
    
    // Credits
    aiCredits: t('mealPlan.aiCredits'),
    
    // Add Snack specific translations
    analyzing: t('mealPlan.addSnackDialog.analyzing'),
    creating: t('mealPlan.addSnackDialog.creating'),
    saving: t('mealPlan.addSnackDialog.saving'),
    calAvailable: t('mealPlan.addSnackDialog.caloriesAvailable'),
    notEnoughCalories: t('mealPlan.addSnackDialog.notEnoughCalories'),
    failed: t('mealPlan.addSnackDialog.failed'),
    targetReached: t('mealPlan.addSnackDialog.targetReached'),
    excellentProgress: t('mealPlan.addSnackDialog.targetReachedDesc'),
    generateAISnack: t('mealPlan.addSnackDialog.generateAISnack'),
    
    // System properties
    language,
    isRTL
  };
};
