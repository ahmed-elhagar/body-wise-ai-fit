
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Activity } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ExerciseProgressTrackerProps {
  completedExercises: number;
  totalExercises: number;
  weeklyGoal: number;
  currentWeekProgress: number;
}

const ExerciseProgressTracker = ({
  completedExercises,
  totalExercises,
  weeklyGoal,
  currentWeekProgress
}: ExerciseProgressTrackerProps) => {
  const { t, isRTL } = useI18n();

  const dailyProgress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
  const weeklyProgress = weeklyGoal > 0 ? (currentWeekProgress / weeklyGoal) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Activity className="w-5 h-5 text-blue-500" />
          {t('exercise:progressTracker') || 'Progress Tracker'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span>{t('exercise:todayProgress') || 'Today\'s Progress'}</span>
            <span>{completedExercises}/{totalExercises}</span>
          </div>
          <Progress value={dailyProgress} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span>{t('exercise:weeklyGoal') || 'Weekly Goal'}</span>
            <span>{currentWeekProgress}/{weeklyGoal}</span>
          </div>
          <Progress value={weeklyProgress} className="h-2" />
        </div>
        
        <div className={`flex items-center justify-center gap-2 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium">{dailyProgress.toFixed(0)}% {t('exercise:complete') || 'Complete'}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseProgressTracker;
