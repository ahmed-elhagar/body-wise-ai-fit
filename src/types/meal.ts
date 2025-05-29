
export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Meal {
  id?: string; // Add optional id property to match database structure
  type: string;
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
  image_url?: string; // Add this property for database image URLs
  imageUrl?: string; // Keep compatibility with existing code
  youtubeId: string;
}

export interface ShoppingItem {
  name: string;
  quantity: string;
  unit: string;
  category: string;
}
