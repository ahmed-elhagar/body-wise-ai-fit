
import { z } from 'zod';

export const ExercisePreferencesSchema = z.object({
  workoutType: z.enum(['home', 'gym']),
  goalType: z.string().min(1, 'Goal type is required'),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  availableTime: z.string().min(1, 'Available time is required'),
  preferredWorkouts: z.array(z.string()).min(1, 'At least one workout type is required'),
  targetMuscleGroups: z.array(z.string()).min(1, 'At least one muscle group is required'),
  equipment: z.array(z.string()).min(1, 'At least one equipment type is required'),
  duration: z.string().min(1, 'Duration is required'),
  workoutDays: z.string().min(1, 'Workout days is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  weekStartDate: z.string().optional(),
  weekOffset: z.number().optional()
});

export const ExerciseProgressSchema = z.object({
  exerciseId: z.string().uuid('Invalid exercise ID'),
  sets: z.number().min(0, 'Sets must be positive').max(20, 'Maximum 20 sets allowed'),
  reps: z.string().min(1, 'Reps information is required'),
  notes: z.string().optional()
});

export const ExerciseCompletionSchema = z.object({
  exerciseId: z.string().uuid('Invalid exercise ID'),
  completed: z.boolean()
});

export type ExercisePreferences = z.infer<typeof ExercisePreferencesSchema>;
export type ExerciseProgress = z.infer<typeof ExerciseProgressSchema>;
export type ExerciseCompletion = z.infer<typeof ExerciseCompletionSchema>;
