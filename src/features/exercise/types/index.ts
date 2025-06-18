
// Exercise feature types - Updated to match database schema
export interface Exercise {
  id: string;
  daily_workout_id: string;
  name: string;
  description?: string;
  muscle_groups: string[];
  equipment?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  instructions: string; // Changed from string[] to string to match database
  youtube_search_term?: string;
  image_url?: string;
  sets?: number;
  reps?: string;
  rest_seconds?: number;
  order_number?: number;
  completed: boolean;
  notes?: string;
  actual_sets?: number;
  actual_reps?: string;
  created_at: string;
  updated_at: string;
}

export interface DailyWorkout {
  id: string;
  weekly_program_id: string;
  day_number: number;
  workout_name: string;
  target_muscle_groups: string[];
  estimated_duration: number;
  estimated_calories?: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  exercises: WorkoutExercise[];
  is_rest_day?: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExercise {
  id: string;
  exercise_id: string;
  exercise: Exercise;
  sets: number;
  reps_min: number;
  reps_max?: number;
  rest_seconds: number;
  weight_kg?: number;
  notes?: string;
  order_index: number;
}

export interface WeeklyExerciseProgram {
  id: string;
  user_id: string;
  week_start_date: string;
  program_name: string;
  program_type: 'strength' | 'cardio' | 'mixed' | 'flexibility';
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

export interface ExercisePreferences {
  programType: 'strength' | 'cardio' | 'mixed' | 'flexibility';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  workoutsPerWeek: number;
  sessionDuration: number;
  targetMuscleGroups: string[];
  availableEquipment: string[];
  workoutLocation: 'home' | 'gym' | 'outdoor';
}

export interface ExerciseFetchResult {
  weeklyProgram: WeeklyExerciseProgram | null;
  dailyWorkouts: DailyWorkout[];
}

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
