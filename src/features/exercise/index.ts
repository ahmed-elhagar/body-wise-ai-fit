export * from './components';
export * from './hooks';
export * from './types';

// Main container and layout components
export { ExerciseContainer } from './components/ExerciseContainer';
export { ExerciseLayout } from './components/ExerciseLayout';
export { ExerciseHeader } from './components/ExerciseHeader';
export { ExerciseOverview } from './components/ExerciseOverview';

// Workout components
export { WorkoutView } from './components/workout/WorkoutView';
export { WorkoutCalendar } from './components/workout/WorkoutCalendar';
export { ExerciseCard } from './components/workout/ExerciseCard';

// Progress and analytics
export { ProgressTracker } from './components/progress/ProgressTracker';

// AI and form analysis
export { FormAnalysis } from './components/ai/FormAnalysis';
export { EnhancedAIGenerationDialog } from './components/ai/EnhancedAIGenerationDialog';

// Recovery and metrics
export { RecoveryMetrics } from './components/recovery/RecoveryMetrics';

// Shared components
export { WorkoutTypeSelector } from './components/shared/WorkoutTypeSelector';

// Loading states
export { LoadingState } from './components/loading/LoadingState';

// Hooks
export { useExerciseProgram } from './hooks/core/useExerciseProgram';
export { useWorkoutSession } from './hooks/core/useWorkoutSession';

// Types
export type { Exercise, ExerciseProgram, DailyWorkout } from './types';

// Services
export { exerciseService } from './services/exerciseService';
export { exerciseDataService } from './services/exerciseDataService';
