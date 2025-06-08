
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Calendar, Trophy } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ProgressData {
  totalGoals: number;
  completedGoals: number;
  weeklyProgress: number;
  monthlyProgress: number;
  currentStreak: number;
}

interface ProgressOverviewProps {
  data: ProgressData;
}

const ProgressOverview = ({ data }: ProgressOverviewProps) => {
  const { t } = useI18n();

  const completionRate = (data.completedGoals / data.totalGoals) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {t('dashboard:progressOverview') || 'Progress Overview'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goal Completion */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{t('dashboard:goalCompletion') || 'Goal Completion'}</span>
            </div>
            <span className="text-sm text-gray-600">
              {data.completedGoals}/{data.totalGoals}
            </span>
          </div>
          <Progress value={completionRate} className="h-2" />
          <p className="text-xs text-gray-500">
            {Math.round(completionRate)}% {t('dashboard:completed') || 'completed'}
          </p>
        </div>

        {/* Weekly Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-500" />
              <span className="font-medium">{t('dashboard:weeklyProgress') || 'This Week'}</span>
            </div>
            <span className="text-sm text-gray-600">{data.weeklyProgress}%</span>
          </div>
          <Progress value={data.weeklyProgress} className="h-2" />
        </div>

        {/* Monthly Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span className="font-medium">{t('dashboard:monthlyProgress') || 'This Month'}</span>
            </div>
            <span className="text-sm text-gray-600">{data.monthlyProgress}%</span>
          </div>
          <Progress value={data.monthlyProgress} className="h-2" />
        </div>

        {/* Current Streak */}
        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="font-medium text-yellow-800">
              {t('dashboard:currentStreak') || 'Current Streak'}
            </span>
          </div>
          <span className="text-lg font-bold text-yellow-600">
            {data.currentStreak} {t('dashboard:days') || 'days'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressOverview;
