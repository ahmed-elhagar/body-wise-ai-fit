
export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  sodium_per_100g?: number;
  verified: boolean;
}

export interface FoodConsumptionEntry {
  id: string;
  user_id: string;
  food_item_id: string;
  quantity_g: number;
  calories_consumed: number;
  protein_consumed: number;
  carbs_consumed: number;
  fat_consumed: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  consumed_at: string;
  notes?: string;
  source: 'manual' | 'ai_analysis' | 'barcode';
  food_item?: FoodItem;
}

export interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailyGoals extends NutritionTotals {
  water: number;
}
