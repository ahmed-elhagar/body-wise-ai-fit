
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { MealPlanService } from '../services/mealPlanService';
import type { MealPlanFetchResult } from '../types';

export const useMealPlanCore = (weekOffset: number = 0) => {
  const { user } = useAuth();
  const { language } = useLanguage();

  return useQuery({
    queryKey: ['meal-plan-core', user?.id, weekOffset],
    queryFn: async (): Promise<MealPlanFetchResult | null> => {
      if (!user?.id) {
        console.log('❌ No user ID available for meal plan fetch');
        return null;
      }

      return await MealPlanService.fetchMealPlanData(user.id, weekOffset);
    },
    enabled: !!user?.id,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: (failureCount, error) => {
      if (error?.message?.includes('JWT') || error?.message?.includes('auth')) return false;
      return failureCount < 2;
    }
  });
};
