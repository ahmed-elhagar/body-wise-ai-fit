
// Main exports for exercise feature
export { default as OptimizedExerciseContainer } from './components/OptimizedExerciseContainer';

// Feature components
export { 
  ExerciseList, 
  WorkoutTypeToggle,
  ExerciseProgramSelector,
  WorkoutTypeTabs,
  ExercisePageContent,
  ExerciseListEnhanced
} from './components';

// Export types
export type * from './types';
export type { ExerciseProgram, ExercisePreferences, Exercise, DailyWorkout } from './types';

// Export utilities
export * from './utils';

// Export hooks
export * from './hooks';

// Export services
export * from './services';
