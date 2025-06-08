
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Plus } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ExerciseEmptyStateProps {
  dailyWorkoutId?: string;
  onAddCustomExercise: () => void;
}

export const ExerciseEmptyState = ({ 
  dailyWorkoutId, 
  onAddCustomExercise 
}: ExerciseEmptyStateProps) => {
  const { t } = useI18n();

  return (
    <Card className="p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Timer className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No exercises for today
        </h3>
        <p className="text-gray-600 mb-4">
          Add some exercises to get started with your workout
        </p>
        
        {dailyWorkoutId && (
          <Button
            onClick={onAddCustomExercise}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Custom Exercise
          </Button>
        )}
      </div>
    </Card>
  );
};
