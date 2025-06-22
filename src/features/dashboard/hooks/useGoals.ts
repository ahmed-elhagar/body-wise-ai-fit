
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useGoals = () => {
  const { data: goals, isLoading } = useQuery({
    queryKey: ['user-goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user goals:', error);
        throw error;
      }

      return data;
    },
  });

  return {
    goals,
    isLoading,
  };
};
