
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
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
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
  total_carbs: number;
  total_fat: number;
  preferences: any;
  created_at: string;
  updated_at: string;
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
  includeSnacks: boolean;
  mealTypes: string;
}

export interface AddSnackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  weeklyPlanId?: string;
  onSnackAdded: () => void;
  currentDayCalories: number;
  targetDayCalories: number;
}
