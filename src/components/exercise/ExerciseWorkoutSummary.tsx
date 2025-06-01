import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/hooks/useI18n";

interface ExerciseWorkoutSummaryProps {
  todaysWorkouts: any[];
  currentProgram: any;
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  workoutType: "home" | "gym";
  selectedDay: number;
  isRestDay?: boolean;
}

export const ExerciseWorkoutSummary = ({
  todaysWorkouts,
  currentProgram,
  completedExercises,
  totalExercises,
  progressPercentage,
  workoutType,
  selectedDay,
  isRestDay = false
}: ExerciseWorkoutSummaryProps) => {
  const { t } = useI18n();

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold">
        {t('exercise.todaysWorkout')}
      </h3>
      <p className="text-sm text-gray-500">
        {t('exercise.day')} {selectedDay}
      </p>
      <Badge>
        {workoutType === "home" ? t('exercise.homeWorkout') : t('exercise.gymWorkout')}
      </Badge>
    </Card>
  );
};
