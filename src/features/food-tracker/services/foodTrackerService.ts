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
   * Get food entries for a user
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
          .from('food_entries')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (filters.date) {
          query = query.eq('date', filters.date);
        }

        if (filters.mealType) {
          query = query.eq('meal_type', filters.mealType);
        }

        if (filters.searchTerm) {
          query = query.ilike('food_name', `%${filters.searchTerm}%`);
        }

        if (filters.limit) {
          query = query.limit(filters.limit);
        }

        if (filters.offset) {
          query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
        }

        return await query;
      },
      cacheKey
    );

    return this.toApiResponse(result, 'Food entries retrieved successfully');
  }

  /**
   * Add a new food entry
   */
  async addFoodEntry(foodEntry: Omit<FoodEntry, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<FoodEntry>> {
    const result = await this.executeQuery<FoodEntry>(
      'addFoodEntry',
      async () => {
        return await supabase
          .from('food_entries')
          .insert([foodEntry])
          .select()
          .single();
      }
    );

    // Clear cache for this user's entries
    this.clearUserCache(foodEntry.user_id);

    return this.toApiResponse(result, 'Food entry added successfully');
  }

  /**
   * Update an existing food entry
   */
  async updateFoodEntry(
    entryId: string, 
    updates: Partial<FoodEntry>
  ): Promise<ApiResponse<FoodEntry>> {
    const result = await this.executeQuery<FoodEntry>(
      'updateFoodEntry',
      async () => {
        return await supabase
          .from('food_entries')
          .update(updates)
          .eq('id', entryId)
          .select()
          .single();
      }
    );

    // Clear cache if user_id is available
    if (updates.user_id) {
      this.clearUserCache(updates.user_id);
    }

    return this.toApiResponse(result, 'Food entry updated successfully');
  }

  /**
   * Delete a food entry
   */
  async deleteFoodEntry(entryId: string, userId: string): Promise<ApiResponse<void>> {
    const result = await this.executeQuery<void>(
      'deleteFoodEntry',
      async () => {
        const { error } = await supabase
          .from('food_entries')
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
   * Get nutrition goals for a user
   */
  async getNutritionGoals(userId: string): Promise<ApiResponse<NutritionGoals>> {
    const cacheKey = this.generateCacheKey('goals', userId);
    
    const result = await this.executeQuery<NutritionGoals>(
      'getNutritionGoals',
      async () => {
        return await supabase
          .from('nutrition_goals')
          .select('*')
          .eq('user_id', userId)
          .single();
      },
      cacheKey
    );

    return this.toApiResponse(result, 'Nutrition goals retrieved successfully');
  }

  /**
   * Update nutrition goals for a user
   */
  async updateNutritionGoals(
    userId: string, 
    goals: Omit<NutritionGoals, 'user_id'>
  ): Promise<ApiResponse<NutritionGoals>> {
    const result = await this.executeQuery<NutritionGoals>(
      'updateNutritionGoals',
      async () => {
        return await supabase
          .from('nutrition_goals')
          .upsert([{ user_id: userId, ...goals }])
          .select()
          .single();
      }
    );

    // Clear goals cache
    this.clearUserCache(userId, 'goals');

    return this.toApiResponse(result, 'Nutrition goals updated successfully');
  }

  /**
   * Search food database
   */
  async searchFood(query: string, limit = 20): Promise<ApiResponse<FoodSearchResult[]>> {
    const cacheKey = this.generateCacheKey('search', query, limit);
    
    const result = await this.executeQuery<FoodSearchResult[]>(
      'searchFood',
      async () => {
        return await supabase
          .from('food_database')
          .select('*')
          .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
          .limit(limit);
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
      'analyze-food-photo',
      {
        image: imageBase64,
        user_id: userId
      },
      true // Enable retry for AI functions
    );

    return this.toApiResponse(result, 'Food photo analyzed successfully');
  }

  /**
   * Get water intake for a user
   */
  async getWaterIntake(userId: string, date?: string): Promise<ApiResponse<WaterIntakeRecord>> {
    const cacheKey = this.generateCacheKey('water', userId, date || 'today');
    
    const result = await this.executeQuery<WaterIntakeRecord>(
      'getWaterIntake',
      async () => {
        let query = supabase
          .from('water_intake')
          .select('*')
          .eq('user_id', userId);

        if (date) {
          query = query.eq('date', date);
        } else {
          // Get today's record
          const today = new Date().toISOString().split('T')[0];
          query = query.eq('date', today);
        }

        return await query.single();
      },
      cacheKey
    );

    return this.toApiResponse(result, 'Water intake retrieved successfully');
  }

  /**
   * Update water intake
   */
  async updateWaterIntake(
    userId: string, 
    glasses: number, 
    date?: string
  ): Promise<ApiResponse<WaterIntakeRecord>> {
    const targetDate = date || new Date().toISOString().split('T')[0];

    const result = await this.executeQuery<WaterIntakeRecord>(
      'updateWaterIntake',
      async () => {
        return await supabase
          .from('water_intake')
          .upsert([{
            user_id: userId,
            glasses_consumed: glasses,
            date: targetDate
          }])
          .select()
          .single();
      }
    );

    // Clear water cache for this user
    this.clearUserCache(userId, 'water');

    return this.toApiResponse(result, 'Water intake updated successfully');
  }

  /**
   * Get daily nutrition summary
   */
  async getDailyNutritionSummary(userId: string, date?: string): Promise<ApiResponse<{
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalFiber: number;
    mealBreakdown: Record<string, any>;
    waterIntake: number;
  }>> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const cacheKey = this.generateCacheKey('summary', userId, targetDate);

    const result = await this.executeQuery(
      'getDailyNutritionSummary',
      async () => {
        // Get food entries for the day
        const { data: entries, error: entriesError } = await supabase
          .from('food_entries')
          .select('*')
          .eq('user_id', userId)
          .eq('date', targetDate);

        if (entriesError) {
          return { data: null, error: entriesError };
        }

        // Get water intake
        const { data: waterData } = await supabase
          .from('water_intake')
          .select('glasses_consumed')
          .eq('user_id', userId)
          .eq('date', targetDate)
          .single();

        // Calculate totals
        const totals = (entries || []).reduce((acc, entry) => ({
          totalCalories: acc.totalCalories + (entry.calories || 0),
          totalProtein: acc.totalProtein + (entry.protein || 0),
          totalCarbs: acc.totalCarbs + (entry.carbs || 0),
          totalFat: acc.totalFat + (entry.fat || 0),
          totalFiber: acc.totalFiber + (entry.fiber || 0)
        }), {
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          totalFiber: 0
        });

        // Group by meal type
        const mealBreakdown = (entries || []).reduce((acc, entry) => {
          const mealType = entry.meal_type || 'other';
          if (!acc[mealType]) {
            acc[mealType] = [];
          }
          acc[mealType].push(entry);
          return acc;
        }, {} as Record<string, any>);

        return {
          data: {
            ...totals,
            mealBreakdown,
            waterIntake: waterData?.glasses_consumed || 0
          },
          error: null
        };
      },
      cacheKey
    );

    return this.toApiResponse(result, 'Daily nutrition summary retrieved successfully');
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