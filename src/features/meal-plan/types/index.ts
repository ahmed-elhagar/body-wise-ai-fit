
// Centralized types for meal plan feature
export interface DailyMeal {
  id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meal_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients?: string[];
  recipe?: string;
  image_url?: string;
}

export interface MealPlanFetchResult {
  weeklyPlan: any;
  dailyMeals?: DailyMeal[];
  weekStartDate: string;
  currentWeekOffset: number;
}

export interface MealPlanPreferences {
  dietaryRestrictions: string[];
  allergies: string[];
  calorieTarget: number;
  mealCount: number;
  lifePhase?: 'pregnancy' | 'breastfeeding' | 'fasting' | null;
}

export type ViewMode = 'daily' | 'weekly';
