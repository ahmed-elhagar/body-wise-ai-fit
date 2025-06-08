
import { ListChecks, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
      <div className="flex items-center gap-3">
        <h3 className="font-semibold text-gray-900">
          {t('exercise.todaysWorkout', "Today's Workout")}
        </h3>
        <Badge variant="secondary">
          {completedCount}/{totalCount} {t('exercise.completed', 'completed')}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        {dailyWorkoutId && (
          <Button
            onClick={onAddCustomExercise}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('exercise.addCustom', 'Add Exercise')}
          </Button>
        )}

        <div className="flex items-center border rounded-lg">
          <Button
            onClick={() => onViewModeChange('session')}
            variant={viewMode === 'session' ? 'default' : 'ghost'}
            size="sm"
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {t('exercise.sessionView', 'Session')}
          </Button>
          <Button
            onClick={() => onViewModeChange('list')}
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            className="flex items-center gap-2"
          >
            <ListChecks className="w-4 h-4" />
            {t('exercise.listView', 'List')}
          </Button>
        </div>
      </div>
    </div>
  );
};
