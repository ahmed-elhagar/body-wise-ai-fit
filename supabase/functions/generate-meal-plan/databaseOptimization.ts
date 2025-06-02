
export const optimizedDatabaseOperations = {
  sanitizeJsonFields: (meal: any) => {
    return {
      ...meal,
      ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
      instructions: Array.isArray(meal.instructions) ? meal.instructions : [],
      alternatives: Array.isArray(meal.alternatives) ? meal.alternatives : []
    };
  },

  validateMealData: (meal: any): boolean => {
    return !!(
      meal.name &&
      meal.calories &&
      meal.protein !== undefined &&
      meal.carbs !== undefined &&
      meal.fat !== undefined
    );
  }
};
