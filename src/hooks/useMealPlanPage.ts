
import { useState } from 'react';
import { useMealPlanData } from "./useMealPlanData";
import { useI18n } from "@/hooks/useI18n";
import { addDays, startOfWeek } from 'date-fns';

export const useMealPlanPage = () => {
  const { t } = useI18n();
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate week start date based on offset
  const weekStartDate = startOfWeek(addDays(new Date(), currentWeekOffset * 7), { weekStartsOn: 1 });

  // Use the meal plan data hook
  const {
    data: currentWeekPlan,
    isLoading,
    error,
    refetch
  } = useMealPlanData(currentWeekOffset);

  // Get today's meals for the selected day
  const dailyMeals = currentWeekPlan?.dailyMeals?.filter(meal => meal.day_number === selectedDayNumber) || [];

  // Calculate totals for the selected day
  const totalCalories = dailyMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const totalProtein = dailyMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
  const targetDayCalories = 2000; // Default target, could come from user profile

  // Enhanced current date formatting
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Handle recipe generation callback to refresh UI
  const handleRecipeGenerated = () => {
    console.log('🔄 Recipe generated, refreshing meal plan data...');
    refetch();
  };

  const handleRegeneratePlan = async () => {
    setIsGenerating(true);
    try {
      // Regenerate plan logic would go here
      await refetch();
    } catch (error) {
      console.error('Error regenerating plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShowRecipe = (meal: any) => {
    console.log('Show recipe for meal:', meal);
  };

  const handleExchangeMeal = (meal: any, index?: number) => {
    console.log('Exchange meal:', meal, 'at index:', index);
  };

  // Mock shopping items
  const shoppingItems = dailyMeals.flatMap(meal => 
    meal.ingredients?.map((ingredient: any) => ({
      name: typeof ingredient === 'string' ? ingredient : ingredient.name,
      quantity: typeof ingredient === 'string' ? '1' : ingredient.quantity,
      checked: false
    })) || []
  );

  // Enhanced debugging output for week-specific data
  console.log('🚀 MEAL PLAN PAGE - ENHANCED DEBUG:', {
    currentWeekOffset,
    weekStartDate: weekStartDate.toDateString(),
    hasWeeklyPlan: !!currentWeekPlan?.weeklyPlan,
    weeklyPlanId: currentWeekPlan?.weeklyPlan?.id,
    weeklyPlanDate: currentWeekPlan?.weeklyPlan?.week_start_date,
    dailyMealsCount: currentWeekPlan?.dailyMeals?.length || 0,
    todaysMealsCount: dailyMeals?.length || 0,
    selectedDay: selectedDayNumber,
    totalCalories,
    totalProtein,
    targetDayCalories,
    isLoading,
    error: error?.message
  });

  return {
    // Navigation
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    weekStartDate,
    
    // Data
    currentWeekPlan,
    dailyMeals,
    isLoading,
    error,
    
    // Calculations
    totalCalories,
    totalProtein,
    targetDayCalories,
    
    // Actions
    handleRegeneratePlan,
    refetch,
    isGenerating,
    
    // Handlers
    handleShowRecipe,
    handleExchangeMeal,
    handleRecipeGenerated,
    
    // Current date info
    currentDate,
    currentDay,
    
    // Shopping
    shoppingItems,
    
    // Dialog states
    showAIDialog: false,
    setShowAIDialog: () => {},
    selectedMeal: null,
    setSelectedMeal: () => {},
    showRecipeDialog: false,
    setShowRecipeDialog: () => {},
    showExchangeDialog: false,
    setShowExchangeDialog: () => {},
    showAddSnackDialog: false,
    setShowAddSnackDialog: () => {},
    showShoppingListDialog: false,
    setShowShoppingListDialog: () => {},
    
    // Mock data for compatibility
    aiPreferences: {},
    setAiPreferences: () => {},
    selectedMealIndex: 0,
    todaysMeals: dailyMeals
  };
};
