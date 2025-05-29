
import { useState, useMemo, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDynamicMealPlan } from "@/hooks/useDynamicMealPlan";
import { useMealPlanActions } from "@/hooks/useMealPlanActions";
import { getCurrentSaturdayDay, getWeekStartDate, getCategoryForIngredient } from "@/utils/mealPlanUtils";
import type { Meal } from "@/types/meal";

export const useMealPlanState = () => {
  const { t } = useLanguage();
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

  // Log any errors for debugging
  if (error) {
    console.error('useDynamicMealPlan error:', error);
  }

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

  // Memoized today's meals with better filtering
  const todaysMeals = useMemo(() => {
    const todaysDailyMeals = currentWeekPlan?.dailyMeals?.filter(meal => 
      meal.day_number === selectedDayNumber
    ) || [];
    
    return todaysDailyMeals.map(convertDailyMealToMeal);
  }, [currentWeekPlan?.dailyMeals, selectedDayNumber, convertDailyMealToMeal]);
  
  // Memoized nutrition calculations
  const { totalCalories, totalProtein } = useMemo(() => ({
    totalCalories: todaysMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0),
    totalProtein: todaysMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0)
  }), [todaysMeals]);

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
