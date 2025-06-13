
import { useState } from 'react';
import { Exercise } from '../types';
import { ExerciseCard } from '@/components/exercise/ExerciseCard';
import { ActiveExerciseTracker } from '@/components/exercise/ActiveExerciseTracker';
import { WorkoutSessionManager } from '@/components/exercise/WorkoutSessionManager';

interface ExerciseSessionViewProps {
  exercises: Exercise[];
  activeExerciseId: string | null;
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  onSessionComplete: () => void;
  onSetActive: (exerciseId: string) => void;
  onDeactivate: () => void;
}

export const ExerciseSessionView = ({
  exercises,
  activeExerciseId,
  onExerciseComplete,
  onExerciseProgressUpdate,
  onSessionComplete,
  onSetActive,
  onDeactivate
}: ExerciseSessionViewProps) => {
  return (
    <>
      <WorkoutSessionManager
        exercises={exercises}
        onExerciseComplete={onExerciseComplete}
        onExerciseProgressUpdate={onExerciseProgressUpdate}
        onSessionComplete={onSessionComplete}
      />
      
      {activeExerciseId && (
        <ActiveExerciseTracker
          exercise={exercises.find(ex => ex.id === activeExerciseId)!}
          onComplete={onExerciseComplete}
          onProgressUpdate={onExerciseProgressUpdate}
          onDeactivate={onDeactivate}
        />
      )}
      
      <div className="space-y-3">
        {exercises
          .filter(exercise => exercise.id !== activeExerciseId)
          .map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onComplete={onExerciseComplete}
              onProgressUpdate={onExerciseProgressUpdate}
              isActive={false}
              onSetActive={() => onSetActive(exercise.id)}
            />
          ))}
      </div>
    </>
  );
};
