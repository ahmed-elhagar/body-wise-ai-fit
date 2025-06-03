
// Meal type validation utilities for database consistency
export const VALID_MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

export type ValidMealType = typeof VALID_MEAL_TYPES[number];

export const isValidMealType = (mealType: string): mealType is ValidMealType => {
  return VALID_MEAL_TYPES.includes(mealType as ValidMealType);
};

export const validateMealType = (mealType: string): ValidMealType => {
  if (isValidMealType(mealType)) {
    return mealType;
  }
  
  // Map common variations to valid types
  const mealTypeMap: Record<string, ValidMealType> = {
    'snack1': 'snack',
    'snack2': 'snack',
    'morning_snack': 'snack',
    'afternoon_snack': 'snack',
    'evening_snack': 'snack',
    'mid_morning': 'snack',
    'mid_afternoon': 'snack'
  };
  
  const normalizedType = mealType.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  
  if (mealTypeMap[normalizedType]) {
    console.log(`🔄 Mapped meal type: ${mealType} -> ${mealTypeMap[normalizedType]}`);
    return mealTypeMap[normalizedType];
  }
  
  // Default fallback
  console.warn(`⚠️ Unknown meal type: ${mealType}, defaulting to snack`);
  return 'snack';
};

export const validateMealData = (meal: any): any => {
  if (!meal || typeof meal !== 'object') {
    throw new Error('Invalid meal data provided');
  }
  
  return {
    ...meal,
    meal_type: validateMealType(meal.meal_type || meal.type || 'snack'),
    name: meal.name || 'Unknown Meal',
    calories: Math.max(0, parseInt(meal.calories) || 0),
    protein: Math.max(0, parseFloat(meal.protein) || 0),
    carbs: Math.max(0, parseFloat(meal.carbs) || 0),
    fat: Math.max(0, parseFloat(meal.fat) || 0),
    prep_time: Math.max(0, parseInt(meal.prep_time) || 5),
    cook_time: Math.max(0, parseInt(meal.cook_time) || 10),
    servings: Math.max(1, parseInt(meal.servings) || 1),
    ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
    instructions: Array.isArray(meal.instructions) ? meal.instructions : [],
    alternatives: Array.isArray(meal.alternatives) ? meal.alternatives : []
  };
};
