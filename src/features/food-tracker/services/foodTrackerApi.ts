
import { supabase } from '@/integrations/supabase/client';

export interface FoodEntry {
  id: string;
  user_id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: string;
  quantity: number;
  created_at: string;
}

export interface NutritionSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealCount: number;
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodSearchResult {
  id: string;
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  category: string;
}

export const foodTrackerApi = {
  // Get user's food entries for a specific date
  async getFoodEntries(userId: string, date: string): Promise<FoodEntry[]> {
    try {
      const { data, error } = await supabase
        .from('food_consumption_log')
        .select(`
          id,
          user_id,
          food_item_id,
          quantity_g,
          calories_consumed,
          protein_consumed,
          carbs_consumed,
          fat_consumed,
          meal_type,
          consumed_at,
          food_items (
            name
          )
        `)
        .eq('user_id', userId)
        .gte('consumed_at', `${date}T00:00:00`)
        .lt('consumed_at', `${date}T23:59:59`)
        .order('consumed_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match FoodEntry interface
      const entries: FoodEntry[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        food_name: item.food_items?.name || 'Unknown Food',
        calories: item.calories_consumed || 0,
        protein: item.protein_consumed || 0,
        carbs: item.carbs_consumed || 0,
        fat: item.fat_consumed || 0,
        meal_type: item.meal_type || 'snack',
        quantity: item.quantity_g || 0,
        created_at: item.consumed_at || new Date().toISOString()
      }));

      return entries;
    } catch (error) {
      console.error('Error fetching food entries:', error);
      return [];
    }
  },

  // Add a new food entry
  async addFoodEntry(entry: Omit<FoodEntry, 'id' | 'created_at'>): Promise<FoodEntry | null> {
    try {
      // First create or find the food item
      const { data: foodItem, error: foodItemError } = await supabase
        .from('food_items')
        .insert({
          name: entry.food_name,
          calories_per_100g: (entry.calories / entry.quantity) * 100,
          protein_per_100g: (entry.protein / entry.quantity) * 100,
          carbs_per_100g: (entry.carbs / entry.quantity) * 100,
          fat_per_100g: (entry.fat / entry.quantity) * 100,
          category: 'general'
        })
        .select()
        .single();

      if (foodItemError) {
        console.error('Error creating food item:', foodItemError);
        return null;
      }

      // Then create the consumption log entry
      const { data, error } = await supabase
        .from('food_consumption_log')
        .insert({
          user_id: entry.user_id,
          food_item_id: foodItem.id,
          quantity_g: entry.quantity,
          calories_consumed: entry.calories,
          protein_consumed: entry.protein,
          carbs_consumed: entry.carbs,
          fat_consumed: entry.fat,
          meal_type: entry.meal_type,
          consumed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        user_id: data.user_id,
        food_name: entry.food_name,
        calories: data.calories_consumed,
        protein: data.protein_consumed,
        carbs: data.carbs_consumed,
        fat: data.fat_consumed,
        meal_type: data.meal_type,
        quantity: data.quantity_g,
        created_at: data.consumed_at
      };
    } catch (error) {
      console.error('Error adding food entry:', error);
      return null;
    }
  },

  // Get nutrition summary for a date
  async getNutritionSummary(userId: string, date: string): Promise<NutritionSummary> {
    try {
      const entries = await this.getFoodEntries(userId, date);
      
      return entries.reduce((summary, entry) => ({
        totalCalories: summary.totalCalories + entry.calories,
        totalProtein: summary.totalProtein + entry.protein,
        totalCarbs: summary.totalCarbs + entry.carbs,
        totalFat: summary.totalFat + entry.fat,
        mealCount: summary.mealCount + 1
      }), {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        mealCount: 0
      });
    } catch (error) {
      console.error('Error getting nutrition summary:', error);
      return {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        mealCount: 0
      };
    }
  }
};
