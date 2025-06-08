
// Re-export exercise types for consistency
export type { 
  ExerciseProgram,
  DailyWorkout,
  Exercise
} from '@/types/exercise';

// Exercise-specific interfaces
export interface WeekDay {
  dayNumber: number;
  dayName: string;
  workout: any;
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
  weekStartDate?: string;
  weekOffset?: number;
}
