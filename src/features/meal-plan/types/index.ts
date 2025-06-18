
// Meal plan types
export interface MealIngredient {
  name: string;
  quantity: string;
  unit: string;
  category?: string;
}

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailyMeal {
  id: string;
  weekly_plan_id?: string;
  day_number?: number;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'; // Legacy support
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  prepTime?: number;
  prep_time?: number; // Legacy support
  cookTime?: number;
  cook_time?: number; // Legacy support
  servings?: number;
  ingredients?: MealIngredient[];
  instructions?: string[];
  imageUrl?: string;
  image_url?: string; // Legacy support
  recipeFetched: boolean;
  recipe_fetched?: boolean; // Legacy support
  youtube_search_term?: string;
  alternatives?: string[];
}

export interface WeeklyMealPlan {
  id: string;
  user_id: string;
  week_start_date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  preferences?: any;
  created_at: string;
  updated_at: string;
  life_phase_context?: any;
}

export interface MealPlanFetchResult {
  weeklyPlan: WeeklyMealPlan;
  dailyMeals: DailyMeal[];
}

export interface MealPlanState {
  currentWeekOffset: number;
  selectedDay: number;
  isGenerating: boolean;
  error: string | null;
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
  currentDayCalories: number | null;
  targetDayCalories: number | null;
  weeklyPlanId?: string;
  onSnackAdded?: () => void;
}
