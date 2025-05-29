
export interface FoodAnalysisItem {
  name: string;
  category: string;
  cuisine?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  quantity?: string;
}

export interface TotalNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface AIFoodAnalysisResult {
  foodItems: FoodAnalysisItem[];
  overallConfidence: number;
  cuisineType?: string;
  mealType?: string;
  suggestions?: string;
  recommendations?: string;
  totalNutrition?: TotalNutrition;
  imageData?: string;
  remainingCredits?: number;
}
