
// Main exports for exercise feature
export { ExerciseContainer } from './components';

// Export types
export type * from './types';

// Export hooks
export { useExerciseCore } from './hooks';

// Re-export existing hooks for backward compatibility
export { useOptimizedExercise } from '../../hooks/useOptimizedExercise';
export { useOptimizedExerciseProgramPage } from '../../hooks/useOptimizedExerciseProgramPage';

// Export utilities
export * from './utils';
