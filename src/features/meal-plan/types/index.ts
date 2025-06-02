
export interface DailyMeal {
  id: string;
  name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack1' | 'snack2';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: any[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  image_url?: string;
  youtube_search_term?: string;
  day_number: number;
  weekly_plan_id: string;
  alternatives?: any[];
}

export interface WeeklyMealPlan {
  id: string;
  user_id: string;
  week_start_date: string;
  created_at: string;
  updated_at: string;
}

export interface MealPlanPreferences {
  duration: string;
  cuisine: string;
  maxPrepTime: string;
  includeSnacks: boolean;
  mealTypes: string;
}
