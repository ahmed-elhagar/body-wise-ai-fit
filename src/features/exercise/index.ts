
// Main exports for exercise feature
export { default as OptimizedExerciseContainer } from '../../components/exercise/OptimizedExerciseContainer';
export { default as ExercisePageRefactored } from '../../components/exercise/ExercisePageRefactored';

// Export types
export type * from './types';

// Export utilities
export * from './utils';

// Export hooks (will be moved here in next phase)
export { useOptimizedExercise } from '../../hooks/useOptimizedExercise';
export { useOptimizedExerciseProgramPage } from '../../hooks/useOptimizedExerciseProgramPage';
