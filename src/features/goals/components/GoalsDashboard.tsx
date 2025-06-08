
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Plus, Trophy, AlertTriangle } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import GoalCard from "./GoalCard";
import GoalsOverview from "./GoalsOverview";
import GoalCreationDialog from "./GoalCreationDialog";

const GoalsDashboard = () => {
  const { goals, isLoading } = useGoals();
  const [showCreationDialog, setShowCreationDialog] = useState(false);

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');

  const urgentGoals = activeGoals.filter(goal => {
    if (!goal.target_date) return false;
    const daysRemaining = Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysRemaining <= 7 && daysRemaining >= 0;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            Goals Dashboard
          </h2>
          <p className="text-gray-600 mt-1">
            Track your progress and achieve your fitness objectives
          </p>
        </div>
        
        <Button
          onClick={() => setShowCreationDialog(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Goal
        </Button>
      </div>

      {/* Overview */}
      <GoalsOverview />

      {/* Urgent Goals Alert */}
      {urgentGoals.length > 0 && (
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              Goals Due This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {urgentGoals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  showActions={false}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 ? (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Active Goals ({activeGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeGoals.map(goal => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center p-12">
          <div className="space-y-4">
            <Target className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-600">No Active Goals</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Start your fitness journey by creating your first goal. Set realistic and achievable targets.
            </p>
            <Button
              onClick={() => setShowCreationDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        </Card>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Trophy className="w-5 h-5" />
              Completed Goals ({completedGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedGoals.slice(0, 4).map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  showActions={false}
                />
              ))}
            </div>
            {completedGoals.length > 4 && (
              <div className="text-center mt-4">
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  and {completedGoals.length - 4} more completed goals
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Goal Creation Dialog */}
      <GoalCreationDialog
        open={showCreationDialog}
        onOpenChange={setShowCreationDialog}
      />
    </div>
  );
};

export default GoalsDashboard;
