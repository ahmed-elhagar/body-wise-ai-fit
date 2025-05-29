
import { useState, useMemo, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/hooks/useProfile";
import { useDynamicMealPlan } from "@/hooks/useDynamicMealPlan";
import { useMealPlanActions } from "@/hooks/useMealPlanActions";
import { getCurrentSaturdayDay, getWeekStartDate, getCategoryForIngredient } from "@/utils/mealPlanUtils";
import type { Meal } from "@/types/meal";

export const useMealPlanState = () => {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(getCurrentSaturdayDay());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number>(-1);
  const [aiPreferences, setAiPreferences] = useState({
    duration: '7',
    cuisine: 'mixed',
    maxPrepTime: '45',
    mealTypes: 'all',
    includeSnacks: true
  });

  const { currentWeekPlan, isLoading, error, refetch: refetchMealPlan } = useDynamicMealPlan(currentWeekOffset);
  const { handleRegeneratePlan, handleGenerateAIPlan, isGenerating, isShuffling } = useMealPlanActions(
    currentWeekPlan,
    currentWeekOffset,
    aiPreferences,
    refetchMealPlan
  );

  const weekStartDate = getWeekStartDate(currentWeekOffset);

  // Enhanced logging for debugging
  console.log('🔍 MEAL PLAN STATE DEBUG:', {
    currentWeekOffset,
    selectedDayNumber,
    hasWeeklyPlan: !!currentWeekPlan?.weeklyPlan,
    hasDailyMeals: !!currentWeekPlan?.dailyMeals,
    dailyMealsCount: currentWeekPlan?.dailyMeals?.length || 0,
    isLoading,
    error: error?.message,
    weekStartDate: weekStartDate.toDateString()
  });

  // Memoized conversion from DailyMeal to Meal type
  const convertDailyMealToMeal = useCallback((dailyMeal: any): Meal => ({
    id: dailyMeal.id,
    type: dailyMeal.meal_type || 'meal',
    meal_type: dailyMeal.meal_type,
    time: dailyMeal.meal_type === 'breakfast' ? '08:00' : 
          dailyMeal.meal_type === 'lunch' ? '12:00' :
          dailyMeal.meal_type === 'dinner' ? '18:00' : '15:00',
    name: dailyMeal.name || 'Unnamed Meal',
    calories: Math.round(dailyMeal.calories || 0),
    protein: Math.round((dailyMeal.protein || 0) * 10) / 10,
    carbs: Math.round((dailyMeal.carbs || 0) * 10) / 10,
    fat: Math.round((dailyMeal.fat || 0) * 10) / 10,
    ingredients: Array.isArray(dailyMeal.ingredients) ? dailyMeal.ingredients : [],
    instructions: Array.isArray(dailyMeal.instructions) ? dailyMeal.instructions : [],
    cookTime: dailyMeal.cook_time || 15,
    prepTime: dailyMeal.prep_time || 10,
    servings: dailyMeal.servings || 1,
    image: dailyMeal.image_url || '',
    image_url: dailyMeal.image_url || '',
    youtubeId: dailyMeal.youtube_search_term || '',
    youtube_search_term: dailyMeal.youtube_search_term
  }), []);

  // Memoized today's meals with better filtering and debugging
  const todaysMeals = useMemo(() => {
    const todaysDailyMeals = currentWeekPlan?.dailyMeals?.filter(meal => 
      meal.day_number === selectedDayNumber
    ) || [];
    
    console.log('🍽️ TODAY\'S MEALS DEBUG:', {
      selectedDayNumber,
      totalDailyMeals: currentWeekPlan?.dailyMeals?.length || 0,
      filteredMealsCount: todaysDailyMeals.length,
      meals: todaysDailyMeals.map(m => ({ day: m.day_number, type: m.meal_type, name: m.name, calories: m.calories }))
    });
    
    return todaysDailyMeals.map(convertDailyMealToMeal);
  }, [currentWeekPlan?.dailyMeals, selectedDayNumber, convertDailyMealToMeal]);
  
  // Enhanced nutrition calculations with proper data validation
  const { totalCalories, totalProtein } = useMemo(() => {
    const calories = todaysMeals.reduce((sum, meal) => {
      const mealCalories = Number(meal.calories) || 0;
      return sum + mealCalories;
    }, 0);
    
    const protein = todaysMeals.reduce((sum, meal) => {
      const mealProtein = Number(meal.protein) || 0;
      return sum + mealProtein;
    }, 0);

    console.log('📊 NUTRITION CALCULATIONS:', {
      selectedDay: selectedDayNumber,
      mealsCount: todaysMeals.length,
      totalCalories: calories,
      totalProtein: protein,
      mealBreakdown: todaysMeals.map(m => ({
        name: m.name,
        calories: m.calories,
        protein: m.protein
      }))
    });
    
    return {
      totalCalories: Math.round(calories),
      totalProtein: Math.round(protein * 10) / 10
    };
  }, [todaysMeals, selectedDayNumber]);

  // Calculate target calories from user profile
  const getTargetDayCalories = useCallback(() => {
    if (profile?.weight && profile?.height && profile?.age) {
      const weight = Number(profile.weight);
      const height = Number(profile.height);
      const age = Number(profile.age);
      
      let bmr = 0;
      if (profile.gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
      
      const activityMultipliers = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'extremely_active': 1.9
      };
      
      const multiplier = activityMultipliers[profile.activity_level as keyof typeof activityMultipliers] || 1.375;
      
      let calorieAdjustment = 1;
      if (profile.fitness_goal === 'lose_weight') {
        calorieAdjustment = 0.85;
      } else if (profile.fitness_goal === 'gain_weight') {
        calorieAdjustment = 1.15;
      }
      
      return Math.round(bmr * multiplier * calorieAdjustment);
    }
    
    return 2000; // Default fallback
  }, [profile]);

  const targetDayCalories = getTargetDayCalories();

  // Memoized shopping items conversion
  const convertMealsToShoppingItems = useCallback((meals: Meal[]) => {
    const items: any[] = [];
    meals.forEach(meal => {
      meal.ingredients.forEach((ingredient: any) => {
        items.push({
          name: ingredient.name || ingredient,
          quantity: ingredient.quantity || '1',
          unit: ingredient.unit || 'piece',
          category: getCategoryForIngredient(ingredient.name || ingredient)
        });
      });
    });
    return items;
  }, []);

  const handleShowRecipe = useCallback((meal: Meal) => {
    console.log('🍳 Opening recipe for meal:', { id: meal.id, name: meal.name });
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  }, []);

  const handleExchangeMeal = useCallback((meal: Meal, index: number) => {
    setSelectedMeal(meal);
    setSelectedMealIndex(index);
    setShowExchangeDialog(true);
  }, []);

  const refetch = useCallback(async () => {
    console.log('🔄 Manual refetch triggered for week offset:', currentWeekOffset);
    try {
      await refetchMealPlan?.();
    } catch (error) {
      console.error('Manual refetch failed:', error);
    }
  }, [currentWeekOffset, refetchMealPlan]);

  const enhancedHandleGenerateAIPlan = useCallback(async () => {
    const success = await handleGenerateAIPlan();
    if (success) {
      setShowAIDialog(false);
    }
  }, [handleGenerateAIPlan]);

  return {
    // State
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    viewMode,
    setViewMode,
    showAIDialog,
    setShowAIDialog,
    showAddSnackDialog,
    setShowAddSnackDialog,
    showShoppingListDialog,
    setShowShoppingListDialog,
    showRecipeDialog,
    setShowRecipeDialog,
    showExchangeDialog,
    setShowExchangeDialog,
    selectedMeal,
    selectedMealIndex,
    aiPreferences,
    setAiPreferences,
    
    // Data
    currentWeekPlan,
    isLoading,
    isGenerating,
    isShuffling,
    weekStartDate,
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    error,
    
    // Handlers
    handleRegeneratePlan,
    handleGenerateAIPlan: enhancedHandleGenerateAIPlan,
    handleShowRecipe,
    handleExchangeMeal,
    refetch,
    convertMealsToShoppingItems
  };
};
