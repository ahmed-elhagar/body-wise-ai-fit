
import React, { memo, useMemo } from 'react';
import { Exercise } from '@/types/exercise';
import { ExerciseCardEnhanced } from './ExerciseCardEnhanced';
import { RestDayCard } from './RestDayCard';
import { useI18n } from '@/hooks/useI18n';

interface OptimizedExerciseListProps {
  exercises: Exercise[];
  isLoading: boolean;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isRestDay: boolean;
}

export const OptimizedExerciseList = memo(({
  exercises,
  isLoading,
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay
}: OptimizedExerciseListProps) => {
  const { t } = useI18n();

  const sortedExercises = useMemo(() => {
    return [...exercises].sort((a, b) => (a.order_number || 0) - (b.order_number || 0));
  }, [exercises]);

  const exerciseStats = useMemo(() => {
    const total = exercises.length;
    const completed = exercises.filter(ex => ex.completed).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [exercises]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (isRestDay) {
    return <RestDayCard />;
  }

  if (sortedExercises.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('exercise.noExercisesFound')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {exerciseStats.total > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            {t('exercise.progress')}: {exerciseStats.completed}/{exerciseStats.total} ({exerciseStats.percentage}%)
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {sortedExercises.map((exercise, index) => (
          <ExerciseCardEnhanced
            key={exercise.id}
            exercise={exercise}
            index={index}
            onExerciseComplete={onExerciseComplete}
            onExerciseProgressUpdate={onExerciseProgressUpdate}
          />
        ))}
      </div>
    </div>
  );
});

OptimizedExerciseList.displayName = 'OptimizedExerciseList';
