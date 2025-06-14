
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGoals } from "@/features/dashboard/hooks/useGoals";
import { GoalProgressRing } from './GoalProgressRing';

export const GoalProgressWidget = () => {
  const navigate = useNavigate();
  const { goals, isLoading } = useGoals();

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-pulse">
        <CardContent className="p-6">
          <div className="h-24 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const recentGoal = activeGoals[0];

  if (!recentGoal) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">No Active Goals</h3>
          <p className="text-sm text-gray-600 mb-4">Set your first goal to start tracking progress</p>
          <Button 
            onClick={() => navigate('/goals')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Goal
          </Button>
        </CardContent>
      </Card>
    );
  }

  const progress = recentGoal.target_value ? (recentGoal.current_value / recentGoal.target_value) * 100 : 0;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Goal Progress
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/goals')}
          >
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-1">{recentGoal.title}</h4>
            <p className="text-sm text-gray-600 mb-3">
              {recentGoal.current_value} / {recentGoal.target_value} {recentGoal.target_unit}
            </p>
            
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${clampedProgress}%` }}
                  />
                </div>
              </div>
              <GoalProgressRing progress={clampedProgress} size={50}>
                <span className="text-xs font-bold text-gray-700">
                  {Math.round(clampedProgress)}%
                </span>
              </GoalProgressRing>
            </div>
          </div>
        </div>

        {activeGoals.length > 1 && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {activeGoals.length - 1} more active goal{activeGoals.length > 2 ? 's' : ''}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/goals')}
                className="text-blue-600 hover:text-blue-700"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                View All
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalProgressWidget;
