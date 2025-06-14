import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trash2, Edit, Target } from "lucide-react";
import { useGoals } from "@/features/dashboard/hooks/useGoals";

interface GoalCardProps {
  goal: {
    id: string;
    title: string;
    description?: string;
    status: string;
    goal_type: string;
    category: string;
    target_value?: number;
    current_value?: number;
    target_unit?: string;
    created_at: string;
    updated_at: string;
  };
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onDelete, onEdit }) => {
  const progress = goal.target_value ? (goal.current_value || 0) / goal.target_value * 100 : 0;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-4 h-4 text-green-500" />
          {goal.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">{goal.description || 'No description provided.'}</p>
        <div className="mt-4">
          <Progress value={progress} className="h-2 rounded-full" />
          <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
            <span>{goal.current_value || 0} / {goal.target_value || 'N/A'} {goal.target_unit || ''}</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" size="icon" onClick={() => onEdit(goal.id)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="destructive" size="icon" onClick={() => onDelete(goal.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
