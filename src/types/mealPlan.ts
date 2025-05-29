
// Comprehensive meal plan types
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
}

export interface AIGeneratedDay {
  dayNumber: number;
  dayName: string;
  totalCalories: number;
  meals: AIGeneratedMeal[];
}

export interface AIGeneratedMeal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack1' | 'snack2';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  description?: string;
  ingredients: MealIngredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  youtubeSearchTerm?: string;
  cuisine?: string;
  difficulty?: string;
  tips?: string;
  nutritionBenefits?: string;
  culturalInfo?: string;
}

export interface AIGeneratedPlan {
  weekSummary: {
    totalCalories: number;
    avgDailyCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    dietType: string;
  };
  days: AIGeneratedDay[];
}

export interface MealPlanPreferences {
  duration: string;
  cuisine: string;
  maxPrepTime: string;
  mealTypes: string;
  dietaryRestrictions?: string[];
  allergies?: string[];
}
