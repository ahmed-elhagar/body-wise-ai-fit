
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth';

export interface CoachInfo {
  id: string;
  coach_id: string;
  trainee_id: string;
  assigned_at: string;
  notes?: string;
  coach_profile?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null;
}

export interface MultipleCoachesInfo {
  coaches: CoachInfo[];
  totalUnreadMessages: number;
  unreadMessagesByCoach: Record<string, number>;
}

export const useCoachInfo = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['coach-info', user?.id],
    queryFn: async (): Promise<MultipleCoachesInfo> => {
      if (!user?.id) {
        return {
          coaches: [],
          totalUnreadMessages: 0,
          unreadMessagesByCoach: {}
        };
      }

      const { data, error } = await supabase
        .from('coach_trainees')
        .select(`
          *,
          coach_profile:profiles!coach_id(*)
        `)
        .eq('trainee_id', user.id);

      if (error) throw error;

      const coaches = data || [];
      
      return {
        coaches,
        totalUnreadMessages: 0,
        unreadMessagesByCoach: {}
      };
    },
    enabled: !!user?.id,
  });
};
