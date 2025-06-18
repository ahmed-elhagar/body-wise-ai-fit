
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
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime?: number;
  cookTime?: number;
  ingredients?: string[];
  instructions?: string[];
  imageUrl?: string;
  recipeFetched: boolean;
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
