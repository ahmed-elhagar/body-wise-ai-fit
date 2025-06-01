
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Goal } from '@/types/goal';

interface GoalCardProps {
  goal: Goal;
}

const GoalCard = ({ goal }: GoalCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold">{goal.title}</h3>
        <p className="text-sm text-gray-600">{goal.description}</p>
        <div className="mt-2">
          <span className="text-sm">Progress: {goal.current_value}/{goal.target_value}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
