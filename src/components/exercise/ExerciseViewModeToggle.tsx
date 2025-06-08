
import { Button } from '@/components/ui/button';
import { Timer, List, Plus } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ExerciseViewModeToggleProps {
  viewMode: 'session' | 'list';
  onViewModeChange: (mode: 'session' | 'list') => void;
  dailyWorkoutId?: string;
  onAddCustomExercise: () => void;
}

export const ExerciseViewModeToggle = ({
  viewMode,
  onViewModeChange,
  dailyWorkoutId,
  onAddCustomExercise
}: ExerciseViewModeToggleProps) => {
  const { tFrom } = useI18n();
  const t = tFrom('exercise');

  return (
    <div className="flex items-center gap-2">
      {dailyWorkoutId && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAddCustomExercise}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('Add Exercise')}
        </Button>
      )}
      
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <Button
          variant={viewMode === 'session' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('session')}
          className="text-xs h-8"
        >
          <Timer className="w-3 h-3 mr-1" />
          {t('Session')}
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('list')}
          className="text-xs h-8"
        >
          <List className="w-3 h-3 mr-1" />
          {t('List')}
        </Button>
      </div>
    </div>
  );
};
