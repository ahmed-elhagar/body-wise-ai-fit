
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  TrendingUp, 
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGoals } from "@/hooks/useGoals";

export const GoalsProgressSection = () => {
  const navigate = useNavigate();
  const { goals } = useGoals();

  const totalGoals = goals?.length || 0;
  const completedGoals = goals?.filter(g => g.status === 'completed')?.length || 0;
  const activeGoals = goals?.filter(g => g.status === 'active')?.length || 0;
  const overallProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const getGoalStatusColor = (goal: any) => {
    if (goal.status === 'completed') return "bg-green-100 text-green-800";
    
    const deadline = new Date(goal.target_date);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 7) return "bg-red-100 text-red-800";
    if (daysUntilDeadline < 30) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  const getGoalStatusIcon = (goal: any) => {
    if (goal.status === 'completed') return <CheckCircle className="w-4 h-4 text-green-600" />;
    
    const deadline = new Date(goal.target_date);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline < 7) return <AlertTriangle className="w-4 h-4 text-red-600" />;
    return <Clock className="w-4 h-4 text-blue-600" />;
  };

  const calculateGoalProgress = (goal: any) => {
    if (goal.status === 'completed') return 100;
    
    // This would be calculated based on actual progress data
    // For now, we'll use a mock calculation
    const timeElapsed = new Date().getTime() - new Date(goal.created_at || new Date()).getTime();
    const totalTime = new Date(goal.target_date).getTime() - new Date(goal.created_at || new Date()).getTime();
    
    return Math.min(Math.max((timeElapsed / totalTime) * 50, 0), 90); // Mock progress
  };

  return (
    <div className="space-y-6">
      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-blue-900 mb-1">{totalGoals}</div>
            <div className="text-sm text-blue-600">Total Goals</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-green-900 mb-1">{completedGoals}</div>
            <div className="text-sm text-green-600">Completed</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-orange-900 mb-1">{activeGoals}</div>
            <div className="text-sm text-orange-600">In Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <TrendingUp className="w-5 h-5" />
            Overall Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-purple-700 font-medium">Completion Rate</span>
            <Badge className="bg-purple-600 text-white">
              {Math.round(overallProgress)}%
            </Badge>
          </div>
          <Progress value={overallProgress} className="h-3" />
          <div className="text-sm text-purple-600">
            {completedGoals} of {totalGoals} goals completed
          </div>
        </CardContent>
      </Card>

      {/* Active Goals List */}
      {goals && goals.length > 0 && (
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
                onClick={() => navigate('/goals')}
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
                        <p className="text-sm text-gray-600">{goal.description}</p>
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
                      <span>Target: {goal.target_value} {goal.target_unit}</span>
                      <span>Due: {new Date(goal.target_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* No Goals State */}
      {(!goals || goals.length === 0) && (
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-12 text-center">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Goals Set Yet</h3>
            <p className="text-gray-600 mb-6">
              Start your fitness journey by setting your first goal
            </p>
            <Button
              onClick={() => navigate('/goals')}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => navigate('/goals')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Target className="w-4 h-4 mr-2" />
          Manage Goals
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate('/goals/create')}
          className="border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Goal
        </Button>
      </div>
    </div>
  );
};
