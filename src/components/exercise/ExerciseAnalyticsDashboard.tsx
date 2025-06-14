
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Target,
  Activity,
  Clock,
  Zap,
  Award
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ExerciseAnalyticsDashboardProps {
  timeRange: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void;
}

export const ExerciseAnalyticsDashboard = ({ timeRange, onTimeRangeChange }: ExerciseAnalyticsDashboardProps) => {
  const { t } = useLanguage();

  // Mock data - in real app, fetch from Supabase
  const workoutFrequencyData = [
    { date: '2024-01-01', workouts: 3 },
    { date: '2024-01-02', workouts: 0 },
    { date: '2024-01-03', workouts: 4 },
    { date: '2024-01-04', workouts: 2 },
    { date: '2024-01-05', workouts: 5 },
    { date: '2024-01-06', workouts: 3 },
    { date: '2024-01-07', workouts: 0 }
  ];

  const volumeProgressData = [
    { week: 'Week 1', volume: 1200 },
    { week: 'Week 2', volume: 1350 },
    { week: 'Week 3', volume: 1480 },
    { week: 'Week 4', volume: 1620 }
  ];

  const muscleGroupData = [
    { name: 'Chest', sessions: 8 },
    { name: 'Back', sessions: 6 },
    { name: 'Legs', sessions: 10 },
    { name: 'Arms', sessions: 7 },
    { name: 'Core', sessions: 9 }
  ];

  const analyticsStats = [
    {
      title: t('Total Workouts'),
      value: '28',
      change: '+12%',
      changeType: 'positive' as const,
      icon: <Calendar className="w-4 h-4" />
    },
    {
      title: t('Training Volume'),
      value: '1,620kg',
      change: '+35%',
      changeType: 'positive' as const,
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      title: t('Average Duration'),
      value: '52min',
      change: '+8%',
      changeType: 'positive' as const,
      icon: <Clock className="w-4 h-4" />
    },
    {
      title: t('Personal Records'),
      value: '5',
      change: '+2',
      changeType: 'positive' as const,
      icon: <Award className="w-4 h-4" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">{t('Exercise Analytics')}</h2>
        </div>
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange(range)}
            >
              {range === '7d' && t('7 Days')}
              {range === '30d' && t('30 Days')}
              {range === '90d' && t('3 Months')}
              {range === '1y' && t('1 Year')}
            </Button>
          ))}
        </div>
      </div>

      {/* Analytics Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsStats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                {stat.icon}
                <span className="text-sm font-medium">{stat.title}</span>
              </div>
              <Badge 
                variant={stat.changeType === 'positive' ? 'default' : 'secondary'}
                className={stat.changeType === 'positive' ? 'bg-green-600' : 'bg-red-600'}
              >
                {stat.change}
              </Badge>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="frequency" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="frequency" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            {t('Frequency')}
          </TabsTrigger>
          <TabsTrigger value="volume" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {t('Volume')}
          </TabsTrigger>
          <TabsTrigger value="muscle-groups" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            {t('Muscle Groups')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="frequency">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t('Workout Frequency')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={workoutFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="workouts" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="volume">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t('Training Volume Progress')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volumeProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="muscle-groups">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t('Muscle Group Distribution')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={muscleGroupData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="sessions" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
