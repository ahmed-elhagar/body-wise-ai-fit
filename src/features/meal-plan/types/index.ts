
// Re-export from meal plan types for backward compatibility
export interface MealIngredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface DailyMeal {
  id: string;
  weekly_plan_id: string;
  day_number: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'snack1' | 'snack2';
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  ingredients?: MealIngredient[];
  instructions?: string[];
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  alternatives?: string[];
  image_url?: string;
  youtube_search_term?: string;
  recipe_fetched?: boolean;
  created_at?: string;
}

export interface WeeklyMealPlan {
  id: string;
  user_id: string;
  week_start_date: string;
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  generation_prompt?: any;
  life_phase_context?: any;
  preferences?: MealPlanPreferences;
  created_at?: string;
  updated_at?: string;
}

export interface MealPlanFetchResult {
  weeklyPlan: WeeklyMealPlan;
  dailyMeals: DailyMeal[];
}

export interface MealPlanPreferences {
  duration?: number;
  cuisine?: string;
  maxPrepTime?: string;
  includeSnacks?: boolean;
  mealTypes?: string[];
}

export interface AddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  currentDayCalories: number;
  targetDayCalories: number;
  weeklyPlanId?: string;
  onSnackAdded: () => void;
}
