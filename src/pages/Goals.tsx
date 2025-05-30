
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import WeightGoalCard from "@/components/goals/WeightGoalCard";
import MacroGoalsCard from "@/components/goals/MacroGoalsCard";
import ProgressBadges from "@/components/goals/ProgressBadges";
import GoalHistoryTimeline from "@/components/goals/GoalHistoryTimeline";
import { useGoals } from "@/hooks/useGoals";

const Goals = () => {
  const { t } = useLanguage();
  const { goals, isLoading } = useGoals();

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-64 bg-gray-200 rounded"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Target className="h-8 w-8 text-blue-600" />
                  {t('Goals')}
                </h1>
                <p className="text-gray-600 mt-1">
                  Set and track your fitness goals
                </p>
              </div>
              <ProgressBadges />
            </div>

            {/* Goal Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeightGoalCard />
              <MacroGoalsCard />
            </div>

            {/* Goal History Timeline */}
            <GoalHistoryTimeline />

            {/* Empty State */}
            {goals.length === 0 && (
              <Card className="p-12 bg-white/80 backdrop-blur-sm text-center">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Goals Set Yet</h3>
                <p className="text-gray-500 mb-6">Start your fitness journey by setting your first goal</p>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Popular goals to get started:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button variant="outline" size="sm">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Lose 5kg in 3 months
                    </Button>
                    <Button variant="outline" size="sm">
                      <Target className="w-4 h-4 mr-2" />
                      Eat 100g protein daily
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Goals;
