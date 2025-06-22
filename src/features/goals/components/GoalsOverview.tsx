
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Calendar, Award } from "lucide-react";
import { useGoals } from "@/features/dashboard/hooks/useGoals";
import { GoalProgressRing } from './GoalProgressRing';

export const GoalsOverview = () => {
  const { goals, isLoading } = useGoals();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const totalProgress = activeGoals.length > 0 
    ? activeGoals.reduce((sum, goal) => {
        const progress = goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0;
        return sum + Math.min(progress, 100);
      }, 0) / activeGoals.length 
    : 0;

  const overviewStats = [
    {
      title: 'Active Goals',
      value: activeGoals.length,
      icon: Target,
      color: 'blue',
      description: 'Currently working on'
    },
    {
      title: 'Completed Goals',
      value: completedGoals.length,
      icon: Award,
      color: 'green',
      description: 'Successfully achieved'
    },
    {
      title: 'Average Progress',
      value: `${Math.round(totalProgress)}%`,
      icon: TrendingUp,
      color: 'purple',
      description: 'Overall completion rate'
    }
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Goals Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {overviewStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center space-y-3">
                <div className={`w-16 h-16 bg-${stat.color}-100 rounded-2xl flex items-center justify-center mx-auto`}>
                  <IconComponent className={`w-8 h-8 text-${stat.color}-600`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-700">{stat.title}</div>
                  <div className="text-xs text-gray-500">{stat.description}</div>
                </div>
              </div>
            );
          })}
        </div>

        {activeGoals.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">Recent Active Goals</h4>
              <div className="text-sm text-gray-500">{activeGoals.length} total</div>
            </div>
            <div className="space-y-3">
              {activeGoals.slice(0, 3).map(goal => {
                const progress = goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0;
                const clampedProgress = Math.min(Math.max(progress, 0), 100);
                
                return (
                  <div key={goal.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-700">{goal.title}</span>
                        <span className="text-sm text-gray-500">{Math.round(clampedProgress)}%</span>
                      </div>
                      <Progress value={clampedProgress} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
