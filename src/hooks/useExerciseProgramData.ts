
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { addDays, startOfWeek, format } from 'date-fns';

export interface ExerciseProgram {
  id: string;
  program_name: string;
  difficulty_level: string;
  workout_type: "home" | "gym";
  current_week: number;
  week_start_date: string;
  created_at: string;
  daily_workouts_count: number;
  total_estimated_calories?: number;
  generation_prompt?: any;
  daily_workouts?: DailyWorkout[];
}

export interface DailyWorkout {
  id: string;
  weekly_program_id: string;
  day_number: number;
  workout_name: string;
  estimated_duration?: number;
  estimated_calories?: number;
  muscle_groups?: string[];
  completed: boolean;
  exercises?: Exercise[];
  is_rest_day?: boolean;
}

export interface Exercise {
  id: string;
  daily_workout_id: string;
  name: string;
  sets?: number;
  reps?: string;
  rest_seconds?: number;
  muscle_groups?: string[];
  instructions?: string;
  youtube_search_term?: string;
  equipment?: string;
  difficulty?: string;
  order_number?: number;
  completed: boolean;
  notes?: string;
  actual_sets?: number;
  actual_reps?: string;
}

export const useExerciseProgramData = (weekOffset: number = 0, workoutType: "home" | "gym" = "home") => {
  const { user } = useAuth();

  // Calculate the target week start date based on offset
  const currentDate = new Date();
  const targetWeekStart = addDays(startOfWeek(currentDate), weekOffset * 7);
  const targetWeekStartString = format(targetWeekStart, 'yyyy-MM-dd');

  const { data: currentProgram, isLoading: isProgramLoading, error: programError, refetch } = useQuery({
    queryKey: ['exercise-program', user?.id, weekOffset, workoutType, targetWeekStartString],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
      console.log('🔍 Fetching exercise program:', {
        weekOffset,
        workoutType,
        targetWeekStart: targetWeekStartString,
        userId: user.id
      });

      // First try to get existing program for this specific week and workout type
      const { data: existingProgram, error: fetchError } = await supabase
        .from('weekly_exercise_programs')
        .select(`
          *,
          daily_workouts:daily_workouts(
            *,
            exercises:exercises(*)
          )
        `)
        .eq('user_id', user.id)
        .eq('workout_type', workoutType)
        .eq('week_start_date', targetWeekStartString)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Error fetching exercise program:', fetchError);
        throw fetchError;
      }

      // If no program found for this week, return null (empty state)
      if (!existingProgram) {
        console.log('📭 No program found for week:', targetWeekStartString, 'type:', workoutType);
        return null;
      }

      console.log('✅ Found program:', existingProgram.program_name);

      // Transform data and handle rest days
      const transformedProgram = {
        ...existingProgram,
        workout_type: existingProgram.workout_type || workoutType,
        current_week: existingProgram.current_week || 1,
        daily_workouts_count: existingProgram.daily_workouts?.length || 0,
        daily_workouts: generateWeeklyWorkouts(existingProgram.daily_workouts || [], workoutType)
      } as ExerciseProgram;

      return transformedProgram;
    },
    enabled: !!user?.id,
  });

  // Generate a complete week (7 days) with rest days
  const generateWeeklyWorkouts = (workouts: any[], type: "home" | "gym"): DailyWorkout[] => {
    const weekDays = [1, 2, 3, 4, 5, 6, 7]; // Monday to Sunday
    const restDays = type === "home" ? [3, 6, 7] : [4, 7]; // Wed, Sat, Sun for home; Thu, Sun for gym
    
    return weekDays.map(dayNumber => {
      const existingWorkout = workouts.find(w => w.day_number === dayNumber);
      const isRestDay = restDays.includes(dayNumber);
      
      if (isRestDay) {
        return {
          id: `rest-${dayNumber}`,
          weekly_program_id: '',
          day_number: dayNumber,
          workout_name: 'Rest Day',
          completed: false,
          exercises: [],
          is_rest_day: true
        };
      }
      
      if (existingWorkout) {
        return {
          ...existingWorkout,
          completed: existingWorkout.completed || false,
          is_rest_day: false,
          exercises: existingWorkout.exercises?.map((exercise: any) => ({
            ...exercise,
            completed: exercise.completed || false
          })) || []
        };
      }
      
      // Return empty workout day if no data
      return {
        id: `empty-${dayNumber}`,
        weekly_program_id: '',
        day_number: dayNumber,
        workout_name: 'No Workout',
        completed: false,
        exercises: [],
        is_rest_day: false
      };
    });
  };

  const completeExercise = async (exerciseId: string) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('exercises')
      .update({ 
        completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', exerciseId);

    if (error) {
      console.error('Error completing exercise:', error);
      throw error;
    }

    refetch();
  };

  const updateExerciseProgress = async (exerciseId: string, sets: number, reps: string, notes?: string) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('exercises')
      .update({ 
        actual_sets: sets,
        actual_reps: reps,
        notes: notes,
        completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', exerciseId);

    if (error) {
      console.error('Error updating exercise progress:', error);
      throw error;
    }

    refetch();
  };

  return {
    currentProgram,
    isLoading: isProgramLoading,
    error: programError,
    refetch,
    completeExercise,
    updateExerciseProgress,
  };
};
