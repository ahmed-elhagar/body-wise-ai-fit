
import { supabase } from '@/integrations/supabase/client';
import type { 
  StrictMealPlanFetchResult, 
  OptimizedQueryParams, 
  DatabaseQueryResult,
  StrictDailyMeal,
  StrictWeeklyMealPlan 
} from '../types/enhanced';

// Optimized database service with better query performance
export class OptimizedMealPlanService {
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private static queryCache = new Map<string, { data: unknown; timestamp: number }>();

  static async fetchMealPlanData(
    params: OptimizedQueryParams
  ): Promise<DatabaseQueryResult<StrictMealPlanFetchResult>> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(params);
    
    // Check cache first
    const cached = this.getFromCache<StrictMealPlanFetchResult>(cacheKey);
    if (cached) {
      return {
        data: cached,
        error: null,
        fromCache: true,
        queryTime: Date.now() - startTime
      };
    }

    try {
      console.log('🔍 Optimized fetch for meal plan:', {
        userId: params.userId.substring(0, 8) + '...',
        weekStartDate: params.weekStartDate
      });

      // Optimized weekly plan query
      const weeklyPlanQuery = supabase
        .from('weekly_meal_plans')
        .select('*')
        .eq('user_id', params.userId)
        .eq('week_start_date', params.weekStartDate)
        .maybeSingle();

      const { data: weeklyPlan, error: weeklyError } = await weeklyPlanQuery;

      if (weeklyError) {
        console.error('❌ Error fetching weekly meal plan:', weeklyError);
        return {
          data: null,
          error: weeklyError,
          fromCache: false,
          queryTime: Date.now() - startTime
        };
      }

      if (!weeklyPlan) {
        console.log('📋 No weekly meal plan found');
        return {
          data: null,
          error: null,
          fromCache: false,
          queryTime: Date.now() - startTime
        };
      }

      // Optimized daily meals query with selective fields
      const selectFields = this.buildSelectFields(params);
      const dailyMealsQuery = supabase
        .from('daily_meals')
        .select(selectFields)
        .eq('weekly_plan_id', weeklyPlan.id)
        .order('day_number', { ascending: true });

      // Add meal type filter if specified
      if (params.mealTypes && params.mealTypes.length > 0) {
        dailyMealsQuery.in('meal_type', params.mealTypes);
      }

      const { data: dailyMeals, error: mealsError } = await dailyMealsQuery;

      if (mealsError) {
        console.error('❌ Error fetching daily meals:', mealsError);
        return {
          data: null,
          error: mealsError,
          fromCache: false,
          queryTime: Date.now() - startTime
        };
      }

      const result: StrictMealPlanFetchResult = {
        weeklyPlan: this.processWeeklyPlan(weeklyPlan),
        dailyMeals: this.processDailyMeals(dailyMeals || [])
      };

      // Cache the result
      this.setCache(cacheKey, result);

      console.log('✅ Optimized meal plan data fetched:', {
        weeklyPlanId: weeklyPlan.id,
        dailyMealsCount: dailyMeals?.length || 0,
        queryTime: Date.now() - startTime
      });

      return {
        data: result,
        error: null,
        fromCache: false,
        queryTime: Date.now() - startTime
      };

    } catch (error) {
      console.error('❌ Exception in optimized fetch:', error);
      return {
        data: null,
        error: error as Error,
        fromCache: false,
        queryTime: Date.now() - startTime
      };
    }
  }

  private static generateCacheKey(params: OptimizedQueryParams): string {
    return `meal_plan_${params.userId}_${params.weekStartDate}_${JSON.stringify(params.mealTypes || [])}`;
  }

  private static getFromCache<T>(key: string): T | null {
    const cached = this.queryCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    this.queryCache.delete(key);
    return null;
  }

  private static setCache<T>(key: string, data: T): void {
    this.queryCache.set(key, { data, timestamp: Date.now() });
  }

  private static buildSelectFields(params: OptimizedQueryParams): string {
    const baseFields = [
      'id', 'weekly_plan_id', 'day_number', 'meal_type', 'name',
      'calories', 'protein', 'carbs', 'fat', 'prep_time', 'cook_time',
      'servings', 'youtube_search_term', 'image_url', 'recipe_fetched'
    ];

    if (params.includeIngredients !== false) {
      baseFields.push('ingredients');
    }

    if (params.includeInstructions !== false) {
      baseFields.push('instructions', 'alternatives');
    }

    return baseFields.join(',');
  }

  private static processWeeklyPlan(plan: any): StrictWeeklyMealPlan {
    return {
      id: plan.id,
      user_id: plan.user_id,
      week_start_date: plan.week_start_date,
      total_calories: plan.total_calories || 0,
      total_protein: plan.total_protein || 0,
      total_carbs: plan.total_carbs || 0,
      total_fat: plan.total_fat || 0,
      preferences: plan.generation_prompt || {},
      created_at: plan.created_at,
      updated_at: plan.created_at,
      life_phase_context: plan.life_phase_context
    };
  }

  private static processDailyMeals(meals: any[]): ReadonlyArray<StrictDailyMeal> {
    return meals.map(meal => ({
      id: meal.id,
      weekly_plan_id: meal.weekly_plan_id,
      day_number: meal.day_number,
      meal_type: meal.meal_type as StrictDailyMeal['meal_type'],
      name: meal.name,
      calories: meal.calories || 0,
      protein: meal.protein || 0,
      carbs: meal.carbs || 0,
      fat: meal.fat || 0,
      fiber: 0, // Default since not in DB
      sugar: 0, // Default since not in DB
      prep_time: meal.prep_time || 0,
      cook_time: meal.cook_time || 0,
      servings: meal.servings || 1,
      youtube_search_term: meal.youtube_search_term,
      image_url: meal.image_url,
      recipe_fetched: meal.recipe_fetched || false,
      ingredients: this.safeParseArray(meal.ingredients, []).map(ing => ({
        name: typeof ing === 'string' ? ing : ing.name || 'Unknown ingredient',
        quantity: typeof ing === 'string' ? '1' : ing.quantity || '1',
        unit: typeof ing === 'string' ? 'piece' : ing.unit || 'piece',
        category: typeof ing === 'object' ? ing.category : undefined
      })),
      instructions: this.safeParseArray(meal.instructions, []).map(inst => 
        typeof inst === 'string' ? inst : String(inst)
      ),
      alternatives: this.safeParseArray(meal.alternatives, []).map(alt => 
        typeof alt === 'string' ? alt : String(alt)
      )
    }));
  }

  private static safeParseArray(value: any, fallback: any[] = []): any[] {
    if (!value) return fallback;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : fallback;
      } catch {
        return fallback;
      }
    }
    return fallback;
  }

  static clearCache(): void {
    this.queryCache.clear();
  }
}
