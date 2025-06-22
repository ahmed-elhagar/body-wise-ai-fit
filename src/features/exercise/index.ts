
// Exercise feature components exports

// New consolidated components
export { ExerciseContainer } from './components/containers/ExerciseContainer';
export { ExerciseCard } from './components/ExerciseCard';
export { ProgressTracker } from './components/progress/ProgressTracker';
export { RecoveryMetrics } from './components/recovery/RecoveryMetrics';
export { AIGenerationDialog } from './components/ai/AIGenerationDialog';
export { FormAnalysis } from './components/ai/FormAnalysis';
export { WorkoutTypeSelector } from './components/shared/WorkoutTypeSelector';

// Main components
export { default as ExercisePage } from './components/ExercisePage';
export { default as ExerciseContainerLegacy } from './components/ExerciseContainer';

// Export components with proper default exports
export { ExerciseOverview } from './components/ExerciseOverview';
export { ExerciseLayout } from './components/ExerciseLayout';

// Hooks - only export from core
export * from './hooks/core/useExerciseProgram';
export * from './hooks/core/useWorkoutSession';

// Services
export { default as ExerciseService } from './services/exerciseService';
export { default as ExerciseDataService } from './services/exerciseDataService';

// Types
export * from './types';

// Utils
export * from './utils';
