
// Exercise types
export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  actual_sets?: number;
  actual_reps?: string;
  completed?: boolean;
  instructions?: string;
  muscle_groups?: string[];
  equipment?: string;
  difficulty?: string;
  youtube_search_term?: string;
  notes?: string;
  rest_seconds?: number;
  order_number?: number;
  daily_workout_id: string;
  created_at?: string;
  updated_at?: string;
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
  created_at: string;
  updated_at: string;
}

export interface DailyWorkout {
  id: string;
  weekly_program_id: string;
  day_number: number;
  workout_name: string;
  muscle_groups?: string[];
  estimated_duration?: number;
  estimated_calories?: number;
  completed?: boolean;
  created_at: string;
  updated_at: string;
}
