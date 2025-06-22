
// Exercise feature exports
export { default as ExercisePrograms } from './components/ExercisePrograms';
export { default as ExerciseOverview } from './components/ExerciseOverview';
export { default as ExerciseCard } from './components/ExerciseCard';
export { default as AIGenerationDialog } from './components/AIGenerationDialog';
export { default as ExerciseContainer } from './components/ExerciseContainer';
export { default as ExercisePage } from './components/ExercisePage';

// New components
export { ExerciseHeader } from './components/ExerciseHeader';
export { WorkoutTypeSelector } from './components/shared/WorkoutTypeSelector';
export { EnhancedAIGenerationDialog } from './components/ai/EnhancedAIGenerationDialog';
export { LoadingState } from './components/loading/LoadingState';
export { FormAnalysis } from './components/ai/FormAnalysis';
export { RecoveryMetrics } from './components/recovery/RecoveryMetrics';
export { ProgressTracker } from './components/progress/ProgressTracker';

// Hooks
export { useExerciseProgram } from './hooks/core/useExerciseProgram';
export { useWorkoutSession } from './hooks/core/useWorkoutSession';
export type { ExercisePreferences } from './hooks/core/useExerciseProgram';

// Types
export * from './types';
