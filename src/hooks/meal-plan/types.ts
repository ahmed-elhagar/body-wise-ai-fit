
export interface MealIngredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface DailyMeal {
  id: string;
  name: string;
  meal_type: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  ingredients?: MealIngredient[];
  instructions?: string[];
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  image_url?: string;
  youtube_search_term?: string;
}

export interface WeeklyMealPlan {
  [day: string]: DailyMeal[];
}

export interface MealPlanFetchResult {
  success: boolean;
  weeklyPlan: WeeklyMealPlan;
  totalCalories: number;
  totalProtein: number;
  error?: string;
}

export interface MealPlanPreferences {
  dietaryRestrictions?: string[];
  allergies?: string[];
  cuisinePreferences?: string[];
  calorieTarget?: number;
  proteinTarget?: number;
}

export interface AddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSnackGenerated: () => void;
  currentCalories: number;
  targetCalories: number;
}
