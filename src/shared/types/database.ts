// Unified Database Types Export
// This file consolidates all database-related types for easier feature access

import type { Database, Tables, TablesInsert, TablesUpdate, Enums } from '@/integrations/supabase/types';

// Re-export core database types
export type { Database, Tables, TablesInsert, TablesUpdate, Enums };

// Specific table types for common use
export type Profile = Tables<'profiles'>;
export type ProfileInsert = TablesInsert<'profiles'>;
export type ProfileUpdate = TablesUpdate<'profiles'>;

export type FoodItem = Tables<'food_items'>;
export type FoodItemInsert = TablesInsert<'food_items'>;
export type FoodItemUpdate = TablesUpdate<'food_items'>;

export type FoodConsumptionLog = Tables<'food_consumption_log'>;
export type FoodConsumptionLogInsert = TablesInsert<'food_consumption_log'>;
export type FoodConsumptionLogUpdate = TablesUpdate<'food_consumption_log'>;

export type WeeklyMealPlan = Tables<'weekly_meal_plans'>;
export type WeeklyMealPlanInsert = TablesInsert<'weekly_meal_plans'>;
export type WeeklyMealPlanUpdate = TablesUpdate<'weekly_meal_plans'>;

export type DailyMeal = Tables<'daily_meals'>;
export type DailyMealInsert = TablesInsert<'daily_meals'>;
export type DailyMealUpdate = TablesUpdate<'daily_meals'>;

export type Exercise = Tables<'exercises'>;
export type ExerciseInsert = TablesInsert<'exercises'>;
export type ExerciseUpdate = TablesUpdate<'exercises'>;

export type WeeklyExerciseProgram = Tables<'weekly_exercise_programs'>;
export type WeeklyExerciseProgramInsert = TablesInsert<'weekly_exercise_programs'>;
export type WeeklyExerciseProgramUpdate = TablesUpdate<'weekly_exercise_programs'>;

export type DailyWorkout = Tables<'daily_workouts'>;
export type DailyWorkoutInsert = TablesInsert<'daily_workouts'>;
export type DailyWorkoutUpdate = TablesUpdate<'daily_workouts'>;

export type UserGoal = Tables<'user_goals'>;
export type UserGoalInsert = TablesInsert<'user_goals'>;
export type UserGoalUpdate = TablesUpdate<'user_goals'>;

export type UserNotification = Tables<'user_notifications'>;
export type UserNotificationInsert = TablesInsert<'user_notifications'>;
export type UserNotificationUpdate = TablesUpdate<'user_notifications'>;

export type Subscription = Tables<'subscriptions'>;
export type SubscriptionInsert = TablesInsert<'subscriptions'>;
export type SubscriptionUpdate = TablesUpdate<'subscriptions'>;

export type WeightEntry = Tables<'weight_entries'>;
export type WeightEntryInsert = TablesInsert<'weight_entries'>;
export type WeightEntryUpdate = TablesUpdate<'weight_entries'>;

export type HealthAssessment = Tables<'health_assessments'>;
export type HealthAssessmentInsert = TablesInsert<'health_assessments'>;
export type HealthAssessmentUpdate = TablesUpdate<'health_assessments'>;

export type CoachTraineeMessage = Tables<'coach_trainee_messages'>;
export type CoachTraineeMessageInsert = TablesInsert<'coach_trainee_messages'>;
export type CoachTraineeMessageUpdate = TablesUpdate<'coach_trainee_messages'>;

export type AIGenerationLog = Tables<'ai_generation_logs'>;
export type AIGenerationLogInsert = TablesInsert<'ai_generation_logs'>;
export type AIGenerationLogUpdate = TablesUpdate<'ai_generation_logs'>;

// Enum types for easy access
export type UserRole = Enums<'user_role'>;
export type AppRole = Enums<'app_role'>;

// Common filter and pagination types
export interface DatabaseFilters {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface DatabaseResponse<T> {
  data: T | null;
  error: Error | null;
  count?: number;
}

// API Response wrapper types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
} 