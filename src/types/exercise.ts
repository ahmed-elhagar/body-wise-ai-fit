
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string | number;
  weight?: number;
  duration?: number;
  rest_seconds?: number;
  instructions?: string;
  youtube_search_term?: string;
  equipment?: string;
  muscle_groups?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  completed?: boolean;
  actual_sets?: number;
  actual_reps?: string;
  notes?: string;
  order_number?: number;
  daily_workout_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutSession {
  id: string;
  name: string;
  exercises: Exercise[];
  started_at?: string;
  completed_at?: string;
  total_duration?: number;
  estimated_calories?: number;
  estimated_duration?: number;
}

export interface ExerciseProgress {
  exerciseId: string;
  sets: number;
  reps: string;
  weight?: number;
  notes?: string;
  completed: boolean;
}

export interface WorkoutStats {
  totalExercises: number;
  completedExercises: number;
  totalSets: number;
  completedSets: number;
  estimatedCalories: number;
  duration?: number;
}

export interface ExerciseProgram {
  id: string;
  name: string;
  description?: string;
  duration_weeks: number;
  daily_workouts: DailyWorkout[];
  created_at?: string;
  updated_at?: string;
}

export interface DailyWorkout {
  id: string;
  day_number: number;
  name?: string;
  exercises: Exercise[];
  estimated_calories?: number;
  estimated_duration?: number;
  completed?: boolean;
}
