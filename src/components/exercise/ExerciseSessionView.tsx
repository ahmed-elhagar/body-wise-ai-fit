
import { Exercise } from '@/features/exercise';
import { WorkoutSessionManager } from './WorkoutSessionManager';
import { ActiveExerciseTracker } from './ActiveExerciseTracker';
import { ExerciseCard } from './ExerciseCard';

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
  const activeExercise = exercises.find(ex => ex.id === activeExerciseId);

  return (
    <div className="space-y-4">
      <WorkoutSessionManager
        exercises={exercises}
        onExerciseComplete={onExerciseComplete}
        onExerciseProgressUpdate={onExerciseProgressUpdate}
        onSessionComplete={onSessionComplete}
      />
      
      {activeExercise && (
        <ActiveExerciseTracker
          exercise={activeExercise}
          onComplete={onExerciseComplete}
          onProgressUpdate={onExerciseProgressUpdate}
          onDeactivate={onDeactivate}
        />
      )}
      
      <div className="space-y-4">
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
    </div>
  );
};
