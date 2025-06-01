import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfWeek, format } from 'date-fns';
import { useI18n } from "@/hooks/useI18n";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  completed: boolean;
  order_number: number;
  workout_id: string;
  muscle_groups: string[];
  equipment: string;
  youtube_search_term: string;
  instructions: string;
  difficulty: string;
}

interface ExerciseProgram {
  id: string;
  name: string;
  description: string;
  workout_type: string;
  difficulty_level: string;
  duration_weeks: number;
  current_week: number;
  user_id: string;
  created_at: string;
}

interface Workout {
  id: string;
  workout_name: string;
  day_number: number;
  estimated_duration: number;
  estimated_calories: number;
  exercise_program_id: string;
  muscle_groups: string[];
}

export const useExerciseProgramQuery = (selectedDay: number, workoutType: string) => {
  const { language } = useI18n();

  const weekStartDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const formattedDate = format(weekStartDate, 'yyyy-MM-dd');

  const { data: programData, isLoading: isProgramLoading, error: programError } = useQuery({
    queryKey: ['exercise-program', workoutType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercise_programs')
        .select('*')
        .eq('workout_type', workoutType)
        .single();

      if (error) {
        console.error('Error fetching exercise program:', error);
        throw error;
      }

      return data as ExerciseProgram;
    },
  });

  const { data: workoutData, isLoading: isWorkoutLoading, error: workoutError } = useQuery({
    queryKey: ['workout', programData?.id, selectedDay],
    queryFn: async () => {
      if (!programData?.id) return null;

      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('exercise_program_id', programData.id)
        .eq('day_number', selectedDay)
        .single();

      if (error) {
        console.error('Error fetching workout:', error);
        throw error;
      }

      return data as Workout;
    },
    enabled: !!programData?.id,
  });

  const { data: exercises, isLoading: isExercisesLoading, error: exercisesError } = useQuery({
    queryKey: ['exercises', workoutData?.id, language],
    queryFn: async () => {
      if (!workoutData?.id) return [];

      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('workout_id', workoutData.id)
        .order('order_number', { ascending: true });

      if (error) {
        console.error('Error fetching exercises:', error);
        throw error;
      }

      return data as Exercise[];
    },
    enabled: !!workoutData?.id,
  });

  const isLoading = isProgramLoading || isWorkoutLoading || isExercisesLoading;
  const error = programError || workoutError || exercisesError;
  const isRestDay = !workoutData;

  return {
    program: programData,
    workout: workoutData,
    exercises: exercises || [],
    isLoading,
    error,
    isRestDay,
    weekStartDate: formattedDate
  };
};
