import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/hooks/useI18n";

interface ExerciseProgressTrackerProps {
  completedExercises: number;
  totalExercises: number;
}

export const ExerciseProgressTracker = ({ completedExercises, totalExercises }: ExerciseProgressTrackerProps) => {
  const { t } = useI18n();
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{t('exercise.workoutProgress')}</h3>
          <p className="text-sm text-gray-600">
            {t('exercise.completed')} {completedExercises} / {totalExercises} {t('exercise.exercises')}
          </p>
        </div>
        <Badge variant="outline" className="bg-white/80">
          {Math.round(progressPercentage)}%
        </Badge>
      </div>
    </Card>
  );
};
