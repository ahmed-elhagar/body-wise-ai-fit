
// Core meal plan types and interfaces
export interface MealIngredient {
  name: string;
  quantity: string;
  unit: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface DailyMeal {
  id: string;
  weekly_plan_id: string;
  day_number: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack1' | 'snack2';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  ingredients: MealIngredient[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  youtube_search_term?: string;
  image_url?: string;
  alternatives?: any[];
  description?: string;
  difficulty?: string;
  cuisine?: string;
  tips?: string;
  nutrition_benefits?: string;
  cultural_info?: string;
  recipe_fetched?: boolean;
}

export interface WeeklyMealPlan {
  id: string;
  user_id: string;
  week_start_date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  generation_prompt: any;
  created_at: string;
  life_phase_context?: any;
}

export interface MealPlanFetchResult {
  weeklyPlan: WeeklyMealPlan;
  dailyMeals: DailyMeal[];
}

export interface MealPlanPreferences {
  duration: string;
  cuisine: string;
  maxPrepTime: string;
  mealTypes: string;
  includeSnacks: boolean;
  dietaryRestrictions?: string[];
  allergies?: string[];
  language?: string;
  weekOffset?: number;
}

export interface ShoppingItem {
  name: string;
  quantity: string;
  unit: string;
  category: string;
}

// Dialog props interfaces
export interface AddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  weeklyPlanId: string | null;
  onSnackAdded: () => void;
  currentDayCalories: number;
  targetDayCalories: number;
}
