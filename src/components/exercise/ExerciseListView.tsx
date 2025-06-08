
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Exercise } from '@/types/exercise';
import { useI18n } from '@/hooks/useI18n';

interface ExerciseListViewProps {
  exercises: Exercise[];
  onExerciseComplete: (exerciseId: string) => Promise<void>;
}

export const ExerciseListView = ({ exercises, onExerciseComplete }: ExerciseListViewProps) => {
  const { tFrom } = useI18n();
  const t = tFrom('exercise');

  return (
    <div className="space-y-3">
      {exercises.map((exercise, index) => (
        <Card key={exercise.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                exercise.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                <div className="text-sm text-gray-600">
                  {exercise.sets} {t('sets')} × {exercise.reps} {t('reps')}
                  {exercise.equipment && (
                    <span className="ml-2 text-blue-600">• {exercise.equipment}</span>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant={exercise.completed ? "default" : "outline"}
              size="sm"
              onClick={() => onExerciseComplete(exercise.id)}
              className={exercise.completed ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {exercise.completed ? t('Completed') : t('Mark Complete')}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
