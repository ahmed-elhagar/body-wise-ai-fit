
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useRole } from './useRole';
import { toast } from 'sonner';

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

export interface CoachTraineeRelationship {
  id: string;
  coach_id: string;
  trainee_id: string;
  assigned_at: string;
  notes?: string;
  trainee_profile: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    profile_completion_score?: number;
    ai_generations_remaining?: number;
    age?: number;
    weight?: number;
    height?: number;
    fitness_goal?: string;
  } | null;
}

export const useCoachSystem = () => {
  const { user } = useAuth();
  const { isCoach: isRoleCoach, isAdmin } = useRole();
  const queryClient = useQueryClient();

  // Get coach info for current user (if they are a trainee)
  const { data: coachInfo, isLoading: isLoadingCoachInfo, error: coachInfoError } = useQuery({
    queryKey: ['coach-info', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID found');
        return null;
      }

      console.log('🔍 Fetching coach info for user:', user.id);

      try {
        // First get the coach-trainee relationship
        const { data: relationship, error: relationshipError } = await supabase
          .from('coach_trainees')
          .select('*')
          .eq('trainee_id', user.id)
          .maybeSingle();

        if (relationshipError) {
          console.error('❌ Error fetching coach relationship:', relationshipError);
          throw new Error(`Failed to fetch coach relationship: ${relationshipError.message}`);
        }

        if (!relationship) {
          console.log('📭 No coach assigned to this user');
          return null;
        }

        // Then get the coach profile
        const { data: coachProfile, error: coachProfileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .eq('id', relationship.coach_id)
          .maybeSingle();

        if (coachProfileError) {
          console.error('❌ Error fetching coach profile:', coachProfileError);
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

        console.log('✅ Coach info fetched successfully:', result);
        return result;
      } catch (error) {
        console.error('❌ Error in coach info query:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10, // 10 minutes - longer stale time
    refetchOnWindowFocus: false, // Disable refetch on window focus
    retry: 2, // Reduce retry attempts
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Shorter retry delays
  });

  // Get trainees for current user (if they are a coach)
  const { data: trainees = [], isLoading: isLoadingTrainees, error: traineesError, refetch: refetchTrainees } = useQuery({
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

  // Assign trainee mutation
  const assignTrainee = useMutation({
    mutationFn: async ({ traineeId, notes }: { traineeId: string; notes?: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('coach_trainees')
        .insert({
          coach_id: user.id,
          trainee_id: traineeId,
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainees', user?.id] });
      toast.success('Trainee assigned successfully');
    },
    onError: (error: Error) => {
      console.error('Error assigning trainee:', error);
      toast.error(`Failed to assign trainee: ${error.message}`);
    },
  });

  // Remove trainee mutation
  const removeTrainee = useMutation({
    mutationFn: async (traineeId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('coach_trainees')
        .delete()
        .eq('coach_id', user.id)
        .eq('trainee_id', traineeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainees', user?.id] });
      toast.success('Trainee removed successfully');
    },
    onError: (error: Error) => {
      console.error('Error removing trainee:', error);
      toast.error(`Failed to remove trainee: ${error.message}`);
    },
  });

  // Update trainee notes mutation
  const updateTraineeNotes = useMutation({
    mutationFn: async ({ traineeId, notes }: { traineeId: string; notes: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('coach_trainees')
        .update({ notes })
        .eq('coach_id', user.id)
        .eq('trainee_id', traineeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainees', user?.id] });
      toast.success('Notes updated successfully');
    },
    onError: (error: Error) => {
      console.error('Error updating notes:', error);
      toast.error(`Failed to update notes: ${error.message}`);
    },
  });

  const isCoach = isRoleCoach || isAdmin || trainees.length > 0;

  return {
    // Coach info (for trainees)
    coachInfo,
    isLoadingCoachInfo,
    coachInfoError,
    
    // Trainees (for coaches)
    trainees,
    isLoadingTrainees,
    traineesError,
    refetchTrainees,
    
    // Mutations
    assignTrainee: assignTrainee.mutate,
    removeTrainee: removeTrainee.mutate,
    updateTraineeNotes: updateTraineeNotes.mutate,
    
    // Loading states
    isAssigning: assignTrainee.isPending,
    isRemoving: removeTrainee.isPending,
    isUpdatingNotes: updateTraineeNotes.isPending,
    
    // Status
    isCoach,
    error: coachInfoError || traineesError,
  };
};
