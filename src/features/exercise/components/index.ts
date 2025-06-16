
export { ExercisePageContainer } from './ExercisePageContainer';
export { WeeklyExerciseNavigation } from './WeeklyExerciseNavigation';
export { ModernExerciseNavigation } from './ModernExerciseNavigation';
export { ExerciseCompactNavigation } from './ExerciseCompactNavigation';
export { WorkoutTypeToggle } from './WorkoutTypeToggle';
export { EnhancedWorkoutTypeToggle } from './EnhancedWorkoutTypeToggle';
export { WorkoutTypeTabs } from './WorkoutTypeTabs';
export { UnifiedExerciseContainer } from './UnifiedExerciseContainer';
export { EnhancedDayNavigation } from './EnhancedDayNavigation';

// Placeholder exports for missing components that are imported elsewhere
export const InteractiveExerciseCard = ({ exercise, index, onExerciseComplete, onExerciseProgressUpdate }: any) => (
  <div className="p-4 bg-white rounded-lg border">
    <h3 className="font-semibold">{exercise.name}</h3>
    <p className="text-sm text-gray-600">{exercise.sets} sets × {exercise.reps} reps</p>
    <button 
      onClick={() => onExerciseComplete(exercise.id)}
      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
    >
      {exercise.completed ? 'Mark Incomplete' : 'Mark Complete'}
    </button>
  </div>
);

export const RestDayCard = () => (
  <div className="p-8 bg-orange-50 rounded-lg text-center">
    <Coffee className="w-12 h-12 text-orange-500 mx-auto mb-4" />
    <h3 className="text-xl font-bold text-orange-800 mb-2">Rest Day</h3>
    <p className="text-orange-600">Take time to recover and prepare for your next workout.</p>
  </div>
);

export const AnimatedProgressRing = ({ completedExercises, totalExercises, progressPercentage }: any) => (
  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
    <span className="text-sm font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
  </div>
);
