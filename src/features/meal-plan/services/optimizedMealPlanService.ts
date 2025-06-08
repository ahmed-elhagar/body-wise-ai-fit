
import { supabase } from '@/integrations/supabase/client';
import type { 
  MealPlanFetchResult, 
  DailyMeal,
  WeeklyMealPlan,
  MealIngredient
} from '../types';

// Simplified types for optimization
interface OptimizedQueryParams {
  userId: string;
  weekStartDate: string;
  includeIngredients?: boolean;
  includeInstructions?: boolean;
  mealTypes?: ReadonlyArray<string>;
}

interface DatabaseQueryResult<T> {
  data: T | null;
  error: Error | null;
  fromCache: boolean;
  queryTime: number;
}

// Optimized database service with enhanced error handling and validation
export class OptimizedMealPlanService {
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private static queryCache = new Map<string, { data: unknown; timestamp: number }>();

  static async fetchMealPlanData(
    params: OptimizedQueryParams
  ): Promise<DatabaseQueryResult<MealPlanFetchResult>> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(params);
    
    console.log('🔍 OptimizedMealPlanService.fetchMealPlanData called:', {
      userId: params.userId.substring(0, 8) + '...',
      weekStartDate: params.weekStartDate,
      cacheKey
    });
    
    // Check cache first
    const cached = this.getFromCache<MealPlanFetchResult>(cacheKey);
    if (cached) {
      console.log('📦 Returning cached data for:', cacheKey);
      return {
        data: cached,
        error: null,
        fromCache: true,
        queryTime: Date.now() - startTime
      };
    }

    try {
      // Optimized weekly plan query with enhanced error handling
      console.log('🔍 Fetching weekly meal plan...');
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
        console.log('📋 No weekly meal plan found for:', {
          userId: params.userId.substring(0, 8) + '...',
          weekStartDate: params.weekStartDate
        });
        return {
          data: null,
          error: null,
          fromCache: false,
          queryTime: Date.now() - startTime
        };
      }

      console.log('✅ Weekly plan found:', weeklyPlan.id);

      // Optimized daily meals query with selective fields and validation
      const selectFields = this.buildSelectFields(params);
      console.log('🔍 Fetching daily meals with fields:', selectFields);
      
      const dailyMealsQuery = supabase
        .from('daily_meals')
        .select(selectFields)
        .eq('weekly_plan_id', weeklyPlan.id)
        .order('day_number', { ascending: true });

      // Add meal type filter if specified
      if (params.mealTypes && params.mealTypes.length > 0) {
        dailyMealsQuery.in('meal_type', params.mealTypes);
        console.log('🔍 Filtering by meal types:', params.mealTypes);
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

      console.log('✅ Daily meals fetched:', {
        count: dailyMeals?.length || 0,
        weeklyPlanId: weeklyPlan.id
      });

      const result: MealPlanFetchResult = {
        weeklyPlan: this.processWeeklyPlan(weeklyPlan),
        dailyMeals: this.processDailyMeals(dailyMeals || [])
      };

      // Cache the result
      this.setCache(cacheKey, result);

      console.log('✅ Optimized meal plan data processed successfully:', {
        weeklyPlanId: weeklyPlan.id,
        dailyMealsCount: dailyMeals?.length || 0,
        queryTime: Date.now() - startTime,
        cached: false
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
    const key = `meal_plan_${params.userId}_${params.weekStartDate}_${JSON.stringify(params.mealTypes || [])}`;
    return key;
  }

  private static getFromCache<T>(key: string): T | null {
    try {
      const cached = this.queryCache.get(key);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.data as T;
      }
      this.queryCache.delete(key);
      return null;
    } catch (error) {
      console.error('❌ Cache retrieval error:', error);
      return null;
    }
  }

  private static setCache<T>(key: string, data: T): void {
    try {
      this.queryCache.set(key, { data, timestamp: Date.now() });
    } catch (error) {
      console.error('❌ Cache storage error:', error);
    }
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

  private static processWeeklyPlan(plan: any): WeeklyMealPlan {
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

  private static processDailyMeals(meals: any[]): DailyMeal[] {
    return meals.map((meal, index) => {
      try {
        const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'snack1', 'snack2'];
        const validatedMealType = validMealTypes.includes(meal.meal_type) ? meal.meal_type : 'snack';
        
        console.log(`🍽️ Processing meal ${index + 1}: ${meal.name} (${meal.meal_type} -> ${validatedMealType})`);
        
        return {
          id: meal.id,
          weekly_plan_id: meal.weekly_plan_id,
          day_number: meal.day_number,
          meal_type: validatedMealType as DailyMeal['meal_type'],
          name: meal.name,
          calories: meal.calories || 0,
          protein: meal.protein || 0,
          carbs: meal.carbs || 0,
          fat: meal.fat || 0,
          fiber: 0,
          sugar: 0,
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
        };
      } catch (error) {
        console.error(`❌ Error processing meal ${index + 1}:`, error, meal);
        throw error;
      }
    });
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
    console.log('🧹 Meal plan cache cleared');
  }

  static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.queryCache.size,
      keys: Array.from(this.queryCache.keys())
    };
  }
}
