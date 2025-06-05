
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

  // Create weekDays from weekStartDate if it exists
  const weekDays = [];
  if (mealPlanState.weekStartDate) {
    const startDate = new Date(mealPlanState.weekStartDate);
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      weekDays.push({
        number: i + 1,
        date: currentDate,
        name: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: currentDate.toDateString() === new Date().toDateString(),
      });
    }
  }

  // Enhanced debugging output for week-specific data
  console.log('🚀 MEAL PLAN PAGE - UNIFIED DEBUG:', {
    currentWeekOffset: mealPlanState.currentWeekOffset,
    weekStartDate: mealPlanState.weekStartDate?.toDateString(),
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
    handleRecipeGenerated,
    // Ensure we have all required props with defaults
    viewMode: 'daily' as 'daily' | 'weekly',
    setViewMode: () => {}, // Mock function for now
    weekDays,
    isShuffling: false // Add missing isShuffling property
  };
};
