import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRole } from '@/shared/hooks/useRole';
import type { CoachTraineeRelationship } from './types';

export const useTrainees = () => {
  const { user } = useAuth();
  const { isCoach: isRoleCoach, isAdmin } = useRole();

  return useQuery({
    queryKey: ['coach-trainees', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      console.log('🔍 Fetching trainees for coach:', user.id);

      try {
        // First get coach-trainee relationships
        const { data: relationships, error: relationshipError } = await supabase
          .from('coach_trainees')
          .select('*')
          .eq('coach_id', user.id);

        if (relationshipError) {
          console.error('❌ Error fetching trainee relationships:', relationshipError);
          throw new Error(`Failed to fetch trainee relationships: ${relationshipError.message}`);
        }

        if (!relationships || relationships.length === 0) {
          console.log('📭 No trainees found for this coach');
          return [];
        }

        // Then get trainee profiles for each relationship
        const result: CoachTraineeRelationship[] = [];
        
        for (const relationship of relationships) {
          const { data: traineeProfile, error: traineeProfileError } = await supabase
            .from('profiles')
            .select(`
              id,
              first_name,
              last_name,
              email,
              profile_completion_score,
              ai_generations_remaining,
              age,
              weight,
              height,
              fitness_goal
            `)
            .eq('id', relationship.trainee_id)
            .maybeSingle();

          if (traineeProfileError) {
            console.error('❌ Error fetching trainee profile:', traineeProfileError);
            // Continue with null profile rather than failing
          }

          result.push({
            id: relationship.id,
            coach_id: relationship.coach_id,
            trainee_id: relationship.trainee_id,
            assigned_at: relationship.assigned_at,
            notes: relationship.notes,
            trainee_profile: traineeProfile || null
          });
        }

        console.log('✅ Trainees fetched successfully:', result);
        return result;
      } catch (error) {
        console.error('❌ Error in trainees query:', error);
        throw error;
      }
    },
    enabled: !!user?.id && (isRoleCoach || isAdmin),
    staleTime: 1000 * 60 * 10, // 10 minutes - longer stale time
    refetchOnWindowFocus: false, // Disable refetch on window focus
    retry: 2, // Reduce retry attempts
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Shorter retry delays
  });
};
