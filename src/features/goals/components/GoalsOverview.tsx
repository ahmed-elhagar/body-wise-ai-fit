import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Trophy, Calendar } from "lucide-react";
import GoalProgressRing from "./GoalProgressRing";
import GoalCard from "./GoalCard";
import { useI18n } from "@/hooks/useI18n";

interface GoalsOverviewProps {
  // Define any props here
}

const GoalsOverview: React.FC<GoalsOverviewProps> = () => {
  const { tFrom } = useI18n();
  const tGoals = tFrom('goals');

  // Example data for goals
  const goals = [
    { id: 1, title: String(tGoals('calorieGoal')), target: 2000, current: 1500, unit: 'cal' },
    { id: 2, title: String(tGoals('proteinGoal')), target: 150, current: 120, unit: 'g' },
    { id: 3, title: String(tGoals('exerciseDays')), target: 5, current: 3, unit: 'days' },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{String(tGoals('yourProgress'))}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{String(tGoals('weeklySummary'))}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">{String(tGoals('noDataAvailable'))}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsOverview;
