
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Calendar, Zap } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
}

interface EnhancedStatsGridProps {
  stats?: Stat[];
}

const EnhancedStatsGrid = ({ stats }: EnhancedStatsGridProps) => {
  const { t } = useI18n();

  const defaultStats: Stat[] = [
    {
      title: t('dashboard:caloriesGoal') || 'Calories Goal',
      value: '1,847',
      change: '+12%',
      trend: 'up',
      icon: Zap
    },
    {
      title: t('dashboard:workoutsCompleted') || 'Workouts',
      value: '15',
      change: '+3',
      trend: 'up',
      icon: Target
    },
    {
      title: t('dashboard:streakDays') || 'Streak',
      value: '7 days',
      change: 'Personal best!',
      trend: 'up',
      icon: Calendar
    },
    {
      title: t('dashboard:weightProgress') || 'Progress',
      value: '2.3 kg',
      change: 'This month',
      trend: 'up',
      icon: TrendingUp
    }
  ];

  const displayStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {displayStats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className={`text-xs flex items-center ${
              stat.trend === 'up' ? 'text-green-600' : 
              stat.trend === 'down' ? 'text-red-600' : 
              'text-gray-500'
            }`}>
              {stat.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
              {stat.change}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedStatsGrid;
