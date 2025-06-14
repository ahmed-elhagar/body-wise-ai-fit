
import { Button } from "@/components/ui/button";
import { Target, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGoals } from "@/hooks/useGoals";
import { GoalsOverview } from "./goals/GoalsOverview";
import { GoalsProgressChart } from "./goals/GoalsProgressChart";
import { GoalsList } from "./goals/GoalsList";
import { GoalsEmptyState } from "./goals/GoalsEmptyState";

export const GoalsProgressSection = () => {
  const navigate = useNavigate();
  const { goals } = useGoals();

  const totalGoals = goals?.length || 0;
  const completedGoals = goals?.filter(g => g.status === 'completed')?.length || 0;
  const activeGoals = goals?.filter(g => g.status === 'active')?.length || 0;
  const overallProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const handleManageGoals = () => navigate('/goals');
  const handleCreateGoal = () => navigate('/goals/create');

  return (
    <div className="space-y-6">
      {/* Goals Overview */}
      <GoalsOverview 
        totalGoals={totalGoals}
        completedGoals={completedGoals}
        activeGoals={activeGoals}
      />

      {/* Overall Progress */}
      <GoalsProgressChart 
        overallProgress={overallProgress}
        completedGoals={completedGoals}
        totalGoals={totalGoals}
      />

      {/* Active Goals List or Empty State */}
      {goals && goals.length > 0 ? (
        <GoalsList 
          goals={goals}
          onManageGoals={handleManageGoals}
        />
      ) : (
        <GoalsEmptyState onCreateGoal={handleCreateGoal} />
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleManageGoals}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Target className="w-4 h-4 mr-2" />
          Manage Goals
        </Button>
        
        <Button
          variant="outline"
          onClick={handleCreateGoal}
          className="border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Goal
        </Button>
      </div>
    </div>
  );
};
