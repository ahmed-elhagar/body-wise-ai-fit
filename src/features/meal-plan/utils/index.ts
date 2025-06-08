
// Utility functions for meal plan feature
export const calculateDailyNutrition = (meals: any[]) => {
  return meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + (meal.calories || 0),
      protein: totals.protein + (meal.protein || 0),
      carbs: totals.carbs + (meal.carbs || 0),
      fats: totals.fats + (meal.fats || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
};

export const formatMealTime = (mealType: string) => {
  const mealTimes = {
    breakfast: '08:00',
    lunch: '12:00', 
    dinner: '18:00',
    snack: '15:00'
  };
  return mealTimes[mealType as keyof typeof mealTimes] || '12:00';
};

export const getMealTypeOrder = () => ['breakfast', 'lunch', 'dinner', 'snack'];
