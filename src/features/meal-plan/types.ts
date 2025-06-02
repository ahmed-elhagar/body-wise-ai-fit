
export interface MealIngredient {
  name: string;
  quantity?: string;
  unit?: string;
}

export interface DailyMeal {
  id: string;
  weekly_plan_id: string;
  day_number: number;
  meal_type: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prep_time: number;
  cook_time: number;
  servings: number;
  youtube_search_term?: string;
  image_url?: string;
  recipe_fetched: boolean;
  ingredients: MealIngredient[];
  instructions: string[];
  alternatives: string[];
}

export interface WeeklyMealPlan {
  id: string;
  user_id: string;
  week_start_date: string;
  total_calories: number;
  total_protein: number;
  preferences: any;
  created_at: string;
  updated_at: string;
}

export interface MealPlanFetchResult {
  weeklyPlan: WeeklyMealPlan;
  dailyMeals: DailyMeal[];
}

export interface MealPlanPreferences {
  duration: string;
  cuisine: string;
  maxPrepTime: string;
  includeSnacks: boolean;
  mealTypes: string;
}
