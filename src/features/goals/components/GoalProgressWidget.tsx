import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp } from "lucide-react";
import { GoalProgressRing } from "@/components/goals/GoalProgressRing";
import { useGoals } from "@/features/dashboard/hooks/useGoals";

export const GoalProgressWidget = () => {
  const { goals, isLoading, error } = useGoals();

  if (isLoading) {
    return (
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <Target className="w-5 h-5 text-blue-500" />
            <span>Goals Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-gray-500">Loading goals...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <Target className="w-5 h-5 text-red-500" />
            <span>Goals Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-red-500">Error loading goals: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const activeGoals = goals.filter(goal => goal.status === 'active');

  if (activeGoals.length === 0) {
    return (
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <Target className="w-5 h-5 text-gray-500" />
            <span>Goals Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-gray-500">No active goals</p>
        </CardContent>
      </Card>
    );
  }

  const goal = activeGoals[0]; // Displaying only the first active goal for brevity

  const progress = goal.target_value ? (goal.current_value || 0) / goal.target_value * 100 : 0;
  const roundedProgress = Math.min(100, Math.max(0, progress));

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
          <Target className="w-5 h-5 text-blue-500" />
          <span>Goals Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">{goal.title}</p>
            <p className="text-xs text-gray-500">{goal.description}</p>
          </div>
          <GoalProgressRing progress={roundedProgress} size={50} />
        </div>
        <Progress value={roundedProgress} className="h-2 rounded-full" />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{goal.current_value || 0} / {goal.target_value} {goal.target_unit}</span>
          <span>{roundedProgress.toFixed(0)}%</span>
        </div>
      </CardContent>
    </Card>
  );
};
