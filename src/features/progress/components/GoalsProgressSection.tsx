import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Calendar } from "lucide-react";
import { useGoals } from "@/features/dashboard/hooks/useGoals";

export const GoalsProgressSection = () => {
  const { goals, isLoading, error } = useGoals();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-red-600" />
            Goals Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading goals data: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const totalGoals = goals.length;
  const progress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-green-600" />
          Goals Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-gray-500">{completedGoals} / {totalGoals}</span>
          </div>
          <Progress value={progress} />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Started Tracking</span>
            <span>
              <Calendar className="w-3 h-3 inline-block mr-1 align-text-bottom" />
              {totalGoals > 0 ? new Date(goals[0].created_at).toLocaleDateString() : 'No goals yet'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
