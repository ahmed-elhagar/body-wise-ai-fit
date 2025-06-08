
import React from 'react';
import ExerciseListEnhanced from './ExerciseListEnhanced';
import ExerciseProgressTracker from './ExerciseProgressTracker';
import ExerciseQuickActions from './ExerciseQuickActions';
import { useI18n } from '@/hooks/useI18n';
import { Exercise } from '@/types/exercise';

interface WorkoutContentLayoutProps {
  exercises: Exercise[];
  selectedDay: number;
  workoutType: 'home' | 'gym';
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isWorkoutActive: boolean;
  onStartWorkout: () => void;
  onPauseWorkout: () => void;
  onSkipExercise: () => void;
  onRestartWorkout: () => void;
}

export const WorkoutContentLayout = ({
  exercises,
  selectedDay,
  workoutType,
  onExerciseComplete,
  onExerciseProgressUpdate,
  isWorkoutActive,
  onStartWorkout,
  onPauseWorkout,
  onSkipExercise,
  onRestartWorkout
}: WorkoutContentLayoutProps) => {
  const { t, isRTL } = useI18n();

  const completedExercises = exercises.filter(ex => ex.completed).length;

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ExerciseQuickActions
            isWorkoutActive={isWorkoutActive}
            onStartWorkout={onStartWorkout}
            onPauseWorkout={onPauseWorkout}
            onSkipExercise={onSkipExercise}
            onRestartWorkout={onRestartWorkout}
          />
          
          <ExerciseListEnhanced
            exercises={exercises}
            onExerciseComplete={onExerciseComplete}
            onExerciseProgressUpdate={onExerciseProgressUpdate}
            workoutType={workoutType}
            isRestDay={false}
          />
        </div>

        <div className="space-y-4">
          <ExerciseProgressTracker
            completedExercises={completedExercises}
            totalExercises={exercises.length}
            weeklyGoal={5}
            currentWeekProgress={3}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkoutContentLayout;
