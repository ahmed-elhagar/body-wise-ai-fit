
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Calendar, Award } from "lucide-react";
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

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const totalGoals = goals.length;
  const overallProgress = totalGoals > 0 ? (completedGoals.length / totalGoals) * 100 : 0;

  const avgActiveProgress = activeGoals.length > 0 
    ? activeGoals.reduce((sum, goal) => {
        const progress = goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0;
        return sum + Math.min(progress, 100);
      }, 0) / activeGoals.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Goals Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-blue-600 text-sm font-medium">Total Goals</p>
              <p className="text-2xl font-bold text-blue-900">{totalGoals}</p>
              <p className="text-xs text-blue-600">All time</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-green-600 text-sm font-medium">Active Goals</p>
              <p className="text-2xl font-bold text-green-900">{activeGoals.length}</p>
              <p className="text-xs text-green-600">In progress</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-purple-600 text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold text-purple-900">{completedGoals.length}</p>
              <p className="text-xs text-purple-600">Achieved</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-orange-600 text-sm font-medium">Success Rate</p>
              <p className="text-2xl font-bold text-orange-900">{Math.round(overallProgress)}%</p>
              <p className="text-xs text-orange-600">Overall</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Goal Completion Rate</span>
              <span className="text-sm text-gray-500">{completedGoals.length} / {totalGoals}</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Goals Journey</span>
              <span>
                <Calendar className="w-3 h-3 inline-block mr-1 align-text-bottom" />
                {totalGoals > 0 ? new Date(goals[0].created_at).toLocaleDateString() : 'No goals yet'}
              </span>
            </div>
          </div>

          {activeGoals.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Active Goals Average Progress</span>
                <span className="text-sm text-gray-500">{Math.round(avgActiveProgress)}%</span>
              </div>
              <Progress value={avgActiveProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Goals Details */}
      {activeGoals.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Active Goals Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeGoals.slice(0, 5).map((goal) => {
                const progress = goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0;
                const clampedProgress = Math.min(Math.max(progress, 0), 100);
                
                return (
                  <div key={goal.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">{goal.title}</h4>
                      <span className="text-sm text-gray-500">{Math.round(clampedProgress)}%</span>
                    </div>
                    {goal.description && (
                      <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          {goal.current_value} / {goal.target_value} {goal.target_unit}
                        </span>
                      </div>
                      <Progress value={clampedProgress} className="h-2" />
                      {goal.target_date && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>Target: {new Date(goal.target_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              Recently Completed Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedGoals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800">{goal.title}</h4>
                      <p className="text-sm text-green-600">
                        Completed: {new Date(goal.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-green-700 font-medium">✓ Done</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {totalGoals === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Goals Set</h3>
            <p className="text-gray-600 mb-4">Create your first goal to start tracking progress.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
