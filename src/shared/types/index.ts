// Unified Type System Exports
// This file consolidates all shared types for easier feature access

// Common types
export * from './common';

// Database types (excluding ApiResponse to avoid conflict)
export type { 
  Database, Tables, TablesInsert, TablesUpdate, Enums,
  Profile, ProfileInsert, ProfileUpdate,
  FoodItem, FoodItemInsert, FoodItemUpdate,
  FoodConsumptionLog, FoodConsumptionLogInsert, FoodConsumptionLogUpdate,
  WeeklyMealPlan, WeeklyMealPlanInsert, WeeklyMealPlanUpdate,
  DailyMeal, DailyMealInsert, DailyMealUpdate,
  Exercise, ExerciseInsert, ExerciseUpdate,
  WeeklyExerciseProgram, WeeklyExerciseProgramInsert, WeeklyExerciseProgramUpdate,
  DailyWorkout, DailyWorkoutInsert, DailyWorkoutUpdate,
  UserGoal, UserGoalInsert, UserGoalUpdate,
  UserNotification, UserNotificationInsert, UserNotificationUpdate,
  Subscription, SubscriptionInsert, SubscriptionUpdate,
  WeightEntry, WeightEntryInsert, WeightEntryUpdate,
  HealthAssessment, HealthAssessmentInsert, HealthAssessmentUpdate,
  CoachTraineeMessage, CoachTraineeMessageInsert, CoachTraineeMessageUpdate,
  AIGenerationLog, AIGenerationLogInsert, AIGenerationLogUpdate,
  UserRole, AppRole,
  DatabaseFilters, DatabaseResponse
} from './database';

// Feature-specific type re-exports
export type { 
  FoodAnalysisResult,
  WaterIntakeRecord,
  FoodTrackerFilters 
} from '@/features/food-tracker/services/foodTrackerService';

// Hook types
export type { 
  LoadingStatus,
  LoadingStep,
  UnifiedLoadingOptions,
  UnifiedLoadingState 
} from '@/shared/hooks/useUnifiedLoading';

export type { 
  DataFetcherOptions,
  DataFetcherState
} from '@/shared/hooks/useDataFetcher';

// Service types
export type { 
  ServiceOptions,
  QueryResult 
} from '@/shared/services/BaseService'; 