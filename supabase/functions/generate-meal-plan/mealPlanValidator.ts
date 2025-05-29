
interface AIGeneratedMeal {
  type: string;
  name?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  ingredients?: any[];
  instructions?: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
}

interface AIGeneratedDay {
  dayNumber?: number;
  dayName?: string;
  totalCalories?: number;
  meals: AIGeneratedMeal[];
}

interface AIGeneratedPlan {
  days: AIGeneratedDay[];
  weekSummary?: {
    totalCalories?: number;
    avgDailyCalories?: number;
    totalProtein?: number;
    totalCarbs?: number;
    totalFat?: number;
    dietType?: string;
  };
}

export const validateMealPlan = (generatedPlan: AIGeneratedPlan): void => {
  console.log('🔍 Validating AI-generated meal plan...');

  // Check basic structure
  if (!generatedPlan || typeof generatedPlan !== 'object') {
    throw new Error('Invalid meal plan: must be an object');
  }

  if (!generatedPlan.days || !Array.isArray(generatedPlan.days)) {
    throw new Error('Invalid meal plan: days must be an array');
  }

  // Check number of days
  if (generatedPlan.days.length !== 7) {
    throw new Error(`Invalid meal plan: must have exactly 7 days, got ${generatedPlan.days.length}`);
  }

  let totalMeals = 0;
  const requiredMealTypes = ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'];

  // Validate each day
  for (let i = 0; i < generatedPlan.days.length; i++) {
    const day = generatedPlan.days[i];
    const dayNum = i + 1;

    // Ensure day has proper structure
    if (!day || typeof day !== 'object') {
      throw new Error(`Day ${dayNum}: invalid day structure`);
    }

    if (!day.meals || !Array.isArray(day.meals)) {
      throw new Error(`Day ${dayNum}: meals must be an array`);
    }

    // Check number of meals per day
    if (day.meals.length !== 5) {
      throw new Error(`Day ${dayNum}: must have exactly 5 meals, got ${day.meals.length}`);
    }

    // Set day number if missing
    if (!day.dayNumber) {
      day.dayNumber = dayNum;
    }

    // Check meal types
    const mealTypes = day.meals.map(meal => meal.type);
    for (const requiredType of requiredMealTypes) {
      if (!mealTypes.includes(requiredType)) {
        throw new Error(`Day ${dayNum}: missing required meal type "${requiredType}"`);
      }
    }

    // Validate each meal
    for (const meal of day.meals) {
      if (!meal.name || typeof meal.name !== 'string') {
        throw new Error(`Day ${dayNum}: meal must have a valid name`);
      }

      if (typeof meal.calories !== 'number' || meal.calories < 0) {
        throw new Error(`Day ${dayNum}, meal "${meal.name}": calories must be a positive number`);
      }

      if (!meal.ingredients || !Array.isArray(meal.ingredients)) {
        console.warn(`Day ${dayNum}, meal "${meal.name}": no ingredients provided, setting empty array`);
        meal.ingredients = [];
      }

      if (!meal.instructions || !Array.isArray(meal.instructions)) {
        console.warn(`Day ${dayNum}, meal "${meal.name}": no instructions provided, setting default`);
        meal.instructions = [`Prepare ${meal.name} according to traditional recipe`];
      }

      // Set default values for missing numeric fields
      meal.protein = typeof meal.protein === 'number' ? meal.protein : 0;
      meal.carbs = typeof meal.carbs === 'number' ? meal.carbs : 0;
      meal.fat = typeof meal.fat === 'number' ? meal.fat : 0;
      meal.prepTime = typeof meal.prepTime === 'number' ? meal.prepTime : 10;
      meal.cookTime = typeof meal.cookTime === 'number' ? meal.cookTime : 15;
      meal.servings = typeof meal.servings === 'number' ? meal.servings : 1;
    }

    totalMeals += day.meals.length;
  }

  // Final validation
  if (totalMeals !== 35) {
    throw new Error(`Invalid meal plan: must have exactly 35 meals total, got ${totalMeals}`);
  }

  // Ensure week summary exists
  if (!generatedPlan.weekSummary) {
    console.warn('No week summary provided, creating default');
    generatedPlan.weekSummary = {
      totalCalories: 14000,
      avgDailyCalories: 2000,
      totalProtein: 525,
      totalCarbs: 1750,
      totalFat: 544,
      dietType: 'Balanced'
    };
  }

  console.log('✅ Meal plan validation passed - 7 days with 35 total meals confirmed');
};
