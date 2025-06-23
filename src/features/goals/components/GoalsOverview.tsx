
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Calendar, TrendingUp } from "lucide-react";
import { useGoals } from "@/features/dashboard/hooks/useGoals";

export const GoalsOverview: React.FC = () => {
  const { goals, isLoading } = useGoals();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const overdue = goals.filter(goal => {
    if (!goal.target_date || goal.status !== 'active') return false;
    return new Date(goal.target_date) < new Date();
  });

  const averageProgress = activeGoals.length > 0 
    ? Math.round(activeGoals.reduce((sum, goal) => {
        const progress = goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0;
        return sum + Math.min(Math.max(progress, 0), 100);
      }, 0) / activeGoals.length)
    : 0;

  const stats = [
    {
      title: "Active Goals",
      value: activeGoals.length,
      icon: Target,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Completed",
      value: completedGoals.length,
      icon: Trophy,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Average Progress",
      value: `${averageProgress}%`,
      icon: TrendingUp,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Overdue",
      value: overdue.length,
      icon: Calendar,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
