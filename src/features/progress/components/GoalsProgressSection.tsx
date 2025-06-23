
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus, TrendingUp } from "lucide-react";
import { useGoals } from "@/features/dashboard/hooks/useGoals";
import { useNavigate } from 'react-router-dom';
import { GoalsEmptyState } from './goals/GoalsEmptyState';

const GoalsProgressSection = () => {
  const { goals, isLoading } = useGoals();
  const navigate = useNavigate();

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');

  const recentGoals = activeGoals.slice(0, 3);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (goals.length === 0) {
    return <GoalsEmptyState />;
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Goals Progress
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/goals')}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{activeGoals.length}</div>
              <div className="text-sm text-blue-500">Active Goals</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
              <div className="text-sm text-green-500">Completed</div>
            </div>
          </div>

          {/* Recent Goals */}
          {recentGoals.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Recent Goals</h4>
              {recentGoals.map(goal => {
                const progress = goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0;
                const clampedProgress = Math.min(Math.max(progress, 0), 100);

                return (
                  <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-800 truncate">{goal.title}</h5>
                      <span className="text-sm text-gray-500">{Math.round(clampedProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${clampedProgress}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {goal.current_value} / {goal.target_value} {goal.target_unit}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View All Button */}
          <Button
            variant="outline"
            className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
            onClick={() => navigate('/goals')}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View All Goals
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsProgressSection;
