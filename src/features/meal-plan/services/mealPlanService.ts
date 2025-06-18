
import { supabase } from '@/integrations/supabase/client';
import type { MealPlanFetchResult } from '../types';
import { OptimizedMealPlanService } from './optimizedMealPlanService';

export const fetchMealPlanData = async (
  userId: string, 
  weekStartDateStr: string
): Promise<MealPlanFetchResult | null> => {
  console.log('🔍 Enhanced fetchMealPlanData called:', { userId, weekStartDateStr });
  
  try {
    const result = await OptimizedMealPlanService.fetchMealPlanData({
      userId,
      weekStartDate: weekStartDateStr,
      includeIngredients: true,
      includeInstructions: true
    });

    if (result.error) {
      console.error('❌ OptimizedMealPlanService error:', result.error);
      throw result.error;
    }

    if (!result.data) {
      console.log('📋 No meal plan data found');
      return null;
    }

    // Convert to correct format with weeklyPlan and dailyMeals
    const convertedResult: MealPlanFetchResult = {
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

    console.log('✅ Meal plan data converted successfully:', {
      weeklyPlanId: convertedResult.weeklyPlan.id,
      mealsCount: convertedResult.dailyMeals.length
    });

    return convertedResult;
  } catch (error) {
    console.error('❌ Error in enhanced fetchMealPlanData:', error);
    throw error;
  }
};
