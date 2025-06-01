import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useI18n } from "@/hooks/useI18n";

interface ExerciseListProps {
  exercises: any[];
  isLoading: boolean;
  onExerciseComplete: (exerciseId: string) => void;
}

const ExerciseList = ({ exercises, isLoading, onExerciseComplete }: ExerciseListProps) => {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <div className="lg:col-span-3">
        <div className="text-center py-12">
          <div className="w-10 h-10 animate-spin border-4 border-health-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-health-text-secondary text-lg font-medium">{t('exercise.loadingExercises')}</p>
        </div>
      </div>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="lg:col-span-3">
        <Card className="p-12 bg-white border border-health-border shadow-sm text-center rounded-2xl">
          <h3 className="text-xl font-semibold text-health-text-primary mb-2">
            {t('exercise.noExercisesToday')}
          </h3>
          <p className="text-health-text-secondary">
            {t('exercise.selectDifferentDay')}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-health-text-primary">
          {t('exercise.todaysWorkout')}
        </h2>
        <Badge variant="outline" className="bg-health-primary text-white border-health-primary px-3 py-1">
          {exercises.length} {exercises.length === 1 ? t('exercise.exercise') : t('exercise.exercises')}
        </Badge>
      </div>

      <div className="space-y-4">
        {exercises.map((exercise) => (
          <Card key={exercise.id} className="p-6 bg-white border border-health-border shadow-sm rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-health-soft text-health-primary">
                  {exercise.order_number}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-health-text-primary">
                    {exercise.name}
                  </h3>
                  <p className="text-health-text-secondary">
                    {exercise.sets} sets × {exercise.reps} reps
                  </p>
                </div>
              </div>
              <Checkbox 
                id={`exercise-${exercise.id}`}
                onCheckedChange={() => onExerciseComplete(exercise.id)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExerciseList;
