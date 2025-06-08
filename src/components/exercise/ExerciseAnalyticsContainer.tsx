
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Calendar, Target, Activity } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ExerciseAnalyticsContainerProps {
  weeklyProgress: number;
  monthlyGoal: number;
  completedWorkouts: number;
  totalWorkouts: number;
}

const ExerciseAnalyticsContainer = ({
  weeklyProgress,
  monthlyGoal,
  completedWorkouts,
  totalWorkouts
}: ExerciseAnalyticsContainerProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <TrendingUp className="w-4 h-4" />
            {t('exercise:weeklyProgress') || 'Weekly Progress'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{weeklyProgress}%</div>
            <Progress value={weeklyProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Target className="w-4 h-4" />
            {t('exercise:monthlyGoal') || 'Monthly Goal'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{monthlyGoal}%</div>
            <Progress value={monthlyGoal} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Activity className="w-4 h-4" />
            {t('exercise:completed') || 'Completed'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {completedWorkouts}/{totalWorkouts}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar className="w-4 h-4" />
            {t('exercise:thisWeek') || 'This Week'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5/7</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExerciseAnalyticsContainer;
