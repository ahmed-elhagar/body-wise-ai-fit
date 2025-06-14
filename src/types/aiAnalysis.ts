
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
}

export interface ImageAnalysisResponse {
  success: boolean;
  results: FoodAnalysisResult[];
  error?: string;
  processing_time?: number;
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
