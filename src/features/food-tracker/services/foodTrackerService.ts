
import { BaseService, type QueryResult, type ApiResponse } from '@/shared/services';
import { supabase } from '@/integrations/supabase/client';
import type { 
  FoodEntry, 
  NutritionGoals, 
  FoodSearchResult 
} from './foodTrackerApi';

export interface FoodAnalysisResult {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  confidence: 'high' | 'medium' | 'low';
  serving_size: string;
}

export interface WaterIntakeRecord {
  id: string;
  user_id: string;
  glasses_consumed: number;
  date: string;
  created_at: string;
}

export interface FoodTrackerFilters {
  date?: string;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

class FoodTrackerService extends BaseService {
  constructor() {
    super('FoodTracker', {
      cacheEnabled: true,
      cacheTTL: 3 * 60 * 1000, // 3 minutes for food data
      retryAttempts: 3,
      enableLogging: true
    });
  }

  /**
   * Get food consumption entries for a user
   */
  async getFoodEntries(
    userId: string, 
    filters: FoodTrackerFilters = {}
  ): Promise<ApiResponse<FoodEntry[]>> {
    const cacheKey = this.generateCacheKey('entries', userId, JSON.stringify(filters));
    
    const result = await this.executeQuery<FoodEntry[]>(
      'getFoodEntries',
      async () => {
        let query = supabase
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
          .order('consumed_at', { ascending: false });

        if (filters.date) {
          const startDate = `${filters.date}T00:00:00`;
          const endDate = `${filters.date}T23:59:59`;
          query = query.gte('consumed_at', startDate).lte('consumed_at', endDate);
        }

        if (filters.mealType) {
          query = query.eq('meal_type', filters.mealType);
        }

        if (filters.limit) {
          query = query.limit(filters.limit);
        }

        if (filters.offset) {
          query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
        }

        const { data, error } = await query;
        
        if (error) return { data: null, error };

        // Transform data to match FoodEntry interface
        const transformedData: FoodEntry[] = (data || []).map(item => ({
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

        return { data: transformedData, error: null };
      },
      cacheKey
    );

    return this.toApiResponse(result, 'Food entries retrieved successfully');
  }

  /**
   * Add a new food consumption entry
   */
  async addFoodEntry(foodEntry: Omit<FoodEntry, 'id' | 'created_at'>): Promise<ApiResponse<FoodEntry>> {
    const result = await this.executeQuery<FoodEntry>(
      'addFoodEntry',
      async () => {
        // First create or find the food item
        const { data: foodItem, error: foodItemError } = await supabase
          .from('food_items')
          .insert({
            name: foodEntry.food_name,
            calories_per_100g: (foodEntry.calories / foodEntry.quantity) * 100,
            protein_per_100g: (foodEntry.protein / foodEntry.quantity) * 100,
            carbs_per_100g: (foodEntry.carbs / foodEntry.quantity) * 100,
            fat_per_100g: (foodEntry.fat / foodEntry.quantity) * 100,
            category: 'general'
          })
          .select()
          .single();

        if (foodItemError) {
          return { data: null, error: foodItemError };
        }

        // Then create the consumption log entry
        const { data, error } = await supabase
          .from('food_consumption_log')
          .insert({
            user_id: foodEntry.user_id,
            food_item_id: foodItem.id,
            quantity_g: foodEntry.quantity,
            calories_consumed: foodEntry.calories,
            protein_consumed: foodEntry.protein,
            carbs_consumed: foodEntry.carbs,
            fat_consumed: foodEntry.fat,
            meal_type: foodEntry.meal_type,
            consumed_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) return { data: null, error };

        const transformedEntry: FoodEntry = {
          id: data.id,
          user_id: data.user_id,
          food_name: foodEntry.food_name,
          calories: data.calories_consumed,
          protein: data.protein_consumed,
          carbs: data.carbs_consumed,
          fat: data.fat_consumed,
          meal_type: data.meal_type,
          quantity: data.quantity_g,
          created_at: data.consumed_at
        };

        return { data: transformedEntry, error: null };
      }
    );

    // Clear cache for this user's entries
    this.clearUserCache(foodEntry.user_id);

    return this.toApiResponse(result, 'Food entry added successfully');
  }

  /**
   * Update an existing food consumption entry
   */
  async updateFoodEntry(
    entryId: string, 
    updates: Partial<FoodEntry>
  ): Promise<ApiResponse<FoodEntry>> {
    const result = await this.executeQuery<FoodEntry>(
      'updateFoodEntry',
      async () => {
        const { data, error } = await supabase
          .from('food_consumption_log')
          .update({
            quantity_g: updates.quantity,
            calories_consumed: updates.calories,
            protein_consumed: updates.protein,
            carbs_consumed: updates.carbs,
            fat_consumed: updates.fat,
            meal_type: updates.meal_type
          })
          .eq('id', entryId)
          .select()
          .single();

        if (error) return { data: null, error };

        const transformedEntry: FoodEntry = {
          id: data.id,
          user_id: data.user_id,
          food_name: updates.food_name || 'Unknown Food',
          calories: data.calories_consumed,
          protein: data.protein_consumed,
          carbs: data.carbs_consumed,
          fat: data.fat_consumed,
          meal_type: data.meal_type,
          quantity: data.quantity_g,
          created_at: data.consumed_at
        };

        return { data: transformedEntry, error: null };
      }
    );

    // Clear cache if user_id is available
    if (updates.user_id) {
      this.clearUserCache(updates.user_id);
    }

    return this.toApiResponse(result, 'Food entry updated successfully');
  }

  /**
   * Delete a food consumption entry
   */
  async deleteFoodEntry(entryId: string, userId: string): Promise<ApiResponse<void>> {
    const result = await this.executeQuery<void>(
      'deleteFoodEntry',
      async () => {
        const { error } = await supabase
          .from('food_consumption_log')
          .delete()
          .eq('id', entryId);

        return { data: null, error };
      }
    );

    // Clear cache for this user
    this.clearUserCache(userId);

    return this.toApiResponse(result, 'Food entry deleted successfully');
  }

  /**
   * Search food database
   */
  async searchFood(query: string, limit = 20): Promise<ApiResponse<FoodSearchResult[]>> {
    const cacheKey = this.generateCacheKey('search', query, limit);
    
    const result = await this.executeQuery<FoodSearchResult[]>(
      'searchFood',
      async () => {
        const { data, error } = await supabase
          .from('food_items')
          .select('*')
          .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
          .limit(limit);

        if (error) return { data: null, error };

        const transformedResults: FoodSearchResult[] = (data || []).map(item => ({
          id: item.id,
          name: item.name,
          calories_per_100g: item.calories_per_100g,
          protein_per_100g: item.protein_per_100g,
          carbs_per_100g: item.carbs_per_100g,
          fat_per_100g: item.fat_per_100g,
          category: item.category
        }));

        return { data: transformedResults, error: null };
      },
      cacheKey
    );

    return this.toApiResponse(result, 'Food search completed successfully');
  }

  /**
   * Analyze food photo using AI
   */
  async analyzeFoodPhoto(imageBase64: string, userId: string): Promise<ApiResponse<FoodAnalysisResult>> {
    const result = await this.executeFunction<FoodAnalysisResult>(
      'analyze-food-image',
      {
        image: imageBase64,
        user_id: userId
      },
      true // Enable retry for AI functions
    );

    return this.toApiResponse(result, 'Food photo analyzed successfully');
  }

  /**
   * Clear cache for a specific user
   */
  private clearUserCache(userId: string, type?: string): void {
    const keys = Array.from(BaseService.queryCache.keys());
    const pattern = type 
      ? `${this.serviceName}:${type}:${userId}`
      : `${this.serviceName}:.*:${userId}`;
    
    const userKeys = keys.filter(key => 
      type ? key.startsWith(pattern) : key.includes(userId)
    );
    
    userKeys.forEach(key => BaseService.queryCache.delete(key));
    
    if (this.options.enableLogging) {
      console.log(`🧹 ${this.serviceName} cleared user cache for ${userId} (${userKeys.length} entries)`);
    }
  }

  /**
   * Get service performance metrics
   */
  getPerformanceMetrics(): {
    cacheStats: ReturnType<typeof this.getCacheStats>;
    serviceName: string;
    options: typeof this.options;
  } {
    return {
      cacheStats: this.getCacheStats(),
      serviceName: this.serviceName,
      options: this.options
    };
  }
}

// Export singleton instance
export const foodTrackerService = new FoodTrackerService();
export default foodTrackerService;
