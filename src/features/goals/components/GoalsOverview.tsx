import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GoalProgressRing } from "@/components/goals/GoalProgressRing";
import { useGoals } from "@/features/dashboard/hooks/useGoals";

export const GoalsOverview = () => {
  const { goals, isLoading, error } = useGoals();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="h-24 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Goals Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const inProgressGoals = goals.filter(goal => goal.status === 'in progress');

  const overallProgress = goals.length > 0
    ? (completedGoals.length / goals.length) * 100
    : 0;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Goals Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Overall Progress</h3>
            <p className="text-gray-500">
              {completedGoals.length} of {goals.length} goals completed
            </p>
          </div>
          <GoalProgressRing progress={overallProgress} size={80} />
        </div>
        <Progress value={overallProgress} className="h-2" />
      </CardContent>
    </Card>
  );
};
