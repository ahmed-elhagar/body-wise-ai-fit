
import { Exercise } from '../types';
import { ExerciseCard } from '@/components/exercise/ExerciseCard';

interface ExerciseListViewProps {
  exercises: Exercise[];
  onExerciseComplete: (exerciseId: string) => Promise<void>;
}

export const ExerciseListView = ({ exercises, onExerciseComplete }: ExerciseListViewProps) => {
  return (
    <div className="space-y-3">
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          onComplete={onExerciseComplete}
          onProgressUpdate={() => Promise.resolve()}
          isActive={false}
          onSetActive={() => {}}
        />
      ))}
    </div>
  );
};
