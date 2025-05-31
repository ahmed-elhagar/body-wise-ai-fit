
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useCoach = () => {
  const { user } = useAuth();

  const { data: trainees = [], isLoading } = useQuery({
    queryKey: ['coach-trainees', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('coach_trainees')
        .select(`
          *,
          trainee_profile:profiles!coach_trainees_trainee_id_fkey(
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

  // Also check if user has coach role from useRole hook
  const { data: profile } = useQuery({
    queryKey: ['coach-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  const isCoach = profile?.role === 'coach' || profile?.role === 'admin' || trainees.length > 0;

  return { trainees, isLoading, isCoach };
};
