
export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Meal {
  id?: string;
  type: string;
  meal_type?: string; // Add this property to match database schema
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Ingredient[];
  instructions: string[];
  cookTime: number;
  prepTime: number;
  servings: number;
  image: string;
  imageUrl?: string;
  image_url?: string;
  youtube_search_term?: string; // Add this property for YouTube search functionality
}
