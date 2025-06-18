
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, ArrowRight } from "lucide-react";
import { Goal } from "@/hooks/useGoals";
import GoalCard from "@/features/goals/components/GoalCard";

interface GoalsListProps {
  goals: Goal[];
  onManageGoals: () => void;
}

export const GoalsList = ({ goals, onManageGoals }: GoalsListProps) => {
  const activeGoals = goals.filter(goal => goal.status === 'active').slice(0, 3);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Active Goals
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onManageGoals}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            View All
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeGoals.map(goal => (
          <GoalCard 
            key={goal.id} 
            goal={goal} 
            showActions={false}
          />
        ))}
        
        {goals.length > 3 && (
          <div className="text-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onManageGoals}
              className="text-blue-600 hover:text-blue-800"
            >
              View {goals.length - 3} more goals
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
