
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

export const createMockExercise = (overrides: Partial<Exercise> = {}): Exercise => ({
  id: Math.random().toString(),
  daily_workout_id: 'mock-workout-id',
  name: 'Mock Exercise',
  sets: 3,
  reps: '10',
  completed: false,
  ...overrides
});
