
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

  // Get trainees assigned to the current coach - with better error handling and stability
  const { data: trainees = [], isLoading: isLoadingTrainees, refetch: refetchTrainees, error: traineesError } = useQuery({
    queryKey: ['coach-trainees', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('🚫 No user ID available for fetching trainees');
        return [];
      }

      console.log('🏃‍♂️ Fetching trainees for coach:', user.id);

      try {
        // Get coach-trainee relationships first with more stable query
        const { data: relationships, error: relationshipsError } = await supabase
          .from('coach_trainees')
          .select('*')
          .eq('coach_id', user.id)
          .order('assigned_at', { ascending: false });

        if (relationshipsError) {
          console.error('❌ Error fetching coach-trainee relationships:', relationshipsError);
          // Don't throw error immediately, try to continue with empty data
          console.warn('Continuing with empty relationships due to error');
          return [];
        }

        console.log('📊 Found relationships:', relationships?.length || 0, relationships);

        if (!relationships || relationships.length === 0) {
          console.log('✅ No trainees found for coach');
          return [];
        }

        // Get profile data for each trainee with individual error handling
        const traineeIds = relationships.map(rel => rel.trainee_id);
        console.log('🔍 Looking for profiles for trainee IDs:', traineeIds);
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', traineeIds);

        if (profilesError) {
          console.error('❌ Error fetching trainee profiles:', profilesError);
          // Continue with relationships but no profile data
          console.warn('Continuing without profile data due to error');
        }

        console.log('👤 Found profiles:', profiles?.length || 0, profiles);

        // Combine relationships with profiles - very robust approach
        const transformedData = relationships.map(relationship => {
          const profile = profiles?.find(p => p.id === relationship.trainee_id);
          
          // Create trainee profile with comprehensive fallbacks
          const traineeProfile = {
            id: profile?.id || relationship.trainee_id,
            first_name: profile?.first_name || 'Unknown',
            last_name: profile?.last_name || 'User',
            email: profile?.email || 'unknown@example.com',
            age: profile?.age || undefined,
            weight: profile?.weight || undefined,
            height: profile?.height || undefined,
            fitness_goal: profile?.fitness_goal || 'General Fitness',
            activity_level: profile?.activity_level || 'Moderate',
            profile_completion_score: profile?.profile_completion_score || 0,
            ai_generations_remaining: profile?.ai_generations_remaining || 0,
            assigned_at: relationship.assigned_at,
            notes: relationship.notes || undefined
          };
          
          return {
            id: relationship.id,
            coach_id: relationship.coach_id,
            trainee_id: relationship.trainee_id,
            assigned_at: relationship.assigned_at,
            notes: relationship.notes,
            trainee_profile: traineeProfile
          };
        }) as CoachTraineeRelationship[];

        console.log('✅ Final transformed data:', transformedData.length, transformedData);
        return transformedData;
      } catch (error) {
        console.error('💥 Error in trainee fetch:', error);
        // Return empty array instead of throwing to prevent UI crashes
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 60000, // Increased stale time for better stability
    gcTime: 600000, // Increased garbage collection time
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: (failureCount, error) => {
      console.log('🔄 Retry attempt:', failureCount, 'Error:', error);
      return failureCount < 1; // Reduced retry attempts
    },
  });

  // Check if current user is a coach
  const { data: isCoach = false, error: isCoachError } = useQuery({
    queryKey: ['is-coach', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      console.log('🔍 Checking if user is coach:', user.id);

      try {
        const { data, error } = await supabase.rpc('get_current_user_role');

        if (error) {
          console.error('❌ Error checking coach status via RPC:', error);
          return false;
        }

        const isCoachUser = data === 'coach' || data === 'admin';
        console.log('✅ Coach status:', isCoachUser, 'Role:', data);
        return isCoachUser;
      } catch (error) {
        console.error('💥 Error in coach status check:', error);
        return false;
      }
    },
    enabled: !!user?.id,
    staleTime: 300000, // Cache coach status for 5 minutes
  });

  // Get coach info if user is a trainee
  const { data: coachInfo } = useQuery({
    queryKey: ['trainee-coach', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      try {
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
        const { data: coachProfile, error: coachProfileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', relationship.coach_id)
          .single();

        if (coachProfileError) {
          console.error('Error fetching coach profile:', coachProfileError);
          return {
            id: relationship.id,
            assigned_at: relationship.assigned_at,
            notes: relationship.notes,
            coach_profile: {
              id: relationship.coach_id,
              first_name: 'Unknown',
              last_name: 'Coach',
              email: 'unknown@example.com'
            }
          };
        }

        return {
          id: relationship.id,
          assigned_at: relationship.assigned_at,
          notes: relationship.notes,
          coach_profile: coachProfile
        };
      } catch (error) {
        console.error('Error in coach info fetch:', error);
        return null;
      }
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
      // Only invalidate the specific coach-trainees query
      queryClient.invalidateQueries({ queryKey: ['coach-trainees', user?.id] });
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
      // Only invalidate specific queries
      queryClient.invalidateQueries({ queryKey: ['coach-trainees', user?.id] });
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
      queryClient.invalidateQueries({ queryKey: ['coach-trainees', user?.id] });
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

  // Simplified real-time subscription that doesn't interfere with data
  useEffect(() => {
    if (!user?.id || !isCoach) return;

    console.log('🔄 Setting up stable coach system subscription');

    const channel = supabase
      .channel('coach-system-stable')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'coach_trainees',
          filter: `coach_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('📡 New trainee assigned:', payload);
          // Only invalidate on new assignments
          queryClient.invalidateQueries({ queryKey: ['coach-trainees', user.id] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'coach_trainees',
          filter: `coach_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('📡 Trainee unassigned:', payload);
          // Only invalidate on deletions
          queryClient.invalidateQueries({ queryKey: ['coach-trainees', user.id] });
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
