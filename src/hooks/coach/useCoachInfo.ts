
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import { useRole } from '../useRole';
import type { CoachInfo, MultipleCoachesInfo } from './types';

export const useCoachInfo = () => {
  const { user } = useAuth();
  const { isCoach: isRoleCoach, isAdmin } = useRole();

  return useQuery({
    queryKey: ['coach-info', user?.id],
    queryFn: async (): Promise<MultipleCoachesInfo | null> => {
      if (!user?.id) {
        console.log('❌ useCoachInfo: No user ID found');
        return null;
      }

      console.log('🔍 useCoachInfo: Fetching coach info for user:', user.id);
      console.log('🔍 useCoachInfo: User role check - isRoleCoach:', isRoleCoach, 'isAdmin:', isAdmin);

      try {
        // Get all coach-trainee relationships for this user as a trainee
        console.log('🔍 useCoachInfo: Querying coach_trainees table...');
        const { data: relationships, error: relationshipError } = await supabase
          .from('coach_trainees')
          .select('*')
          .eq('trainee_id', user.id)
          .order('assigned_at', { ascending: false });

        console.log('🔍 useCoachInfo: Relationship query result:', { relationships, relationshipError });

        if (relationshipError) {
          console.error('❌ useCoachInfo: Error fetching coach relationships:', relationshipError);
          throw new Error(`Failed to fetch coach relationships: ${relationshipError.message}`);
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
            .single();

          console.log('🔍 useCoachInfo: Coach profile query result:', { coachProfile, coachProfileError });

          if (coachProfileError) {
            console.error('❌ useCoachInfo: Error fetching coach profile:', coachProfileError);
            // Continue with null profile rather than failing
          }

          coaches.push({
            id: relationship.id,
            coach_id: relationship.coach_id,
            trainee_id: relationship.trainee_id,
            assigned_at: relationship.assigned_at,
            notes: relationship.notes,
            coach_profile: coachProfile || null
          });
        }

        // Get unread messages count for each coach
        const unreadMessagesByCoach: Record<string, number> = {};
        let totalUnreadMessages = 0;

        for (const coach of coaches) {
          const { count, error: unreadError } = await supabase
            .from('coach_trainee_messages')
            .select('*', { count: 'exact', head: true })
            .eq('trainee_id', user.id)
            .eq('coach_id', coach.coach_id)
            .eq('is_read', false)
            .eq('sender_type', 'coach')
            .neq('sender_id', user.id);

          if (!unreadError && count) {
            unreadMessagesByCoach[coach.coach_id] = count;
            totalUnreadMessages += count;
          }
        }

        const result: MultipleCoachesInfo = {
          coaches,
          totalUnreadMessages,
          unreadMessagesByCoach
        };

        console.log('✅ useCoachInfo: Multiple coaches info fetched successfully:', result);
        return result;
      } catch (error) {
        console.error('❌ useCoachInfo: Error in coach info query:', error);
        throw error;
      }
    },
    enabled: !!user?.id, // Always enabled if user exists, regardless of role
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      console.log('🔄 useCoachInfo: Retry attempt:', failureCount, 'Error:', error);
      return failureCount < 3; // Retry up to 3 times
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
};
