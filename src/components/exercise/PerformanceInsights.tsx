
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  Clock, 
  Zap,
  Award,
  Calendar
} from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface PerformanceInsightsProps {
  metrics: PerformanceMetric[];
  weeklyGoals: {
    workouts: { current: number; target: number };
    duration: { current: number; target: number };
    calories: { current: number; target: number };
  };
  achievements: Array<{
    id: string;
    name: string;
    icon: string;
    unlocked: boolean;
    progress?: number;
  }>;
}

const PerformanceInsights = ({ 
  metrics, 
  weeklyGoals, 
  achievements 
}: PerformanceInsightsProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Activity className="w-5 h-5 text-blue-500" />
            {t('exercise:performanceMetrics') || 'Performance Metrics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : metric.trend === 'down' ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <Activity className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {metric.value} {metric.unit}
                </div>
                <div className="text-xs text-gray-500">
                  {metric.change > 0 ? '+' : ''}{metric.change}% {t('exercise:fromLastWeek')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Target className="w-5 h-5 text-green-500" />
            {t('exercise:weeklyGoals') || 'Weekly Goals'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{t('exercise:workouts')}</span>
              </div>
              <span className="text-sm font-medium">
                {weeklyGoals.workouts.current}/{weeklyGoals.workouts.target}
              </span>
            </div>
            <Progress 
              value={(weeklyGoals.workouts.current / weeklyGoals.workouts.target) * 100} 
              className="h-2" 
            />
          </div>

          <div className="space-y-2">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="text-sm">{t('exercise:duration')} ({t('exercise:minutes')})</span>
              </div>
              <span className="text-sm font-medium">
                {weeklyGoals.duration.current}/{weeklyGoals.duration.target}
              </span>
            </div>
            <Progress 
              value={(weeklyGoals.duration.current / weeklyGoals.duration.target) * 100} 
              className="h-2" 
            />
          </div>

          <div className="space-y-2">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-sm">{t('exercise:calories')}</span>
              </div>
              <span className="text-sm font-medium">
                {weeklyGoals.calories.current}/{weeklyGoals.calories.target}
              </span>
            </div>
            <Progress 
              value={(weeklyGoals.calories.current / weeklyGoals.calories.target) * 100} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Award className="w-5 h-5 text-yellow-500" />
            {t('exercise:recentAchievements') || 'Recent Achievements'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.slice(0, 4).map((achievement) => (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border ${
                  achievement.unlocked 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{achievement.name}</h4>
                    {achievement.unlocked ? (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-xs">
                        {t('exercise:unlocked')}
                      </Badge>
                    ) : (
                      achievement.progress !== undefined && (
                        <Progress value={achievement.progress} className="h-1 mt-1" />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceInsights;
