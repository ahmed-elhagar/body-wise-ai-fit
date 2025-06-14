
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useTraineeData = (traineeId: string) => {
  const { user } = useAuth();

  // Get trainee's meal plans
  const { data: mealPlans = [], isLoading: isLoadingMealPlans } = useQuery({
    queryKey: ['trainee-meal-plans', traineeId],
    queryFn: async () => {
      if (!traineeId || !user?.id) return [];

      // Verify coach access
      const { data: relationship } = await supabase
        .from('coach_trainees')
        .select('id')
        .eq('coach_id', user.id)
        .eq('trainee_id', traineeId)
        .single();

      if (!relationship) {
        throw new Error('Access denied: Not authorized to view this trainee');
      }

      const { data, error } = await supabase
        .from('weekly_meal_plans')
        .select('*')
        .eq('user_id', traineeId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!traineeId && !!user?.id,
  });

  // Get trainee's exercise programs
  const { data: exercisePrograms = [], isLoading: isLoadingExercisePrograms } = useQuery({
    queryKey: ['trainee-exercise-programs', traineeId],
    queryFn: async () => {
      if (!traineeId || !user?.id) return [];

      // Verify coach access
      const { data: relationship } = await supabase
        .from('coach_trainees')
        .select('id')
        .eq('coach_id', user.id)
        .eq('trainee_id', traineeId)
        .single();

      if (!relationship) {
        throw new Error('Access denied: Not authorized to view this trainee');
      }

      const { data, error } = await supabase
        .from('weekly_exercise_programs')
        .select('*')
        .eq('user_id', traineeId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!traineeId && !!user?.id,
  });

  // Get trainee's weight entries
  const { data: weightEntries = [], isLoading: isLoadingWeightEntries } = useQuery({
    queryKey: ['trainee-weight-entries', traineeId],
    queryFn: async () => {
      if (!traineeId || !user?.id) return [];

      // Verify coach access
      const { data: relationship } = await supabase
        .from('coach_trainees')
        .select('id')
        .eq('coach_id', user.id)
        .eq('trainee_id', traineeId)
        .single();

      if (!relationship) {
        throw new Error('Access denied: Not authorized to view this trainee');
      }

      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', traineeId)
        .order('recorded_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!traineeId && !!user?.id,
  });

  // Get trainee's goals
  const { data: goals = [], isLoading: isLoadingGoals } = useQuery({
    queryKey: ['trainee-goals', traineeId],
    queryFn: async () => {
      if (!traineeId || !user?.id) return [];

      // Verify coach access
      const { data: relationship } = await supabase
        .from('coach_trainees')
        .select('id')
        .eq('coach_id', user.id)
        .eq('trainee_id', traineeId)
        .single();

      if (!relationship) {
        throw new Error('Access denied: Not authorized to view this trainee');
      }

      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', traineeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!traineeId && !!user?.id,
  });

  return {
    mealPlans,
    exercisePrograms,
    weightEntries,
    goals,
    isLoadingMealPlans,
    isLoadingExercisePrograms,
    isLoadingWeightEntries,
    isLoadingGoals,
    isLoading: isLoadingMealPlans || isLoadingExercisePrograms || isLoadingWeightEntries || isLoadingGoals,
  };
};
