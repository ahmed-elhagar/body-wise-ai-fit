
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface GoalCardProps {
  title: string;
  description: string;
  progress: number;
  target: number;
  unit: string;
  status: 'active' | 'completed' | 'paused';
}

const GoalCard = ({ title, description, progress, target, unit, status }: GoalCardProps) => {
  const progressPercentage = (progress / target) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant={status === 'completed' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress} / {target} {unit}</span>
          </div>
          <Progress value={Math.min(progressPercentage, 100)} />
          <div className="text-xs text-gray-500">
            {Math.round(progressPercentage)}% complete
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
