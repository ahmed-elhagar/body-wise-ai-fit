
import { useI18n } from '@/hooks/useI18n';
import { ExerciseViewModeToggle } from './ExerciseViewModeToggle';

interface ExerciseListHeaderProps {
  completedCount: number;
  totalCount: number;
  viewMode: 'session' | 'list';
  onViewModeChange: (mode: 'session' | 'list') => void;
  dailyWorkoutId?: string;
  onAddCustomExercise: () => void;
}

export const ExerciseListHeader = ({
  completedCount,
  totalCount,
  viewMode,
  onViewModeChange,
  dailyWorkoutId,
  onAddCustomExercise
}: ExerciseListHeaderProps) => {
  const { tFrom } = useI18n();
  const t = tFrom('exercise');

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{t('Today\'s Workout')}</h2>
        <p className="text-sm text-gray-600">
          {completedCount}/{totalCount} {t('exercises completed')}
        </p>
      </div>
      
      <ExerciseViewModeToggle
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        dailyWorkoutId={dailyWorkoutId}
        onAddCustomExercise={onAddCustomExercise}
      />
    </div>
  );
};
