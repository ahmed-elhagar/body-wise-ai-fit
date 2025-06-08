
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

// Re-export ExercisePreferences from validation utils to avoid conflicts
export type { ExercisePreferences } from '@/utils/exerciseValidation';
