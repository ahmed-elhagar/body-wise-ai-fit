
export interface ExerciseProgram {
  id: string;
  program_name: string;
  difficulty_level: string;
  workout_type: string;
  status: string;
  week_start_date: string;
  current_week: number;
  total_estimated_calories: number;
  daily_workouts_count: number;
  daily_workouts: DailyWorkout[];
}

export interface DailyWorkout {
  id: string;
  day_number: number;
  workout_name: string;
  completed: boolean;
  estimated_duration: number;
  estimated_calories: number;
  muscle_groups: string[];
  exercises: Exercise[];
  is_rest_day?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  muscle_groups: string[];
  instructions: string;
  youtube_search_term: string;
  equipment: string;
  difficulty: string;
  order_number: number;
  completed: boolean;
  actual_sets?: number;
  actual_reps?: string;
  notes?: string;
  category?: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  exercise_id: string;
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
  sets_completed: number;
  reps_completed: string;
  weight_used?: number;
  notes?: string;
}

export interface ProgressMetrics {
  totalWorkouts: number;
  completedWorkouts: number;
  averageRating: number;
  totalCaloriesBurned: number;
  consistencyScore: number;
  strengthGains: number;
}
