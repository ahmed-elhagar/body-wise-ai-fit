
// Meal interface for daily view components
export interface Meal {
  id: string;
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  meal_type?: string;
  type?: string;
  prep_time?: number;
  cook_time?: number;
  prepTime?: number; // Legacy compatibility
  cookTime?: number; // Legacy compatibility
  servings?: number;
  ingredients?: any[];
  instructions?: string[];
  image_url?: string;
  image?: string; // Legacy compatibility
  youtube_search_term?: string;
}

// Legacy compatibility exports
export type { Meal as DailyMeal };

// Legacy ingredient interface for compatibility
export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}
