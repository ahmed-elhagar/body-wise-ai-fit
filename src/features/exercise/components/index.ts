
// Exercise feature components exports

// New consolidated components
export { ExerciseContainer } from './containers/ExerciseContainer';
export { ExerciseCard } from './ExerciseCard';
export { ProgressTracker } from './progress/ProgressTracker';
export { RecoveryMetrics } from './recovery/RecoveryMetrics';
export { AIGenerationDialog } from './ai/AIGenerationDialog';
export { FormAnalysis } from './ai/FormAnalysis';
export { WorkoutTypeSelector } from './shared/WorkoutTypeSelector';

// Default imports
import AIExerciseDialog from "./AIExerciseDialog";
import ExerciseAnalyticsContainer from "./ExerciseAnalyticsContainer";
import ExerciseProgramSelector from "./ExerciseProgramSelector";

// Re-export as named exports
export { AIExerciseDialog };
export { ExerciseAnalyticsContainer };
export { ExerciseProgramSelector };
