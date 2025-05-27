
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useMealPlans = () => {
  const { user } = useAuth();

  const { data: mealPlans, isLoading, error } = useQuery({
    queryKey: ['meal-plans', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
      const { data, error } = await supabase
        .from('weekly_meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return {
    mealPlans,
    isLoading,
    error,
  };
};
