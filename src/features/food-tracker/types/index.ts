
export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  sodium_per_100g?: number;
  barcode?: string;
  category?: string;
  verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FoodConsumptionLog {
  id: string;
  user_id: string;
  food_item_id: string;
  quantity_g: number;
  calories_consumed: number;
  protein_consumed: number;
  carbs_consumed: number;
  fat_consumed: number;
  fiber_consumed?: number;
  sugar_consumed?: number;
  sodium_consumed?: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  consumed_at: string;
  meal_image_url?: string;
  notes?: string;
  source: 'manual' | 'ai_analysis' | 'barcode';
  food_item?: FoodItem;
  created_at?: string;
  updated_at?: string;
}

export interface NutritionSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber?: number;
  goalCalories?: number;
  goalProtein?: number;
  goalCarbs?: number;
  goalFat?: number;
}

export interface MealTypeData {
  breakfast: FoodConsumptionLog[];
  lunch: FoodConsumptionLog[];
  dinner: FoodConsumptionLog[];
  snack: FoodConsumptionLog[];
}

export interface FoodSearchFilters {
  category?: string;
  verified?: boolean;
  brand?: string;
  sortBy?: 'name' | 'calories' | 'protein' | 'recent';
  sortOrder?: 'asc' | 'desc';
}

export interface FoodAnalysisResult {
  name: string;
  quantity?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence?: number;
}
