
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Target, Calendar, TrendingUp, MoreVertical, Edit, Trash2, CheckCircle, Play, Pause } from "lucide-react";
import { format } from "date-fns";
import { Goal } from "../types";
import { useGoalMutations } from "../hooks/useGoalMutations";

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onUpdateProgress: (goal: Goal) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete, onUpdateProgress }) => {
  const { updateStatus, isUpdatingStatus } = useGoalMutations();

  const progress = goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGoalTypeIcon = (goalType: string) => {
    const icons = {
      weight_loss: '🔥',
      weight_gain: '💪',
      muscle_gain: '🏋️',
      endurance: '🏃',
      strength: '💯',
      flexibility: '🧘',
      nutrition: '🥗',
      habit: '✅',
      custom: '🎯'
    };
    return icons[goalType as keyof typeof icons] || '🎯';
  };

  const daysLeft = goal.target_date 
    ? Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const handleStatusChange = async (newStatus: 'active' | 'completed' | 'paused') => {
    await updateStatus({
      goalId: goal.id,
      status: newStatus
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl">
              {getGoalTypeIcon(goal.goal_type)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-800 truncate">{goal.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{goal.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(goal.difficulty || 'medium')}>
              {goal.difficulty || 'medium'}
            </Badge>
            <Badge className={getStatusColor(goal.status)}>
              {goal.status}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(goal)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Goal
                </DropdownMenuItem>
                
                {goal.status === 'active' && (
                  <>
                    <DropdownMenuItem onClick={() => onUpdateProgress(goal)}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Update Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange('completed')}
                      disabled={isUpdatingStatus}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange('paused')}
                      disabled={isUpdatingStatus}
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Goal
                    </DropdownMenuItem>
                  </>
                )}
                
                {goal.status === 'paused' && (
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange('active')}
                    disabled={isUpdatingStatus}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Resume Goal
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem 
                  onClick={() => onDelete(goal.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Goal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">
              {goal.current_value} / {goal.target_value} {goal.target_unit}
            </span>
          </div>
          
          <Progress value={clampedProgress} className="h-3" />
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{Math.round(clampedProgress)}% complete</span>
            </div>
            {daysLeft !== null && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {daysLeft > 0 
                    ? `${daysLeft} days left`
                    : daysLeft === 0 
                    ? 'Due today'
                    : `${Math.abs(daysLeft)} days overdue`
                  }
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Goal Details */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="capitalize">{goal.category}</span>
            {goal.target_date && (
              <span>Due: {format(new Date(goal.target_date), 'MMM dd, yyyy')}</span>
            )}
          </div>
          
          {goal.status === 'active' && clampedProgress < 100 && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onUpdateProgress(goal)}
              className="text-xs"
            >
              Update Progress
            </Button>
          )}
        </div>

        {/* Milestones Preview */}
        {goal.milestones && goal.milestones.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-2">Milestones</div>
            <div className="flex gap-1">
              {goal.milestones.slice(0, 3).map((milestone: any, index: number) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
              {goal.milestones.length > 3 && (
                <span className="text-xs text-gray-400 ml-1">
                  +{goal.milestones.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
