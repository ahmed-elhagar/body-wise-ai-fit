
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, Calendar, Target } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ExerciseAnalyticsDashboardProps {
  data: any[];
  stats: {
    totalWorkouts: number;
    completionRate: number;
    avgDuration: number;
    caloriesBurned: number;
  };
}

const ExerciseAnalyticsDashboard = ({ data, stats }: ExerciseAnalyticsDashboardProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Activity className="w-4 h-4" />
              {t('exercise:totalWorkouts') || 'Total Workouts'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Target className="w-4 h-4" />
              {t('exercise:completionRate') || 'Completion Rate'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <Progress value={stats.completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="w-4 h-4" />
              {t('exercise:avgDuration') || 'Avg Duration'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDuration}min</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="w-4 h-4" />
              {t('exercise:caloriesBurned') || 'Calories Burned'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.caloriesBurned}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('exercise:progressChart') || 'Progress Chart'}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="workouts" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExerciseAnalyticsDashboard;
