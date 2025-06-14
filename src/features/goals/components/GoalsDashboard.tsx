
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Plus, Trophy, AlertTriangle, Sparkles } from "lucide-react";
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
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-2xl border-0 shadow-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
        
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                    Goals Dashboard
                  </h2>
                  <p className="text-white/80 text-lg">
                    Track your progress and achieve your fitness objectives
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <Trophy className="w-4 h-4 mr-2" />
                  {activeGoals.length} Active Goals
                </Badge>
                <Badge className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-white border-0 px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {completedGoals.length} Completed
                </Badge>
              </div>
            </div>
            
            <Button
              onClick={() => setShowCreationDialog(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Goal
            </Button>
          </div>
        </div>
      </div>

      {/* Overview */}
      <GoalsOverview />

      {/* Urgent Goals Alert */}
      {urgentGoals.length > 0 && (
        <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-1">
            <div className="bg-white rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-orange-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  Goals Due This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {urgentGoals.map(goal => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      showActions={false}
                    />
                  ))}
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 ? (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              Active Goals ({activeGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeGoals.map(goal => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl text-center p-12">
          <div className="space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto">
              <Target className="w-12 h-12 text-gray-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Active Goals</h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                Start your fitness journey by creating your first goal. Set realistic and achievable targets.
              </p>
            </div>
            <Button
              onClick={() => setShowCreationDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        </Card>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-1">
            <div className="bg-white rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
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
                  <div className="text-center mt-6">
                    <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 px-4 py-2 text-sm">
                      and {completedGoals.length - 4} more completed goals
                    </Badge>
                  </div>
                )}
              </CardContent>
            </div>
          </div>
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
