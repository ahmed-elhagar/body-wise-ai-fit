
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { useEffect } from 'react';

export interface TraineeProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  age?: number;
  weight?: number;
  height?: number;
  fitness_goal?: string;
  activity_level?: string;
  profile_completion_score?: number;
  ai_generations_remaining?: number;
  assigned_at: string;
  notes?: string;
}

export interface CoachTraineeRelationship {
  id: string;
  coach_id: string;
  trainee_id: string;
  assigned_at: string;
  notes?: string;
  trainee_profile: TraineeProfile;
}

export const useCoachSystem = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const queryClient = useQueryClient();

  // Get trainees assigned to the current coach
  const { data: trainees = [], isLoading: isLoadingTrainees, refetch: refetchTrainees, error: traineesError } = useQuery({
    queryKey: ['coach-trainees', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('🚫 No user ID available for fetching trainees');
        return [];
      }

      console.log('🏃‍♂️ Fetching trainees for coach:', user.id);

      try {
        // First get coach-trainee relationships
        const { data: relationships, error: relationshipsError } = await supabase
          .from('coach_trainees')
          .select('*')
          .eq('coach_id', user.id)
          .order('assigned_at', { ascending: false });

        if (relationshipsError) {
          console.error('❌ Error fetching coach-trainee relationships:', relationshipsError);
          throw relationshipsError;
        }

        if (!relationships || relationships.length === 0) {
          console.log('✅ No trainees found for coach');
          return [];
        }

        console.log('📊 Found relationships:', relationships.length);

        // Get trainee profile data separately
        const traineeIds = relationships.map(rel => rel.trainee_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, age, weight, height, fitness_goal, activity_level, profile_completion_score, ai_generations_remaining')
          .in('id', traineeIds);

        if (profilesError) {
          console.error('❌ Error fetching trainee profiles:', profilesError);
          throw profilesError;
        }

        console.log('👥 Found profiles:', profiles?.length || 0);

        // Combine relationships with profiles
        const combinedData = relationships.map(relationship => {
          const profile = profiles?.find(p => p.id === relationship.trainee_id);
          return {
            id: relationship.id,
            coach_id: relationship.coach_id,
            trainee_id: relationship.trainee_id,
            assigned_at: relationship.assigned_at,
            notes: relationship.notes,
            trainee_profile: {
              id: profile?.id || relationship.trainee_id,
              first_name: profile?.first_name || 'Unknown',
              last_name: profile?.last_name || 'User',
              email: profile?.email || 'unknown@example.com',
              age: profile?.age,
              weight: profile?.weight,
              height: profile?.height,
              fitness_goal: profile?.fitness_goal,
              activity_level: profile?.activity_level,
              profile_completion_score: profile?.profile_completion_score,
              ai_generations_remaining: profile?.ai_generations_remaining,
              assigned_at: relationship.assigned_at,
              notes: relationship.notes
            }
          };
        }) as CoachTraineeRelationship[];

        console.log('✅ Trainees processed successfully:', combinedData.length);
        return combinedData;
      } catch (error) {
        console.error('💥 Error in trainee fetch:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 30000,
    retry: (failureCount, error) => {
      console.log('🔄 Retry attempt:', failureCount, 'Error:', error);
      return failureCount < 2;
    },
  });

  // Check if current user is a coach
  const { data: isCoach = false, error: isCoachError } = useQuery({
    queryKey: ['is-coach', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      console.log('🔍 Checking if user is coach:', user.id);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('❌ Error checking coach status:', error);
        return false;
      }

      const isCoachUser = profile?.role === 'coach' || profile?.role === 'admin';
      console.log('✅ Coach status:', isCoachUser, 'Role:', profile?.role);
      return isCoachUser;
    },
    enabled: !!user?.id,
    staleTime: 60000,
  });

  // Log errors
  useEffect(() => {
    if (traineesError) {
      console.error('🚨 Trainees fetch error:', traineesError);
      toast.error('Failed to load trainees. Please refresh the page.');
    }
    if (isCoachError) {
      console.error('🚨 Coach status check error:', isCoachError);
    }
  }, [traineesError, isCoachError]);

  // Get coach info if user is a trainee
  const { data: coachInfo } = useQuery({
    queryKey: ['trainee-coach', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Get coach-trainee relationship
      const { data: relationship, error: relationshipError } = await supabase
        .from('coach_trainees')
        .select('*')
        .eq('trainee_id', user.id)
        .single();

      if (relationshipError && relationshipError.code !== 'PGRST116') {
        console.error('Error fetching coach relationship:', relationshipError);
        return null;
      }

      if (!relationship) return null;

      // Get coach profile separately
      const { data: coachProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('id', relationship.coach_id)
        .single();

      if (profileError) {
        console.error('Error fetching coach profile:', profileError);
        return null;
      }

      return {
        id: relationship.id,
        assigned_at: relationship.assigned_at,
        notes: relationship.notes,
        coach_profile: coachProfile
      };
    },
    enabled: !!user?.id,
  });

  // Assign trainee to coach
  const assignTrainee = useMutation({
    mutationFn: async ({ traineeEmail, notes }: { traineeEmail: string; notes?: string }) => {
      if (!user?.id) throw new Error('Coach not authenticated');

      console.log('🎯 Assigning trainee:', traineeEmail);

      // First, find the trainee by email
      const { data: traineeProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('email', traineeEmail.toLowerCase().trim())
        .single();

      if (profileError || !traineeProfile) {
        throw new Error('Trainee not found with this email address');
      }

      // Check if already assigned
      const { data: existing } = await supabase
        .from('coach_trainees')
        .select('id')
        .eq('coach_id', user.id)
        .eq('trainee_id', traineeProfile.id)
        .single();

      if (existing) {
        throw new Error('Trainee is already assigned to you');
      }

      // Create the assignment
      const { data, error } = await supabase
        .from('coach_trainees')
        .insert({
          coach_id: user.id,
          trainee_id: traineeProfile.id,
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainees'] });
      toast.success(language === 'ar' ? 
        'تم تعيين المتدرب بنجاح!' : 
        'Trainee assigned successfully!'
      );
    },
    onError: (error: Error) => {
      console.error('Error assigning trainee:', error);
      toast.error(language === 'ar' ? 
        `فشل في تعيين المتدرب: ${error.message}` :
        `Failed to assign trainee: ${error.message}`
      );
    },
  });

  // Remove trainee from coach
  const removeTrainee = useMutation({
    mutationFn: async (relationshipId: string) => {
      const { error } = await supabase
        .from('coach_trainees')
        .delete()
        .eq('id', relationshipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainees'] });
      toast.success(language === 'ar' ? 
        'تم إلغاء تعيين المتدرب!' : 
        'Trainee unassigned successfully!'
      );
    },
    onError: (error: Error) => {
      console.error('Error removing trainee:', error);
      toast.error(language === 'ar' ? 
        'فشل في إلغاء تعيين المتدرب' : 
        'Failed to remove trainee'
      );
    },
  });

  // Update trainee notes
  const updateTraineeNotes = useMutation({
    mutationFn: async ({ relationshipId, notes }: { relationshipId: string; notes: string }) => {
      const { error } = await supabase
        .from('coach_trainees')
        .update({ notes })
        .eq('id', relationshipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainees'] });
      toast.success(language === 'ar' ? 
        'تم تحديث الملاحظات!' : 
        'Notes updated successfully!'
      );
    },
    onError: (error: Error) => {
      console.error('Error updating notes:', error);
      toast.error(language === 'ar' ? 
        'فشل في تحديث الملاحظات' : 
        'Failed to update notes'
      );
    },
  });

  // Real-time subscription for coach-trainee updates
  useEffect(() => {
    if (!user?.id || !isCoach) return;

    console.log('🔄 Setting up real-time coach system subscription');

    const channel = supabase
      .channel('coach-system-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coach_trainees',
          filter: `coach_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('📡 Real-time coach system update:', payload);
          queryClient.invalidateQueries({ queryKey: ['coach-trainees'] });
        }
      )
      .subscribe();

    return () => {
      console.log('🔌 Cleaning up coach system subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id, isCoach, queryClient]);

  return {
    trainees,
    isLoadingTrainees,
    isCoach,
    coachInfo,
    assignTrainee: assignTrainee.mutate,
    removeTrainee: removeTrainee.mutate,
    updateTraineeNotes: updateTraineeNotes.mutate,
    isAssigning: assignTrainee.isPending,
    isRemoving: removeTrainee.isPending,
    isUpdatingNotes: updateTraineeNotes.isPending,
    refetchTrainees,
    error: traineesError,
  };
};
