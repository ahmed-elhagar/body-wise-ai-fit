
// Meal plan types
export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailyMeal {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'; // Legacy support
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime?: number;
  prep_time?: number; // Legacy support
  cookTime?: number;
  cook_time?: number; // Legacy support
  servings?: number;
  ingredients?: string[];
  instructions?: string[];
  imageUrl?: string;
  image_url?: string; // Legacy support
  recipeFetched: boolean;
  youtube_search_term?: string;
  alternatives?: DailyMeal[];
}

export interface WeeklyMealPlan {
  id: string;
  userId: string;
  weekStartDate: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  dailyMeals: DailyMeal[];
}

export interface MealPlanState {
  currentWeekOffset: number;
  selectedDay: number;
  isGenerating: boolean;
  error: string | null;
}

export interface MealPlanFetchResult {
  data: WeeklyMealPlan | null;
  isLoading: boolean;
  error: string | null;
}

export interface AddSnackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  onSnackAdded?: () => void;
}
