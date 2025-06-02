
export const optimizedDatabaseOperations = {
  sanitizeJsonFields: (meal: any) => {
    return {
      ...meal,
      ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : 
        (typeof meal.ingredients === 'string' ? [meal.ingredients] : []),
      instructions: Array.isArray(meal.instructions) ? meal.instructions : 
        (typeof meal.instructions === 'string' ? [meal.instructions] : []),
      alternatives: Array.isArray(meal.alternatives) ? meal.alternatives : 
        (typeof meal.alternatives === 'string' ? [meal.alternatives] : []),
      // Ensure numeric fields are proper numbers
      calories: Number(meal.calories) || 0,
      protein: Number(meal.protein) || 0,
      carbs: Number(meal.carbs) || 0,
      fat: Number(meal.fat) || 0,
      prep_time: Number(meal.prep_time) || 15,
      cook_time: Number(meal.cook_time) || 15,
      servings: Number(meal.servings) || 1,
      // Ensure meal type is properly set
      type: meal.type || meal.meal_type || 'breakfast'
    };
  },

  validateMealData: (meal: any): boolean => {
    const isValid = !!(
      meal.name &&
      meal.type &&
      typeof meal.calories === 'number' && meal.calories > 0 &&
      typeof meal.protein === 'number' && meal.protein >= 0 &&
      typeof meal.carbs === 'number' && meal.carbs >= 0 &&
      typeof meal.fat === 'number' && meal.fat >= 0 &&
      Array.isArray(meal.ingredients) &&
      Array.isArray(meal.instructions)
    );
    
    if (!isValid) {
      console.warn('❌ Invalid meal data:', meal);
    }
    
    return isValid;
  }
};
