
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Trophy, Calendar, Activity } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ModernProgressSidebarProps {
  currentDay: number;
  completedExercises: number;
  totalExercises: number;
  weeklyProgress: number;
  personalRecords: number;
  streak: number;
}

const ModernProgressSidebar = ({
  currentDay,
  completedExercises,
  totalExercises,
  weeklyProgress,
  personalRecords,
  streak
}: ModernProgressSidebarProps) => {
  const { t, isRTL } = useI18n();

  const dailyProgress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  const getDayName = (dayNumber: number) => {
    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNumber] || 'Day';
  };

  return (
    <div className="space-y-4">
      {/* Today's Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className={`text-lg flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Target className="w-5 h-5 text-blue-500" />
            {getDayName(currentDay)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span>{t('exercise:progress')}</span>
            <span>{completedExercises}/{totalExercises}</span>
          </div>
          <Progress value={dailyProgress} className="h-2" />
          <div className="text-center">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {dailyProgress.toFixed(0)}% {t('exercise:complete')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className={`text-lg flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar className="w-5 h-5 text-green-500" />
            {t('exercise:weeklyStats')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{t('exercise:workouts')}</span>
            </div>
            <Badge variant="outline">{weeklyProgress}/7</Badge>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">{t('exercise:records')}</span>
            </div>
            <Badge variant="outline">{personalRecords}</Badge>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Target className="w-4 h-4 text-orange-500" />
              <span className="text-sm">{t('exercise:streak')}</span>
            </div>
            <Badge variant="outline">{streak} {t('exercise:days')}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Motivation */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl mb-2">🔥</div>
          <p className="text-sm font-medium text-purple-800">
            {t('exercise:keepGoing')}
          </p>
          <p className="text-xs text-purple-600 mt-1">
            {t('exercise:motivationMessage')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernProgressSidebar;
