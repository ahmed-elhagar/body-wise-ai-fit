
// Centralized types for exercise feature
export interface ExerciseProgram {
  id: string;
  program_name: string;
  workout_type: 'home' | 'gym';
  difficulty_level: string;
  current_week: number;
  daily_workouts: DailyWorkout[];
  daily_workouts_count: number;
}

export interface DailyWorkout {
  id: string;
  day_number: number;
  workout_name: string;
  is_rest_day: boolean;
  completed: boolean;
  estimated_duration: number;
  estimated_calories: number;
  muscle_groups: string[];
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  exercise_name: string;
  sets: number;
  reps: string;
  weight?: number;
  duration?: number;
  completed: boolean;
  notes?: string;
  progressPercentage: number;
}

export interface WeekDay {
  dayNumber: number;
  dayName: string;
  workout: DailyWorkout;
  isRestDay: boolean;
  isCompleted: boolean;
  isToday: boolean;
}

export interface ExercisePreferences {
  workoutType: "home" | "gym";
  goalType: string;
  fitnessLevel: string;
  availableTime: string;
  preferredWorkouts: string[];
  targetMuscleGroups: string[];
  equipment: string[];
  duration: string;
  workoutDays: string;
  difficulty: string;
}
