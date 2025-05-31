
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
      if (!user?.id) return null;

      console.log('🔍 Fetching coach info for user:', user.id);

      const { data, error } = await supabase
        .from('coach_trainees')
        .select(`
          id,
          coach_id,
          trainee_id,
          assigned_at,
          notes,
          profiles!coach_trainees_coach_id_fkey(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('trainee_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching coach info:', error);
        throw error;
      }

      if (data) {
        const coachProfile = data.profiles as any;
        const result: CoachInfo = {
          id: data.id,
          coach_id: data.coach_id,
          trainee_id: data.trainee_id,
          assigned_at: data.assigned_at,
          notes: data.notes,
          coach_profile: coachProfile ? {
            id: coachProfile.id,
            first_name: coachProfile.first_name,
            last_name: coachProfile.last_name,
            email: coachProfile.email
          } : null
        };
        console.log('✅ Coach info fetched:', result);
        return result;
      }

      return null;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 30, // 30 seconds
  });

  // Get trainees for current user (if they are a coach)
  const { data: trainees = [], isLoading: isLoadingTrainees, error: traineesError, refetch: refetchTrainees } = useQuery({
    queryKey: ['coach-trainees', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      console.log('🔍 Fetching trainees for coach:', user.id);

      const { data, error } = await supabase
        .from('coach_trainees')
        .select(`
          id,
          coach_id,
          trainee_id,
          assigned_at,
          notes,
          profiles!coach_trainees_trainee_id_fkey(
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
          )
        `)
        .eq('coach_id', user.id);

      if (error) {
        console.error('❌ Error fetching trainees:', error);
        throw error;
      }

      console.log('✅ Trainees fetched:', data);
      
      const result: CoachTraineeRelationship[] = (data || []).map(item => {
        const traineeProfile = item.profiles as any;
        return {
          id: item.id,
          coach_id: item.coach_id,
          trainee_id: item.trainee_id,
          assigned_at: item.assigned_at,
          notes: item.notes,
          trainee_profile: traineeProfile ? {
            id: traineeProfile.id,
            first_name: traineeProfile.first_name,
            last_name: traineeProfile.last_name,
            email: traineeProfile.email,
            profile_completion_score: traineeProfile.profile_completion_score,
            ai_generations_remaining: traineeProfile.ai_generations_remaining,
            age: traineeProfile.age,
            weight: traineeProfile.weight,
            height: traineeProfile.height,
            fitness_goal: traineeProfile.fitness_goal
          } : null
        };
      });

      return result;
    },
    enabled: !!user?.id && (isRoleCoach || isAdmin),
    staleTime: 1000 * 60 * 5, // 5 minutes
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
