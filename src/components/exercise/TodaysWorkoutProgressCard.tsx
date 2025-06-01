import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Target, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from "@/hooks/useI18n";

interface TodaysWorkoutProgressCardProps {
  completedExercises: number;
  totalExercises: number;
  estimatedDuration: number;
  estimatedCalories: number;
}

export const TodaysWorkoutProgressCard = ({
  completedExercises,
  totalExercises,
  estimatedDuration,
  estimatedCalories
}: TodaysWorkoutProgressCardProps) => {
  const { t } = useI18n();
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4" />
          {t('exercise.todaysWorkout')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              {t('exercise.exercises')}
            </span>
            <span className="font-medium">{completedExercises} / {totalExercises}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {t('exercise.duration')}
            </span>
            <span className="font-medium">{estimatedDuration} min</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center gap-1">
              <Target className="w-3 h-3" />
              {t('mealPlan.calories')}
            </span>
            <span className="font-medium">{estimatedCalories}</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold text-fitness-primary">{progressPercentage.toFixed(0)}%</p>
          <p className="text-xs text-gray-500">Workout Complete</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysWorkoutProgressCard;
