
import { supabase } from '@/integrations/supabase/client';
import type { MealPlanFetchResult } from '../types';
import { OptimizedMealPlanService } from './optimizedMealPlanService';

// Legacy service maintained for backward compatibility
export const fetchMealPlanData = async (
  userId: string, 
  weekStartDateStr: string
): Promise<MealPlanFetchResult | null> => {
  console.log('🔍 Legacy fetchMealPlanData called, using optimized service');
  
  try {
    const result = await OptimizedMealPlanService.fetchMealPlanData({
      userId,
      weekStartDate: weekStartDateStr,
      includeIngredients: true,
      includeInstructions: true
    });

    if (result.error) {
      throw result.error;
    }

    if (!result.data) {
      return null;
    }

    // Convert strict types back to legacy types for backward compatibility
    return {
      weeklyPlan: {
        ...result.data.weeklyPlan,
        updated_at: result.data.weeklyPlan.updated_at
      },
      dailyMeals: result.data.dailyMeals.map(meal => ({
        ...meal,
        ingredients: meal.ingredients as any,
        instructions: meal.instructions as any,
        alternatives: meal.alternatives as any
      }))
    };
  } catch (error) {
    console.error('❌ Error in legacy fetchMealPlanData:', error);
    throw error;
  }
};
