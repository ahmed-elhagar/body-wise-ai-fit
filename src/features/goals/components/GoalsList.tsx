
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Calendar, TrendingUp } from "lucide-react";
import { useGoals } from "@/features/dashboard/hooks/useGoals";
import { Goal } from "../types";

export const GoalsList = () => {
  const { goals, isLoading } = useGoals();

  // Convert database goals to our Goal type with proper type casting
  const convertedGoals: Goal[] = goals.map(goal => ({
    ...goal,
    status: (goal.status as 'active' | 'completed' | 'paused') || 'active',
    difficulty: (goal.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
    priority: (goal.priority as 'low' | 'medium' | 'high') || 'medium',
    milestones: Array.isArray(goal.milestones) ? goal.milestones.map((m: any) => ({
      id: m.id || crypto.randomUUID(),
      title: m.title || '',
      target_value: m.target_value || 0,
      completed: m.completed || false,
      completed_at: m.completed_at || undefined
    })) : [],
    target_value: goal.target_value || 0,
    current_value: goal.current_value || 0,
    description: goal.description || '',
    notes: goal.notes || '',
    tags: goal.tags || []
  }));

  if (isLoading) {
    return (
      <div className="space-y-4">
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

  if (convertedGoals.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Goals Set</h3>
        <p className="text-gray-600">Create your first goal to start tracking progress.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {convertedGoals.map(goal => {
        const progress = goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0;
        const clampedProgress = Math.min(Math.max(progress, 0), 100);

        const getDifficultyColor = (difficulty: string) => {
          switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'hard': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };

        const getStatusColor = (status: string) => {
          switch (status) {
            case 'active': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'paused': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };

        return (
          <Card key={goal.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{goal.title}</h4>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(goal.difficulty)}>
                    {goal.difficulty}
                  </Badge>
                  <Badge className={getStatusColor(goal.status)}>
                    {goal.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">
                    {goal.current_value} / {goal.target_value} {goal.target_unit}
                  </span>
                </div>
                
                <Progress value={clampedProgress} className="h-2" />
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{Math.round(clampedProgress)}% complete</span>
                  </div>
                  {goal.target_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Due: {new Date(goal.target_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
