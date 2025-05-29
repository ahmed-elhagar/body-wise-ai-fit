
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDynamicMealPlan } from "@/hooks/useDynamicMealPlan";
import { useAIMealPlan } from "@/hooks/useAIMealPlan";
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
    cuisine: '',
    maxPrepTime: '45',
    mealTypes: 'all',
    includeSnacks: true
  });

  const { generateMealPlan, isGenerating } = useAIMealPlan();
  const { currentWeekPlan, isLoading } = useDynamicMealPlan(currentWeekOffset);

  const weekStartDate = getWeekStartDate(currentWeekOffset);

  // Enhanced conversion from DailyMeal to Meal type
  const convertDailyMealToMeal = (dailyMeal: any): Meal => ({
    type: dailyMeal.meal_type || 'meal',
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
    youtubeId: dailyMeal.youtube_search_term || ''
  });

  // Get today's meals with better filtering
  const todaysDailyMeals = currentWeekPlan?.dailyMeals?.filter(meal => 
    meal.day_number === selectedDayNumber
  ) || [];
  
  const todaysMeals = todaysDailyMeals.map(convertDailyMealToMeal);
  
  // Calculate nutrition totals
  const totalCalories = todaysMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const totalProtein = todaysMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);

  // Convert meals to shopping items
  const convertMealsToShoppingItems = (meals: Meal[]) => {
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
  };

  const handleRegeneratePlan = () => {
    setShowAIDialog(true);
  };

  const handleGenerateAIPlan = () => {
    generateMealPlan(aiPreferences);
    setShowAIDialog(false);
  };

  const handleShowRecipe = (meal: Meal) => {
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  };

  const handleExchangeMeal = (meal: Meal, index: number) => {
    setSelectedMeal(meal);
    setSelectedMealIndex(index);
    setShowExchangeDialog(true);
  };

  const refetch = () => {
    // Force reload to get updated data
    window.location.reload();
  };

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
