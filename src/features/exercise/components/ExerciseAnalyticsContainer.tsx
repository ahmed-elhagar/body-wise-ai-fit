import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Calendar,
  TrendingUp,
  Target,
  Trophy,
  Activity,
  Clock,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Exercise } from '@/features/exercise/types';

interface ExerciseAnalyticsContainerProps {
  exercises: Exercise[];
}

export const ExerciseAnalyticsContainer = ({ exercises }: ExerciseAnalyticsContainerProps) => {
  const { t } = useLanguage();
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'year'>('week');

  // Mock data for demonstration
  const exerciseData = useMemo(() => {
    return exercises.map((exercise, index) => ({
      name: exercise.name,
      sets: exercise.sets || 3,
      reps: parseInt(exercise.reps || '10', 10),
      completed: exercise.completed ? 1 : 0,
      difficulty: index % 3 + 1, // Mock difficulty level
      caloriesBurned: (exercise.sets || 3) * 50, // Mock calorie calculation
    }));
  }, [exercises]);

  const totalExercises = exerciseData.length;
  const completedExercises = exerciseData.filter(e => e.completed).length;
  const completionRate = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  const averageSets = useMemo(() => {
    const totalSets = exerciseData.reduce((sum, exercise) => sum + exercise.sets, 0);
    return totalExercises > 0 ? totalSets / totalExercises : 0;
  }, [exerciseData, totalExercises]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const muscleGroupData = useMemo(() => {
    const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core']; // Example muscle groups
    return muscleGroups.map((group, index) => ({
      name: group,
      value: Math.floor(Math.random() * 100), // Mock data
      color: COLORS[index % COLORS.length],
    }));
  }, []);

  const handleTimePeriodChange = (period: 'week' | 'month' | 'year') => {
    setTimePeriod(period);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              {t('Exercise Analytics')}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={timePeriod === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTimePeriodChange('week')}
              >
                {t('Week')}
              </Button>
              <Button
                variant={timePeriod === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTimePeriodChange('month')}
              >
                {t('Month')}
              </Button>
              <Button
                variant={timePeriod === 'year' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTimePeriodChange('year')}
              >
                {t('Year')}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{t('Track your workout progress and performance')}</p>
        </CardContent>
      </Card>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              {t('Total Exercises')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalExercises}</div>
            <p className="text-sm text-gray-600">{t('Exercises in this period')}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              {t('Completion Rate')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{completionRate.toFixed(1)}%</div>
            <p className="text-sm text-gray-600">{t('Exercises completed')}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              {t('Average Sets')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{averageSets.toFixed(1)}</div>
            <p className="text-sm text-gray-600">{t('Per workout session')}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-600" />
              {t('Best Streak')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">7 {t('days')}</div>
            <p className="text-sm text-gray-600">{t('Current workout streak')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exercise Completion Chart */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>{t('Exercise Completion')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={exerciseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Muscle Group Distribution */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>{t('Muscle Group Distribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  isAnimationActive={false}
                  data={muscleGroupData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {muscleGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Workout Log (Example) */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>{t('Workout Log')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Exercise')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Sets')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Reps')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Calories Burned')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exerciseData.map((exercise, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{exercise.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{exercise.sets}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{exercise.reps}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{exercise.caloriesBurned}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
