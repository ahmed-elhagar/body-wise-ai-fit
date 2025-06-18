
import { supabase } from '@/integrations/supabase/client';
import type { FoodItem, FoodConsumptionLog } from '../types';

export const foodTrackingService = {
  // Food items operations
  async searchFoodItems(query: string, limit = 20): Promise<FoodItem[]> {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(limit)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getFoodItem(id: string): Promise<FoodItem | null> {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Food consumption operations
  async getFoodConsumptionLogs(
    userId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<FoodConsumptionLog[]> {
    const { data, error } = await supabase
      .from('food_consumption_log')
      .select(`
        *,
        food_item:food_items(*)
      `)
      .eq('user_id', userId)
      .gte('consumed_at', startDate.toISOString())
      .lte('consumed_at', endDate.toISOString())
      .order('consumed_at', { ascending: false });

    if (error) throw error;
    
    // Type assertion with proper meal_type casting
    return (data || []).map(item => ({
      ...item,
      meal_type: item.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack'
    })) as FoodConsumptionLog[];
  },

  async addFoodConsumption(
    consumption: Omit<FoodConsumptionLog, 'id' | 'created_at' | 'updated_at'>
  ): Promise<FoodConsumptionLog> {
    const { data, error } = await supabase
      .from('food_consumption_log')
      .insert(consumption)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      meal_type: data.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack'
    } as FoodConsumptionLog;
  },

  async updateFoodConsumption(
    id: string,
    updates: Partial<FoodConsumptionLog>
  ): Promise<FoodConsumptionLog> {
    const { data, error } = await supabase
      .from('food_consumption_log')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      meal_type: data.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack'
    } as FoodConsumptionLog;
  },

  async deleteFoodConsumption(id: string): Promise<void> {
    const { error } = await supabase
      .from('food_consumption_log')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Nutrition calculations
  calculateNutritionSummary(logs: FoodConsumptionLog[]) {
    return logs.reduce(
      (summary, log) => ({
        totalCalories: summary.totalCalories + (log.calories_consumed || 0),
        totalProtein: summary.totalProtein + (log.protein_consumed || 0),
        totalCarbs: summary.totalCarbs + (log.carbs_consumed || 0),
        totalFat: summary.totalFat + (log.fat_consumed || 0),
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    );
  },
};
