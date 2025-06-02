
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getWeekStartDate } from '@/utils/mealPlanUtils';
import { format } from 'date-fns';
import { fetchMealPlanData } from '../services/mealPlanService';

export const useMealPlanCore = (weekOffset: number = 0) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['weekly-meal-plan', user?.id, weekOffset],
    queryFn: async () => {
      if (!user?.id) {
        console.log('❌ useMealPlanCore - No user ID for meal plan fetch');
        return null;
      }
      
      try {
        const weekStartDate = getWeekStartDate(weekOffset);
        const weekStartDateStr = format(weekStartDate, 'yyyy-MM-dd');
        
        const result = await fetchMealPlanData(user.id, weekStartDateStr);
        return result;
      } catch (error) {
        console.error('❌ Error fetching meal plan:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 30000, // 30 seconds
    gcTime: 120000, // 2 minutes
    retry: (failureCount, error) => {
      if (error?.message?.includes('JWT') || error?.message?.includes('auth')) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true
  });
};
