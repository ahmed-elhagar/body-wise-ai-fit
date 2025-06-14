
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useExercisePrograms = () => {
  const { user } = useAuth();

  const { data: programs, isLoading, error, refetch } = useQuery({
    queryKey: ['exercise-programs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('weekly_exercise_programs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  return {
    programs: programs || [],
    isLoading,
    error,
    refetch
  };
};
