
export interface FoodConsumptionLog {
  id: string;
  user_id: string;
  food_item_id: string;
  quantity_g: number;
  calories_consumed: number;
  protein_consumed: number;
  carbs_consumed: number;
  fat_consumed: number;
  consumed_at: string;
  meal_type?: string;
  notes?: string;
  source?: string;
  meal_image_url?: string;
  ai_analysis_data?: any;
  created_at: string;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  cuisine_type?: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  sodium_per_100g?: number;
  serving_size_g?: number;
  serving_description?: string;
  confidence_score?: number;
  verified?: boolean;
  image_url?: string;
  barcode?: string;
  source?: string;
  created_at: string;
  updated_at: string;
}
