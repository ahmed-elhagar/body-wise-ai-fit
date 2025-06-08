
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import GoalProgressRing from "@/components/goals/GoalProgressRing";

const GoalsOverview = () => {
  const { goals } = useGoals();

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const overallProgress = goals.length > 0 
    ? goals.reduce((acc, goal) => acc + Math.min(100, (goal.current_value / (goal.target_value || 1)) * 100), 0) / goals.length
    : 0;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <GoalProgressRing progress={overallProgress} size={160}>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">{Math.round(overallProgress)}%</div>
              <div className="text-sm text-gray-600">Overall</div>
            </div>
          </GoalProgressRing>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{activeGoals.length}</div>
            <div className="text-sm text-blue-600">Active Goals</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsOverview;
