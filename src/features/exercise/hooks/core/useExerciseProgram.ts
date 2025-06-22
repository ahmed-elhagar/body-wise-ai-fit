
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ExerciseProgram } from '../../types';
import { format, startOfWeek, addDays } from 'date-fns';

export const useExerciseProgram = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch current exercise program
  const { data: currentProgram, isLoading, error } = useQuery({
    queryKey: ['exercise-program', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('weekly_exercise_programs')
        .select(`
          *,
          daily_workouts:daily_workouts(
            *,
            exercises:exercises(*)
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching exercise program:', error);
        throw error;
      }

      return data as ExerciseProgram | null;
    },
    enabled: !!user?.id,
  });

  // Generate AI Exercise Program
  const generateProgram = useMutation({
    mutationFn: async (preferences: any) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userData: {
            userId: user.id,
            age: preferences.age || 30,
            gender: preferences.gender || 'male',
            fitnessLevel: preferences.fitnessLevel || 'beginner',
            weight: preferences.weight || 70,
            height: preferences.height || 170,
            activityLevel: preferences.activityLevel || 'moderate',
            goals: preferences.goals || ['general_fitness'],
            language: preferences.language || 'en'
          },
          preferences: {
            workoutType: preferences.workoutType || 'home',
            goalType: preferences.goalType || 'general_fitness',
            fitnessLevel: preferences.fitnessLevel || 'beginner',
            availableTime: preferences.availableTime || '30-45 minutes',
            preferredWorkouts: preferences.preferredWorkouts || ['strength', 'cardio'],
            targetMuscleGroups: preferences.targetMuscleGroups || ['full_body'],
            equipment: preferences.equipment || ['bodyweight'],
            duration: preferences.duration || '4 weeks',
            workoutDays: preferences.workoutDays || '3-4 days',
            difficulty: preferences.difficulty || 'beginner',
            weekStartDate: format(startOfWeek(new Date()), 'yyyy-MM-dd')
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
      toast.success('Exercise program generated successfully!');
    },
    onError: (error) => {
      console.error('Error generating program:', error);
      toast.error('Failed to generate exercise program');
    },
  });

  // Update exercise completion
  const updateExerciseCompletion = useMutation({
    mutationFn: async ({ exerciseId, completed }: { exerciseId: string; completed: boolean }) => {
      const { error } = await supabase
        .from('exercises')
        .update({ completed })
        .eq('id', exerciseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
    },
  });

  // Track exercise performance
  const trackPerformance = useMutation({
    mutationFn: async (performanceData: {
      exerciseId: string;
      sets: number;
      reps: string;
      weight?: number;
      notes?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('track-exercise-performance', {
        body: {
          exerciseId: performanceData.exerciseId,
          userId: user.id,
          action: 'progress_updated',
          progressData: {
            sets_completed: performanceData.sets,
            reps_completed: performanceData.reps,
            weight_used: performanceData.weight,
            notes: performanceData.notes
          },
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
      toast.success('Performance tracked successfully!');
    },
    onError: (error) => {
      console.error('Error tracking performance:', error);
      toast.error('Failed to track performance');
    },
  });

  // Get exercise recommendations
  const { data: recommendations } = useQuery({
    queryKey: ['exercise-recommendations', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase.functions.invoke('get-exercise-recommendations', {
        body: { userId: user.id }
      });

      if (error) {
        console.error('Error getting recommendations:', error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  // Exchange exercise
  const exchangeExercise = useMutation({
    mutationFn: async ({ exerciseId, reason }: { exerciseId: string; reason: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('exchange-exercise', {
        body: {
          exerciseId,
          userId: user.id,
          reason
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
      toast.success('Exercise exchanged successfully!');
    },
    onError: (error) => {
      console.error('Error exchanging exercise:', error);
      toast.error('Failed to exchange exercise');
    },
  });

  // Calculate today's exercises
  const todaysExercises = currentProgram?.daily_workouts?.find(
    workout => workout.day_number === new Date().getDay() || 1
  )?.exercises || [];

  const completedExercises = todaysExercises.filter(ex => ex.completed).length;
  const totalExercises = todaysExercises.length;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  return {
    currentProgram,
    isLoading,
    error,
    generateProgram: generateProgram.mutate,
    isGenerating: generateProgram.isPending,
    updateExerciseCompletion: updateExerciseCompletion.mutate,
    trackPerformance: trackPerformance.mutate,
    exchangeExercise: exchangeExercise.mutate,
    recommendations,
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage
  };
};
