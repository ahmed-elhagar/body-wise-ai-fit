
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  muscle_groups: string[];
  instructions: string;
  equipment?: string;
  difficulty?: string;
  completed: boolean;
  order_number: number;
  youtube_search_term?: string;
}

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
  exercises: Exercise[];
}
