
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

      try {
        // Check if user has generations remaining
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('ai_generations_remaining')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          throw new Error('Failed to check AI generations remaining');
        }
        
        if (profileData.ai_generations_remaining <= 0) {
          throw new Error('You have reached your AI generation limit (5 generations max). Please contact admin to increase your limit.');
        }

        console.log('Generating exercise program with enhanced prompt for user:', user.id);

        // Call the improved edge function
        const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
          body: {
            userProfile: {
              ...profile,
              id: user.id,
              email: user.email
            },
            preferences: {
              duration: preferences.duration || "4",
              equipment: preferences.equipment || "Basic home equipment",
              workoutDays: preferences.workoutDays || "3-4 days per week",
              difficulty: preferences.difficulty || "beginner",
              ...preferences
            }
          }
        });

        if (error) {
          console.error('Exercise program generation error:', error);
          throw new Error(error.message || 'Failed to generate exercise program');
        }

        if (!data || !data.generatedProgram) {
          throw new Error('No exercise program was generated. Please try again.');
        }

        console.log('Generated exercise program structure:', data.generatedProgram);

        // Decrement AI generations
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            ai_generations_remaining: profileData.ai_generations_remaining - 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
          
        if (updateError) {
          console.error('Failed to update AI generations remaining:', updateError);
        }

        // Save to database with enhanced structure
        const weekStartDate = new Date();
        weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
        
        const { data: weeklyProgram, error: weeklyError } = await supabase
          .from('weekly_exercise_programs')
          .upsert({
            user_id: user.id,
            week_start_date: weekStartDate.toISOString().split('T')[0],
            program_name: data.generatedProgram.programOverview?.name || 'AI Generated Program',
            difficulty_level: data.generatedProgram.programOverview?.difficulty || 'intermediate',
            total_estimated_calories: 0,
            generation_prompt: {
              userProfile: profile,
              preferences,
              generatedAt: new Date().toISOString()
            }
          })
          .select()
          .single();

        if (weeklyError) {
          console.error('Error saving weekly program:', weeklyError);
          throw weeklyError;
        }

        console.log('Saved weekly exercise program:', weeklyProgram);

        // Save daily workouts and exercises with enhanced structure
        if (data.generatedProgram.weeks && Array.isArray(data.generatedProgram.weeks)) {
          console.log(`Saving ${data.generatedProgram.weeks.length} weeks of workouts`);
          
          const firstWeek = data.generatedProgram.weeks[0];
          if (firstWeek?.workouts && Array.isArray(firstWeek.workouts)) {
            for (const workout of firstWeek.workouts) {
              const { data: dailyWorkout, error: workoutError } = await supabase
                .from('daily_workouts')
                .upsert({
                  weekly_program_id: weeklyProgram.id,
                  day_number: workout.day,
                  workout_name: workout.workoutName || 'Daily Workout',
                  estimated_duration: workout.estimatedDuration || 45,
                  estimated_calories: workout.estimatedCalories || 250,
                  muscle_groups: workout.exercises?.map((ex: any) => ex.muscleGroups).flat() || []
                })
                .select()
                .single();

              if (workoutError) {
                console.error('Error saving workout:', workoutError);
                continue;
              }

              // Save exercises for this workout
              if (workout.exercises && Array.isArray(workout.exercises)) {
                for (const [exerciseIndex, exercise] of workout.exercises.entries()) {
                  const { error: exerciseError } = await supabase
                    .from('exercises')
                    .upsert({
                      daily_workout_id: dailyWorkout.id,
                      name: exercise.name || 'Exercise',
                      sets: exercise.sets || 3,
                      reps: exercise.reps || '10-12',
                      rest_seconds: exercise.restSeconds || 60,
                      muscle_groups: exercise.muscleGroups || [],
                      instructions: exercise.instructions || 'Perform exercise as demonstrated',
                      youtube_search_term: exercise.youtubeSearchTerm || null,
                      difficulty: exercise.difficulty || 'beginner',
                      equipment: exercise.equipment || 'none',
                      order_number: exerciseIndex + 1
                    });

                  if (exerciseError) {
                    console.error('Error saving exercise:', exerciseError);
                  }
                }
              }
            }
          }
        }

        console.log('Exercise program generation completed successfully');
        return data.generatedProgram;
      } catch (error: any) {
        console.error('Error in exercise program generation workflow:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success('AI exercise program generated successfully! Your personalized workout plan is ready.');
      queryClient.invalidateQueries({ queryKey: ['exercise-programs'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-exercise-programs'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      console.error('Exercise program generation failed:', error);
      toast.error(`Failed to generate exercise program: ${error.message}`);
    },
  });

  return {
    generateExerciseProgram: generateExerciseProgram.mutate,
    isGenerating: generateExerciseProgram.isPending,
  };
};
