
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import { useRole } from '../useRole';
import type { CoachInfo } from './types';

export const useCoachInfo = () => {
  const { user } = useAuth();
  const { isCoach: isRoleCoach, isAdmin } = useRole();

  return useQuery({
    queryKey: ['coach-info', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('❌ useCoachInfo: No user ID found');
        return null;
      }

      console.log('🔍 useCoachInfo: Fetching coach info for user:', user.id);
      console.log('🔍 useCoachInfo: User role check - isRoleCoach:', isRoleCoach, 'isAdmin:', isAdmin);

      try {
        // First get the coach-trainee relationships (using select() instead of maybeSingle())
        console.log('🔍 useCoachInfo: Querying coach_trainees table...');
        const { data: relationships, error: relationshipError } = await supabase
          .from('coach_trainees')
          .select('*')
          .eq('trainee_id', user.id)
          .order('assigned_at', { ascending: false }); // Get most recent assignment first

        console.log('🔍 useCoachInfo: Relationship query result:', { relationships, relationshipError });

        if (relationshipError) {
          console.error('❌ useCoachInfo: Error fetching coach relationship:', relationshipError);
          throw new Error(`Failed to fetch coach relationship: ${relationshipError.message}`);
        }

        if (!relationships || relationships.length === 0) {
          console.log('📭 useCoachInfo: No coach assigned to this user');
          return null;
        }

        // Take the most recent relationship (first one due to ordering)
        const relationship = relationships[0];
        
        if (relationships.length > 1) {
          console.warn('⚠️ useCoachInfo: Multiple coach relationships found, using most recent:', relationship);
        }

        console.log('✅ useCoachInfo: Found coach relationship:', relationship);

        // Then get the coach profile
        console.log('🔍 useCoachInfo: Fetching coach profile for coach_id:', relationship.coach_id);
        const { data: coachProfile, error: coachProfileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .eq('id', relationship.coach_id)
          .single();

        console.log('🔍 useCoachInfo: Coach profile query result:', { coachProfile, coachProfileError });

        if (coachProfileError) {
          console.error('❌ useCoachInfo: Error fetching coach profile:', coachProfileError);
          // Don't throw here, just log and continue with null profile
        }

        const result: CoachInfo = {
          id: relationship.id,
          coach_id: relationship.coach_id,
          trainee_id: relationship.trainee_id,
          assigned_at: relationship.assigned_at,
          notes: relationship.notes,
          coach_profile: coachProfile || null
        };

        console.log('✅ useCoachInfo: Coach info fetched successfully:', result);
        return result;
      } catch (error) {
        console.error('❌ useCoachInfo: Error in coach info query:', error);
        throw error;
      }
    },
    enabled: !!user?.id && !isRoleCoach && !isAdmin, // Only fetch for regular users
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      console.log('🔄 useCoachInfo: Retry attempt:', failureCount, 'Error:', error);
      return failureCount < 3; // Retry up to 3 times
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
};
