import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getWeekStartDate } from '@/utils/mealPlanUtils';
import { format } from 'date-fns';
import { OptimizedMealPlanService } from '../services/optimizedMealPlanService';
import { useMemo } from 'react';
import { useMealPlanData } from './useMealPlanData';
import { getCurrentWeekDates } from '../utils/mealPlanUtils';
import type { WeeklyMealPlan, DailyMeal } from '../types';

interface OptimizedQueryOptions {
  includeIngredients?: boolean;
  includeInstructions?: boolean;
  mealTypes?: ReadonlyArray<string>;
}

export const useOptimizedMealPlanCore = (
  weekOffset: number = 0,
  options?: OptimizedQueryOptions
) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['optimized-meal-plan', user?.id, weekOffset, options],
    queryFn: async () => {
      if (!user?.id) {
        console.log('❌ useOptimizedMealPlanCore - No user ID');
        return null;
      }
      
      try {
        const weekStartDate = getWeekStartDate(weekOffset);
        const weekStartDateStr = format(weekStartDate, 'yyyy-MM-dd');
        
        const params = {
          userId: user.id,
          weekStartDate: weekStartDateStr,
          includeIngredients: options?.includeIngredients,
          includeInstructions: options?.includeInstructions,
          mealTypes: options?.mealTypes
        };
        
        const result = await OptimizedMealPlanService.fetchMealPlanData(params);
        
        if (result.error) {
          throw result.error;
        }
        
        console.log('📊 Query performance:', {
          fromCache: result.fromCache,
          queryTime: result.queryTime,
          weekOffset
        });
        
        return result.data;
      } catch (error) {
        console.error('❌ Error in optimized meal plan fetch:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error?.message?.includes('JWT') || error?.message?.includes('auth')) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Rely more on cache
    refetchOnReconnect: true
  });
};
