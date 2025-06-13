
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  CheckCircle,
  Clock,
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import type { Goal } from "@/hooks/useGoals";

interface GoalsListProps {
  goals: Goal[];
  onManageGoals: () => void;
}

export const GoalsList = ({ goals, onManageGoals }: GoalsListProps) => {
  const getGoalStatusColor = (goal: Goal) => {
    if (goal.status === 'completed') return "bg-green-100 text-green-800";
    
    if (!goal.target_date) return "bg-blue-100 text-blue-800";
    
    const deadline = new Date(goal.target_date);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 7) return "bg-red-100 text-red-800";
    if (daysUntilDeadline < 30) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  const getGoalStatusIcon = (goal: Goal) => {
    if (goal.status === 'completed') return <CheckCircle className="w-4 h-4 text-green-600" />;
    
    if (!goal.target_date) return <Clock className="w-4 h-4 text-blue-600" />;
    
    const deadline = new Date(goal.target_date);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 7) return <AlertTriangle className="w-4 h-4 text-red-600" />;
    return <Clock className="w-4 h-4 text-blue-600" />;
  };

  const calculateGoalProgress = (goal: Goal) => {
    if (goal.status === 'completed') return 100;
    
    const timeElapsed = new Date().getTime() - new Date(goal.created_at || new Date()).getTime();
    const totalTime = goal.target_date ? 
      new Date(goal.target_date).getTime() - new Date(goal.created_at || new Date()).getTime() :
      1000 * 60 * 60 * 24 * 30; // Default to 30 days if no target date
    
    return Math.min(Math.max((timeElapsed / totalTime) * 50, 0), 90);
  };

  if (!goals || goals.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Your Goals
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onManageGoals}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            Manage Goals
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.slice(0, 5).map((goal, index) => {
          const progress = calculateGoalProgress(goal);
          
          return (
            <div key={goal.id || index} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {getGoalStatusIcon(goal)}
                  <div>
                    <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                    {goal.description && (
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    )}
                  </div>
                </div>
                <Badge className={getGoalStatusColor(goal)}>
                  {goal.status === 'completed' ? 'Completed' : 'Active'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Target: {goal.target_value} {goal.target_unit || 'units'}</span>
                  <span>Due: {goal.target_date ? new Date(goal.target_date).toLocaleDateString() : 'No deadline'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
