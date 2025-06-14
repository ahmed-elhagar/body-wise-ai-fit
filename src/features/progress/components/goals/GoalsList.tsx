
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, Trophy } from "lucide-react";
import { useGoals } from "@/features/dashboard/hooks/useGoals";

export const GoalsList = () => {
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
            My Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading goals: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeGoals = goals.filter(goal => goal.status === 'active');

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          My Goals ({activeGoals.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeGoals.length > 0 ? (
          <div className="space-y-4">
            {activeGoals.slice(0, 5).map((goal) => {
              const progress = goal.target_value ? (goal.current_value || 0) / goal.target_value * 100 : 0;
              
              return (
                <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{goal.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {goal.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                  <Progress value={progress} className="h-2 mb-2" />
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{goal.current_value || 0} / {goal.target_value} {goal.target_unit}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No active goals</p>
            <p className="text-sm text-gray-500">Set your first goal to start tracking!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
