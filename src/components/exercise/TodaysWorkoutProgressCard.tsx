
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Target } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface TodaysWorkoutProgressCardProps {
  completedExercises: number;
  totalExercises: number;
  timeElapsed: number;
  estimatedDuration: number;
}

export const TodaysWorkoutProgressCard = ({
  completedExercises,
  totalExercises,
  timeElapsed,
  estimatedDuration
}: TodaysWorkoutProgressCardProps) => {
  const { t, isRTL } = useI18n();

  const exerciseProgress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
  const timeProgress = estimatedDuration > 0 ? (timeElapsed / estimatedDuration) * 100 : 0;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 text-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Target className="w-5 h-5 text-blue-600" />
          {t('exercise:workoutProgress') || 'Workout Progress'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-sm font-medium text-gray-700">
              {t('exercise:exercisesCompleted') || 'Exercises Completed'}
            </span>
            <span className="text-sm text-gray-600">
              {completedExercises}/{totalExercises}
            </span>
          </div>
          <Progress value={exerciseProgress} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-sm font-medium text-gray-700">
              {t('exercise:timeProgress') || 'Time Progress'}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(timeElapsed)}m / {estimatedDuration}m
            </span>
          </div>
          <Progress value={timeProgress} className="h-2" />
        </div>

        <div className={`flex items-center justify-center gap-4 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">{exerciseProgress.toFixed(0)}% {t('exercise:complete') || 'Complete'}</span>
          </div>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">{Math.round(timeElapsed)} {t('exercise:minutes') || 'min'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysWorkoutProgressCard;
