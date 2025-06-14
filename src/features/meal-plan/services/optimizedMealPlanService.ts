
import { supabase } from '@/integrations/supabase/client';
import type { WeeklyMealPlan, DailyMeal } from '../types';

interface FetchParams {
  userId: string;
  weekStartDate: string;
  includeIngredients?: boolean;
  includeInstructions?: boolean;
  mealTypes?: ReadonlyArray<string>;
}

interface ServiceResult<T> {
  data: T | null;
  error: Error | null;
  fromCache?: boolean;
  queryTime?: number;
}

interface OptimizedMealPlanData {
  weeklyPlan: WeeklyMealPlan;
  dailyMeals: DailyMeal[];
}

class OptimizedMealPlanServiceClass {
  private cache = new Map<string, { data: OptimizedMealPlanData; timestamp: number }>();
  private readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

  private getCacheKey(params: FetchParams): string {
    return `${params.userId}-${params.weekStartDate}-${params.includeIngredients}-${params.includeInstructions}`;
  }

  private isValidCacheEntry(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  async fetchMealPlanData(params: FetchParams): Promise<ServiceResult<OptimizedMealPlanData>> {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey(params);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && this.isValidCacheEntry(cached.timestamp)) {
      console.log('📋 Returning cached meal plan data');
      return {
        data: cached.data,
        error: null,
        fromCache: true,
        queryTime: 0
      };
    }

    try {
      console.log('🔍 Fetching meal plan from database:', params.weekStartDate);

      // Fetch weekly plan
      const { data: weeklyPlan, error: weeklyError } = await supabase
        .from('weekly_meal_plans')
        .select('*')
        .eq('user_id', params.userId)
        .eq('week_start_date', params.weekStartDate)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (weeklyError) {
        console.error('❌ Error fetching weekly plan:', weeklyError);
        throw new Error(`Failed to fetch weekly plan: ${weeklyError.message}`);
      }

      if (!weeklyPlan) {
        console.log('ℹ️ No meal plan found for this week');
        return { data: null, error: null, queryTime: Date.now() - startTime };
      }

      // Fetch daily meals
      let query = supabase
        .from('daily_meals')
        .select('*')
        .eq('weekly_plan_id', weeklyPlan.id)
        .order('day_number', { ascending: true })
        .order('created_at', { ascending: true });

      // Apply meal type filter if specified
      if (params.mealTypes && params.mealTypes.length > 0) {
        query = query.in('meal_type', params.mealTypes as string[]);
      }

      const { data: dailyMeals, error: mealsError } = await query;

      if (mealsError) {
        console.error('❌ Error fetching daily meals:', mealsError);
        throw new Error(`Failed to fetch daily meals: ${mealsError.message}`);
      }

      // Convert database types to application types
      const convertedWeeklyPlan: WeeklyMealPlan = {
        ...weeklyPlan,
        preferences: weeklyPlan.generation_prompt || {},
        updated_at: weeklyPlan.created_at // Use created_at as updated_at fallback
      };

      const convertedDailyMeals: DailyMeal[] = (dailyMeals || []).map(meal => ({
        ...meal,
        meal_type: meal.meal_type as DailyMeal['meal_type'],
        ingredients: meal.ingredients || [],
        instructions: meal.instructions || [],
        alternatives: meal.alternatives || []
      }));

      const result: OptimizedMealPlanData = {
        weeklyPlan: convertedWeeklyPlan,
        dailyMeals: convertedDailyMeals
      };

      // Cache the result
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      const queryTime = Date.now() - startTime;
      console.log(`✅ Meal plan fetched successfully in ${queryTime}ms:`, {
        weeklyPlanId: weeklyPlan.id,
        mealsCount: dailyMeals?.length || 0
      });

      return {
        data: result,
        error: null,
        fromCache: false,
        queryTime
      };

    } catch (error) {
      console.error('❌ OptimizedMealPlanService error:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error occurred'),
        queryTime: Date.now() - startTime
      };
    }
  }

  clearCache(): void {
    console.log('🗑️ Clearing meal plan service cache');
    this.cache.clear();
  }

  clearCacheForUser(userId: string): void {
    console.log('🗑️ Clearing cache for user:', userId);
    for (const [key] of this.cache) {
      if (key.startsWith(userId)) {
        this.cache.delete(key);
      }
    }
  }

  getCacheStats() {
    const validEntries = Array.from(this.cache.values())
      .filter(entry => this.isValidCacheEntry(entry.timestamp));
    
    return {
      totalEntries: this.cache.size,
      validEntries: validEntries.length,
      cacheHitRate: validEntries.length / Math.max(this.cache.size, 1)
    };
  }
}

export const OptimizedMealPlanService = new OptimizedMealPlanServiceClass();
