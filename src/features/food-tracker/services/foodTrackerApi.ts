// Food Tracker API Service Layer
// Centralized API calls for food tracking functionality

import { supabase } from '@/integrations/supabase/client';

export interface FoodEntry {
  id: string;
  user_id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  serving_size: string;
  quantity: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface NutritionGoals {
  user_id: string;
  daily_calories: number;
  daily_protein: number;
  daily_carbs: number;
  daily_fat: number;
  daily_fiber?: number;
}

export interface FoodSearchResult {
  id: string;
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  brand?: string;
  category?: string;
}

export const foodTrackerApi = {
  // Food Entries
  async getFoodEntries(userId: string, date?: string): Promise<FoodEntry[]> {
    try {
      let query = supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (date) {
        query = query.eq('date', date);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching food entries:', error);
      return [];
    }
  },

  async addFoodEntry(entry: Omit<FoodEntry, 'id' | 'created_at' | 'updated_at'>): Promise<FoodEntry | null> {
    try {
      const { data, error } = await supabase
        .from('food_entries')
        .insert(entry)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding food entry:', error);
      return null;
    }
  },

  async updateFoodEntry(id: string, updates: Partial<FoodEntry>): Promise<FoodEntry | null> {
    try {
      const { data, error } = await supabase
        .from('food_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating food entry:', error);
      return null;
    }
  },

  async deleteFoodEntry(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('food_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting food entry:', error);
      return false;
    }
  },

  // Food Database Search
  async searchFoods(query: string, limit = 20): Promise<FoodSearchResult[]> {
    try {
      const { data, error } = await supabase
        .from('food_database')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching foods:', error);
      return [];
    }
  },

  // Photo Analysis
  async analyzePhoto(imageBase64: string, userId: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-food-photo', {
        body: {
          image: imageBase64,
          user_id: userId
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error analyzing food photo:', error);
      return null;
    }
  },

  // Nutrition Goals
  async getNutritionGoals(userId: string): Promise<NutritionGoals | null> {
    try {
      const { data, error } = await supabase
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching nutrition goals:', error);
      return null;
    }
  },

  async updateNutritionGoals(goals: NutritionGoals): Promise<NutritionGoals | null> {
    try {
      const { data, error } = await supabase
        .from('nutrition_goals')
        .upsert(goals)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating nutrition goals:', error);
      return null;
    }
  },

  // Daily Summary
  async getDailySummary(userId: string, date: string): Promise<any> {
    try {
      const entries = await this.getFoodEntries(userId, date);
      const goals = await this.getNutritionGoals(userId);

      const summary = entries.reduce((acc, entry) => {
        acc.calories += entry.calories * entry.quantity;
        acc.protein += entry.protein * entry.quantity;
        acc.carbs += entry.carbs * entry.quantity;
        acc.fat += entry.fat * entry.quantity;
        acc.fiber += (entry.fiber || 0) * entry.quantity;
        return acc;
      }, {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        entries_count: entries.length
      });

      return {
        summary,
        goals,
        entries,
        progress: goals ? {
          calories: Math.round((summary.calories / goals.daily_calories) * 100),
          protein: Math.round((summary.protein / goals.daily_protein) * 100),
          carbs: Math.round((summary.carbs / goals.daily_carbs) * 100),
          fat: Math.round((summary.fat / goals.daily_fat) * 100)
        } : null
      };
    } catch (error) {
      console.error('Error getting daily summary:', error);
      return null;
    }
  }
};

export default foodTrackerApi; 