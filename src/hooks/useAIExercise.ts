
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export const useAIExercise = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const generateExerciseProgram = useMutation({
    mutationFn: async (preferences: any) => {
      if (!user?.id || !profile) throw new Error('User not authenticated or profile incomplete');

      // Check if user has generations remaining
      const canGenerate = await supabase.rpc('decrement_ai_generations', {
        user_id: user.id
      });

      if (!canGenerate.data) {
        throw new Error('You have reached your AI generation limit. Please contact admin to increase your limit.');
      }

      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userProfile: profile,
          preferences
        }
      });

      if (error) throw error;

      // Save to database
      const weekStartDate = new Date();
      weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
      
      const { data: weeklyProgram, error: weeklyError } = await supabase
        .from('weekly_exercise_programs')
        .upsert({
          user_id: user.id,
          week_start_date: weekStartDate.toISOString().split('T')[0],
          program_name: data.generatedProgram.name,
          difficulty_level: preferences.difficulty,
          generation_prompt: preferences,
          total_estimated_calories: data.generatedProgram.totalCalories || 0
        })
        .select()
        .single();

      if (weeklyError) throw weeklyError;

      // Save daily workouts and exercises
      for (const [dayIndex, workout] of data.generatedProgram.workouts.entries()) {
        const { data: dailyWorkout, error: workoutError } = await supabase
          .from('daily_workouts')
          .upsert({
            weekly_program_id: weeklyProgram.id,
            day_number: dayIndex + 1,
            workout_name: workout.name,
            estimated_duration: workout.duration,
            estimated_calories: workout.calories,
            muscle_groups: workout.muscleGroups
          })
          .select()
          .single();

        if (workoutError) throw workoutError;

        // Save exercises
        for (const [exerciseIndex, exercise] of workout.exercises.entries()) {
          await supabase
            .from('exercises')
            .upsert({
              daily_workout_id: dailyWorkout.id,
              name: exercise.name,
              sets: exercise.sets,
              reps: exercise.reps,
              rest_seconds: exercise.rest,
              muscle_groups: exercise.muscleGroups,
              instructions: exercise.instructions,
              youtube_search_term: exercise.youtubeSearchTerm,
              difficulty: exercise.difficulty,
              equipment: exercise.equipment,
              order_number: exerciseIndex + 1
            });
        }
      }

      return data.generatedProgram;
    },
    onSuccess: () => {
      toast.success('AI exercise program generated successfully!');
      queryClient.invalidateQueries({ queryKey: ['exercise-programs'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      console.error('Error generating exercise program:', error);
      toast.error('Failed to generate exercise program');
    },
  });

  return {
    generateExerciseProgram: generateExerciseProgram.mutate,
    isGenerating: generateExerciseProgram.isPending,
  };
};
