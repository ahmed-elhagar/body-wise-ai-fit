
export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Meal {
  id?: string;
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
  imageUrl?: string;
  image_url?: string;
}
