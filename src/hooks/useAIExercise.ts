
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
      if (!user?.id) {
        throw new Error('Please sign in to generate exercise programs');
      }
      
      if (!profile) {
        throw new Error('Please complete your profile first');
      }

      // Check if user has generations remaining
      const canGenerate = await supabase.rpc('decrement_ai_generations', {
        user_id: user.id
      });

      if (!canGenerate.data) {
        throw new Error('You have reached your AI generation limit. Please contact admin to increase your limit.');
      }

      console.log('Generating exercise program with preferences:', preferences);

      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userProfile: profile,
          preferences
        }
      });

      if (error) {
        console.error('Exercise program generation error:', error);
        throw new Error(error.message || 'Failed to generate exercise program');
      }

      if (!data || !data.generatedProgram) {
        throw new Error('No exercise program was generated');
      }

      // Save to database
      const weekStartDate = new Date();
      weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
      
      const { data: weeklyProgram, error: weeklyError } = await supabase
        .from('weekly_exercise_programs')
        .upsert({
          user_id: user.id,
          week_start_date: weekStartDate.toISOString().split('T')[0],
          program_name: data.generatedProgram.programName || 'Custom AI Program',
          difficulty_level: data.generatedProgram.difficultyLevel || 'intermediate',
          total_estimated_calories: data.generatedProgram.totalCalories || 0,
          generation_prompt: preferences
        })
        .select()
        .single();

      if (weeklyError) throw weeklyError;

      // Save daily workouts and exercises
      for (const [dayIndex, dayWorkout] of data.generatedProgram.workouts.entries()) {
        const { data: dailyWorkout, error: workoutError } = await supabase
          .from('daily_workouts')
          .upsert({
            weekly_program_id: weeklyProgram.id,
            day_number: dayIndex + 1,
            workout_name: dayWorkout.name,
            estimated_duration: dayWorkout.duration,
            estimated_calories: dayWorkout.calories,
            muscle_groups: dayWorkout.muscleGroups
          })
          .select()
          .single();

        if (workoutError) throw workoutError;

        // Save exercises for this workout
        for (const [exerciseIndex, exercise] of dayWorkout.exercises.entries()) {
          await supabase
            .from('exercises')
            .upsert({
              daily_workout_id: dailyWorkout.id,
              name: exercise.name,
              sets: exercise.sets,
              reps: exercise.reps,
              rest_seconds: exercise.restSeconds,
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
    onError: (error: any) => {
      console.error('Error generating exercise program:', error);
      toast.error(`Error: ${error.message}`);
    },
  });

  return {
    generateExerciseProgram: generateExerciseProgram.mutate,
    isGenerating: generateExerciseProgram.isPending,
  };
};
