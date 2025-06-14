
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Clock, Flame } from 'lucide-react';

interface ExerciseAnalyticsDashboardProps {
  timeRange: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void;
}

export const ExerciseAnalyticsDashboard = ({ timeRange, onTimeRangeChange }: ExerciseAnalyticsDashboardProps) => {
  // Mock data for demo
  const workoutData = [
    { day: 'Mon', workouts: 1, duration: 45 },
    { day: 'Tue', workouts: 0, duration: 0 },
    { day: 'Wed', workouts: 1, duration: 60 },
    { day: 'Thu', workouts: 1, duration: 40 },
    { day: 'Fri', workouts: 0, duration: 0 },
    { day: 'Sat', workouts: 1, duration: 75 },
    { day: 'Sun', workouts: 0, duration: 0 }
  ];

  const stats = [
    {
      title: 'Total Workouts',
      value: '24',
      change: '+12%',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: 'Avg Duration',
      value: '52 min',
      change: '+5 min',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Calories Burned',
      value: '2,450',
      change: '+18%',
      icon: Flame,
      color: 'text-orange-600'
    },
    {
      title: 'Consistency',
      value: '85%',
      change: '+10%',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.color}`}>{stat.change}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Workout Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Weekly Activity</h3>
          <div className="flex gap-2">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => onTimeRangeChange(range)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={workoutData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="workouts" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
