import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Target } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";

interface ExerciseHeaderProps {
  workoutName: string;
  estimatedDuration: number;
  estimatedCalories: number;
  muscleGroups: string[];
}

export const ExerciseHeader = ({
  workoutName,
  estimatedDuration,
  estimatedCalories,
  muscleGroups
}: ExerciseHeaderProps) => {
  const { t } = useI18n();

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {workoutName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {estimatedDuration} {t('exercise.minutes')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {estimatedCalories} {t('exercise.calories')}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {t('exercise.muscleGroups')}: {muscleGroups.join(', ')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
