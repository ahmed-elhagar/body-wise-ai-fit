
export const fetchMealPlanData = async (userId: string, weekStartDate: string) => {
  // This is a mock service - in a real app this would connect to your backend
  console.log('Fetching meal plan data for:', { userId, weekStartDate });
  
  // Mock data structure
  return {
    weeklyPlan: {
      id: 'mock-plan-' + Date.now(),
      user_id: userId,
      week_start_date: weekStartDate,
      total_calories: 14000,
      total_protein: 700,
      total_carbs: 1750,
      total_fat: 467,
      preferences: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    dailyMeals: [] // Empty for now - would contain actual meal data
  };
};
