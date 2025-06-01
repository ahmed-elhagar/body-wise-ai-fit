import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Zap } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";

interface CompactWorkoutSummaryProps {
  workoutName: string;
  estimatedDuration: number;
  muscleGroups: string[];
  caloriesBurned: number;
}

export const CompactWorkoutSummary = ({
  workoutName,
  estimatedDuration,
  muscleGroups,
  caloriesBurned
}: CompactWorkoutSummaryProps) => {
  const { t } = useI18n();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{workoutName}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{estimatedDuration} {t('exercise.minutes')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-gray-500" />
            <span>{muscleGroups.join(', ')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-gray-500" />
            <span>{caloriesBurned} {t('exercise.calories')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

