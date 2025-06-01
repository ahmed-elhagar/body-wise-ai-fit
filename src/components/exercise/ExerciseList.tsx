import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExerciseCardEnhanced } from './ExerciseCardEnhanced';
import { RestDayCard } from './RestDayCard';
import { useI18n } from "@/hooks/useI18n";
import type { Exercise } from '@/types/exercise';

interface ExerciseListProps {
  exercises: Exercise[];
  isLoading: boolean;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isRestDay: boolean;
}

export const ExerciseList = ({ exercises, isLoading, onExerciseComplete, onExerciseProgressUpdate, isRestDay }: ExerciseListProps) => {
  const { t } = useI18n();

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

  if (exercises.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('exercise.noExercisesFound')}</p>
      </div>
    );
  }

  const exerciseStats = {
    total: exercises.length,
    completed: exercises.filter(ex => ex.completed).length,
    percentage: exercises.length > 0 ? Math.round((exercises.filter(ex => ex.completed).length / exercises.length) * 100) : 0
  };

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
        {exercises.map((exercise, index) => (
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
};
