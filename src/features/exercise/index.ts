
// Exercise feature exports
export { default as ExercisePrograms } from './components/ExercisePrograms';
export { default as ExerciseOverview } from './components/ExerciseOverview';
export { default as ExerciseCard } from './components/ExerciseCard';
export { default as AIGenerationDialog } from './components/AIGenerationDialog';
export { default as ExerciseContainer } from './components/ExerciseContainer';

// Hooks
export { useExerciseProgram } from './hooks/core/useExerciseProgram';
export type { ExercisePreferences } from './hooks/core/useExerciseProgram';

// Types
export * from './types';
