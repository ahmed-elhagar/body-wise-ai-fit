
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useCoach = () => {
  const { user } = useAuth();

  const { data: trainees = [] } = useQuery({
    queryKey: ['coach-trainees', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('coach_trainees')
        .select(`
          *,
          trainee:profiles!coach_trainees_trainee_id_fkey(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('coach_id', user.id);

      if (error) {
        console.error('Error fetching trainees:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  return { trainees };
};
