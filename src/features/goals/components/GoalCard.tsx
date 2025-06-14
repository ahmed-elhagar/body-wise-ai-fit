
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Calendar, TrendingUp, Edit, Trash2 } from "lucide-react";
import { GoalProgressRing } from './GoalProgressRing';

export interface Goal {
  id: string;
  user_id: string;
  goal_type: string;
  title: string;
  description?: string;
  target_value?: number;
  target_unit?: string;
  current_value: number;
  category: string;
  difficulty: string;
  status: string;
  start_date: string;
  target_date?: string;
  created_at: string;
  updated_at: string;
}

export interface GoalCardProps {
  goal: Goal;
  onDelete: (goalId: string) => void;
  onEdit: (goalId: string) => void;
}

export const GoalCard = ({ goal, onDelete, onEdit }: GoalCardProps) => {
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
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-gray-800">{goal.title}</CardTitle>
            <div className="flex gap-2 mt-1">
              <Badge className={getDifficultyColor(goal.difficulty)}>
                {goal.difficulty}
              </Badge>
              <Badge className={getStatusColor(goal.status)}>
                {goal.status}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(goal.id)}
            className="h-8 w-8 p-0"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(goal.id)}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {goal.description && (
          <p className="text-sm text-gray-600">{goal.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">
                {goal.current_value} / {goal.target_value} {goal.target_unit}
              </span>
            </div>
            <Progress value={clampedProgress} className="h-2" />
          </div>
          
          <div className="ml-4">
            <GoalProgressRing progress={clampedProgress} size={60}>
              <span className="text-xs font-bold text-gray-700">
                {Math.round(clampedProgress)}%
              </span>
            </GoalProgressRing>
          </div>
        </div>
        
        {goal.target_date && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Target: {new Date(goal.target_date).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
