
// Exercise types
export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  actual_sets?: number;
  actual_reps?: string;
  completed: boolean;
  instructions?: string;
  muscle_groups?: string[];
  equipment?: string;
  difficulty?: string;
  difficulty_level?: string;
  youtube_search_term?: string;
  notes?: string;
  rest_seconds?: number;
  order_number?: number;
  daily_workout_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface DailyWorkout {
  id: string;
  weekly_program_id: string;
  day_number: number;
  workout_name: string;
  target_muscle_groups?: string[];
  muscle_groups?: string[];
  estimated_duration?: number;
  estimated_calories?: number;
  difficulty_level?: string;
  completed?: boolean;
  exercises?: Exercise[];
  is_rest_day?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExerciseProgram {
  id: string;
  user_id: string;
  program_name: string;
  week_start_date: string;
  workout_type: 'home' | 'gym';
  status: string;
  difficulty_level?: string;
  total_estimated_calories?: number;
  current_week?: number;
  daily_workouts_count?: number;
  daily_workouts?: DailyWorkout[];
  created_at: string;
  updated_at: string;
}

export interface WeeklyExerciseProgram {
  id: string;
  user_id: string;
  week_start_date: string;
  program_name: string;
  program_type: string;
  total_workouts: number;
  estimated_weekly_hours: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  target_muscle_groups: string[];
  workout_type: 'home' | 'gym';
  current_week: number;
  status: string;
  daily_workouts: DailyWorkout[];
  created_at: string;
  updated_at: string;
}

export interface ExerciseFetchResult {
  weeklyProgram: WeeklyExerciseProgram | null;
  dailyWorkouts: DailyWorkout[];
}

export interface ExercisePreferences {
  workoutType: 'home' | 'gym';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  targetMuscleGroups: string[];
  workoutDuration: number;
  fitnessGoals: string[];
}
