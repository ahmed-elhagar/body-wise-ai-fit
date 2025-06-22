
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
export { default as ExerciseOverview } from './components/ExerciseOverview';
export { default as ExerciseLayout } from './components/ExerciseLayout';

// Hooks
export * from './hooks';

// Services
export { default as ExerciseService } from './services/exerciseService';
export { default as ExerciseDataService } from './services/exerciseDataService';

// Types
export * from './types';

// Utils
export * from './utils';
