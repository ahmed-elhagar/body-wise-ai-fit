
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth';

export interface CoachProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface CoachInfo {
  id: string;
  coach_id: string;
  trainee_id: string;
  assigned_at: string;
  notes?: string;
  coach_profile: CoachProfile | null;
}

export interface MultipleCoachesInfo {
  coaches: CoachInfo[];
  totalUnreadMessages: number;
  unreadMessagesByCoach: Record<string, number>;
}

export const useCoachInfo = () => {
  const { user } = useAuth();
  const traineeId = user?.id || '';

  return useQuery({
    queryKey: ['coach-info', traineeId],
    queryFn: async (): Promise<MultipleCoachesInfo | null> => {
      if (!traineeId) {
        return null;
      }

      console.log('🔍 useCoachInfo: Starting coach info fetch for trainee:', traineeId);

      try {
        // Get all coach-trainee relationships for this user as a trainee
        const { data: relationships, error: relationshipError } = await supabase
          .from('coach_trainees')
          .select(`
            id,
            coach_id,
            trainee_id,
            assigned_at,
            notes
          `)
          .eq('trainee_id', traineeId)
          .order('assigned_at', { ascending: false });

        if (relationshipError) {
          console.error('❌ useCoachInfo: Error fetching coach relationships:', relationshipError);
          throw relationshipError;
        }

        if (!relationships || relationships.length === 0) {
          console.log('📭 useCoachInfo: No coaches assigned to this user');
          return {
            coaches: [],
            totalUnreadMessages: 0,
            unreadMessagesByCoach: {}
          };
        }

        console.log('✅ useCoachInfo: Found coach relationships:', relationships.length);

        // Get coach profiles for all relationships
        const coaches: CoachInfo[] = [];
        for (const relationship of relationships) {
          console.log('🔍 useCoachInfo: Fetching coach profile for coach_id:', relationship.coach_id);
          
          const { data: coachProfile, error: coachProfileError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email')
            .eq('id', relationship.coach_id)
            .maybeSingle();

          if (coachProfileError) {
            console.error('❌ useCoachInfo: Error fetching coach profile:', coachProfileError);
          }

          coaches.push({
            id: relationship.id,
            coach_id: relationship.coach_id,
            trainee_id: relationship.trainee_id,
            assigned_at: relationship.assigned_at,
            notes: relationship.notes || '',
            coach_profile: coachProfile || null
          });
        }

        // Get unread messages count for each coach
        const unreadMessagesByCoach: Record<string, number> = {};
        let totalUnreadMessages = 0;

        for (const coach of coaches) {
          console.log('🔍 useCoachInfo: Checking unread messages for coach:', coach.coach_id);
          
          const { count, error: unreadError } = await supabase
            .from('coach_trainee_messages')
            .select('*', { count: 'exact', head: true })
            .eq('trainee_id', traineeId)
            .eq('coach_id', coach.coach_id)
            .eq('is_read', false)
            .eq('sender_type', 'coach');

          if (!unreadError && count !== null) {
            unreadMessagesByCoach[coach.coach_id] = count;
            totalUnreadMessages += count;
          } else if (unreadError) {
            console.error('❌ useCoachInfo: Error counting unread messages:', unreadError);
          }
        }

        const result: MultipleCoachesInfo = {
          coaches,
          totalUnreadMessages,
          unreadMessagesByCoach
        };

        console.log('✅ useCoachInfo: Final result:', result);
        return result;
      } catch (error) {
        console.error('❌ useCoachInfo: Error in coach info query:', error);
        throw error;
      }
    },
    enabled: !!traineeId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      console.log('🔄 useCoachInfo: Retry attempt:', failureCount, 'Error:', error);
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
  });
};
