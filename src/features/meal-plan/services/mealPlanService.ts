
import { supabase } from '@/integrations/supabase/client';
import type { MealPlanFetchResult } from '../types';
import { OptimizedMealPlanService } from './optimizedMealPlanService';

// Enhanced service with proper error handling and data validation
export const fetchMealPlanData = async (
  userId: string, 
  weekStartDateStr: string
): Promise<MealPlanFetchResult | null> => {
  console.log('🔍 Enhanced fetchMealPlanData called:', { userId, weekStartDateStr });
  
  try {
    const weekStartDate = new Date(weekStartDateStr);
    const result = await OptimizedMealPlanService.fetchMealPlanData(userId, weekStartDate);

    if (!result) {
      console.log('📋 No meal plan data found');
      return null;
    }

    console.log('✅ Meal plan data fetched successfully:', {
      weeklyPlanId: result.weeklyPlan.id,
      mealsCount: result.dailyMeals.length
    });

    return result;
  } catch (error) {
    console.error('❌ Error in enhanced fetchMealPlanData:', error);
    throw error;
  }
};
