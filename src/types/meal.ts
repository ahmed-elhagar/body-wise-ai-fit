
export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Meal {
  id: string; // Make id required with fallback generation
  type: string;
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  youtube_search_term?: string;
  image_url?: string;
  image: string; // Required with fallback to image_url or empty string
  meal_type?: string;
}
