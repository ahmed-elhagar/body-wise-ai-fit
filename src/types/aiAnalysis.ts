
export interface FoodAnalysisResult {
  food_name: string;
  confidence: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  portion_size?: string;
  ingredients?: string[];
  allergens?: string[];
  dietary_tags?: string[];
  // Extended properties for compatibility
  overallConfidence?: number;
  mealType?: string;
  cuisineType?: string;
  totalNutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  foodItems?: Array<{
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    category: string;
    quantity?: string;
  }>;
  recommendations?: string;
  remainingCredits?: number;
}

export interface ImageAnalysisResponse {
  success: boolean;
  results: FoodAnalysisResult[];
  error?: string;
  processing_time?: number;
  // Extended for compatibility
  analysis?: {
    overallConfidence: number;
    foodItems: Array<{
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      category: string;
      quantity?: string;
    }>;
    suggestions?: string;
  };
}

export interface AIAnalysisContext {
  image_url: string;
  user_preferences?: {
    dietary_restrictions?: string[];
    allergies?: string[];
    preferred_units?: 'metric' | 'imperial';
  };
  analysis_type: 'nutrition' | 'ingredients' | 'full';
}

// Legacy alias for backward compatibility
export type AIFoodAnalysisResult = FoodAnalysisResult;
