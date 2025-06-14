
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getWeekStartDate } from '@/utils/mealPlanUtils';
import { format } from 'date-fns';
import { MealPlanDataService } from '../services/mealPlanDataService';

interface MealPlanQueryOptions {
  includeIngredients?: boolean;
  includeInstructions?: boolean;
  mealTypes?: ReadonlyArray<string>;
}

export const useMealPlanCore = (
  weekOffset: number = 0,
  options?: MealPlanQueryOptions
) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['meal-plan-core', user?.id, weekOffset, options],
    queryFn: async () => {
      if (!user?.id) {
        console.log('❌ useMealPlanCore - No user ID');
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
        
        const result = await MealPlanDataService.fetchMealPlanData(params);
        
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
        console.error('❌ Error in meal plan core fetch:', error);
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
