
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

interface ExerciseProgram {
  id: string;
  name: string;
  description: string;
  workout_type: string;
  difficulty_level: string;
  current_week: number;
  weeks_duration: number;
  status: string;
}

interface Workout {
  id: string;
  workout_name: string;
  day_number: number;
  estimated_duration: number;
  estimated_calories: number;
  muscle_groups: string[];
  completed: boolean;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  muscle_groups: string[];
  equipment: string;
  instructions: string;
  difficulty: string;
  notes: string;
  completed: boolean;
  actual_sets: number;
  actual_reps: string;
  workout_id: string;
  daily_workout_id: string;
}

export const useExerciseProgramQuery = (weekOffset: number = 0) => {
  const { user } = useAuth();

  const { data: programData, isLoading: isProgramLoading, error: programError, refetch } = useQuery({
    queryKey: ['exercise-program', user?.id, weekOffset],
    queryFn: async () => {
      if (!user) return null;
      
      // Return mock data since tables don't exist
      const mockProgram: ExerciseProgram = {
        id: 'program-1',
        name: 'Mock Exercise Program',
        description: 'A sample exercise program',
        workout_type: 'home',
        difficulty_level: 'beginner',
        current_week: 1,
        weeks_duration: 4,
        status: 'active'
      };

      const mockWorkout: Workout = {
        id: 'workout-1',
        workout_name: 'Day 1 Workout',
        day_number: 1,
        estimated_duration: 45,
        estimated_calories: 300,
        muscle_groups: ['chest', 'arms'],
        completed: false
      };

      const mockExercises: Exercise[] = [
        {
          id: 'exercise-1',
          name: 'Push-ups',
          sets: 3,
          reps: '10-15',
          rest_seconds: 60,
          muscle_groups: ['chest', 'arms'],
          equipment: 'none',
          instructions: 'Standard push-up form',
          difficulty: 'beginner',
          notes: '',
          completed: false,
          actual_sets: 0,
          actual_reps: '',
          workout_id: 'workout-1',
          daily_workout_id: 'workout-1'
        }
      ];

      return {
        program: mockProgram,
        workout: mockWorkout,
        exercises: mockExercises,
        isRestDay: false,
        weekStartDate: new Date().toISOString().split('T')[0]
      };
    },
    enabled: !!user
  });

  return {
    program: programData?.program || null,
    workout: programData?.workout || null,
    exercises: programData?.exercises || [],
    isLoading: isProgramLoading,
    error: programError,
    isRestDay: programData?.isRestDay || false,
    weekStartDate: programData?.weekStartDate || '',
    refetch
  };
};
