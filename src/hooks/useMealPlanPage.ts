
import { useMealPlanState } from "./useMealPlanState";

export const useMealPlanPage = () => {
  const mealPlanState = useMealPlanState();

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
    mealPlanState.refetch();
  };

  // Enhanced debugging output for week-specific data
  console.log('🚀 MEAL PLAN PAGE - UNIFIED DEBUG:', {
    currentWeekOffset: mealPlanState.currentWeekOffset,
    weekStartDate: mealPlanState.weekStartDate.toDateString(),
    hasWeeklyPlan: !!mealPlanState.currentWeekPlan?.weeklyPlan,
    weeklyPlanId: mealPlanState.currentWeekPlan?.weeklyPlan?.id,
    weeklyPlanDate: mealPlanState.currentWeekPlan?.weeklyPlan?.week_start_date,
    dailyMealsCount: mealPlanState.currentWeekPlan?.dailyMeals?.length || 0,
    todaysMealsCount: mealPlanState.todaysMeals?.length || 0,
    selectedDay: mealPlanState.selectedDayNumber,
    totalCalories: mealPlanState.totalCalories,
    totalProtein: mealPlanState.totalProtein,
    targetDayCalories: mealPlanState.targetDayCalories,
    isLoading: mealPlanState.isLoading,
    isGenerating: mealPlanState.isGenerating,
    error: mealPlanState.error?.message
  });

  return {
    ...mealPlanState,
    currentDate,
    currentDay,
    handleRecipeGenerated
  };
};
