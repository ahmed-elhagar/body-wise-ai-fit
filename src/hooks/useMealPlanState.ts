
import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDynamicMealPlan } from "@/hooks/useDynamicMealPlan";
import { useAIMealPlan } from "@/hooks/useAIMealPlan";
import { useMealShuffle } from "@/hooks/useMealShuffle";
import { getCurrentSaturdayDay, getWeekStartDate, getCategoryForIngredient } from "@/utils/mealPlanUtils";
import type { Meal } from "@/types/meal";

export const useMealPlanState = () => {
  const { t, language } = useLanguage();
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

  const { generateMealPlan, isGenerating } = useAIMealPlan();
  const { shuffleMeals, isShuffling } = useMealShuffle();
  const { currentWeekPlan, isLoading, refetch: refetchMealPlan } = useDynamicMealPlan(currentWeekOffset);

  const weekStartDate = getWeekStartDate(currentWeekOffset);

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

  // Optimized shuffle handler
  const handleRegeneratePlan = useCallback(async () => {
    if (!currentWeekPlan?.weeklyPlan?.id) {
      toast.error(t('mealPlan.noMealPlanToShuffle') || 'No meal plan found to shuffle');
      return;
    }
    
    await shuffleMeals(currentWeekPlan.weeklyPlan.id);
  }, [currentWeekPlan?.weeklyPlan?.id, shuffleMeals, t]);

  // Optimized AI generation handler
  const handleGenerateAIPlan = useCallback(async () => {
    try {
      console.log('🚀 Starting AI meal plan generation with preferences:', aiPreferences);
      
      const enhancedPreferences = {
        ...aiPreferences,
        language: language,
        locale: language === 'ar' ? 'ar-SA' : 'en-US'
      };
      
      const result = await generateMealPlan(enhancedPreferences, { weekOffset: currentWeekOffset });
      
      if (result?.success) {
        setShowAIDialog(false);
        
        // Force immediate refetch
        setTimeout(async () => {
          await refetchMealPlan?.();
        }, 500);
        
        toast.success(t('mealPlan.generatedSuccessfully') || "✨ Meal plan generated successfully!");
      }
      
    } catch (error) {
      console.error('❌ Generation failed:', error);
      toast.error(t('mealPlan.generationFailed') || "Failed to generate meal plan. Please try again.");
    }
  }, [aiPreferences, language, currentWeekOffset, generateMealPlan, refetchMealPlan, t]);

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
    await refetchMealPlan?.();
  }, [currentWeekOffset, refetchMealPlan]);

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
    
    // Handlers
    handleRegeneratePlan,
    handleGenerateAIPlan,
    handleShowRecipe,
    handleExchangeMeal,
    refetch,
    convertMealsToShoppingItems
  };
};
