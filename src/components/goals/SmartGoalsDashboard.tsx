
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Target, Plus, TrendingUp, Calendar, Sparkles, Trophy, AlertTriangle } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import EnhancedGoalCard from "./EnhancedGoalCard";
import GoalProgressRing from "./GoalProgressRing";
import SmartGoalCreationWizard from "./SmartGoalCreationWizard";

const SmartGoalsDashboard = () => {
  const { t } = useLanguage();
  const { goals, isLoading } = useGoals();
  const [showWizard, setShowWizard] = useState(false);

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const overallProgress = goals.length > 0 
    ? goals.reduce((acc, goal) => acc + Math.min(100, (goal.current_value / (goal.target_value || 1)) * 100), 0) / goals.length
    : 0;

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
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            {t('Smart Goals Dashboard')}
          </h2>
          <p className="text-gray-600 mt-1">
            {t('Track your progress and achieve your fitness objectives')}
          </p>
        </div>
        
        <Button
          onClick={() => setShowWizard(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('Create Goal')}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-800">{activeGoals.length}</div>
            <div className="text-sm text-blue-600">{t('Active Goals')}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-800">{completedGoals.length}</div>
            <div className="text-sm text-green-600">{t('Completed')}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-800">{Math.round(overallProgress)}%</div>
            <div className="text-sm text-purple-600">{t('Overall Progress')}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-800">{urgentGoals.length}</div>
            <div className="text-sm text-orange-600">{t('Due This Week')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            {t('Progress Overview')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <GoalProgressRing progress={overallProgress} size={160}>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">{Math.round(overallProgress)}%</div>
                <div className="text-sm text-gray-600">{t('Overall')}</div>
              </div>
            </GoalProgressRing>
          </div>
        </CardContent>
      </Card>

      {/* Urgent Goals Alert */}
      {urgentGoals.length > 0 && (
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              {t('Goals Due This Week')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {urgentGoals.map(goal => (
                <EnhancedGoalCard
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
              {t('Active Goals')} ({activeGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeGoals.map(goal => (
                <EnhancedGoalCard
                  key={goal.id}
                  goal={goal}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center p-12">
          <div className="space-y-4">
            <Target className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-600">{t('No Active Goals')}</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {t('Start your fitness journey by creating your first goal. Our AI will help you set realistic and achievable targets.')}
            </p>
            <Button
              onClick={() => setShowWizard(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t('Create Your First Goal')}
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
              {t('Completed Goals')} ({completedGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedGoals.slice(0, 4).map(goal => (
                <EnhancedGoalCard
                  key={goal.id}
                  goal={goal}
                  showActions={false}
                />
              ))}
            </div>
            {completedGoals.length > 4 && (
              <div className="text-center mt-4">
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  {t('and')} {completedGoals.length - 4} {t('more completed goals')}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Goal Creation Wizard */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <SmartGoalCreationWizard
            onClose={() => setShowWizard(false)}
            onGoalCreated={() => setShowWizard(false)}
          />
        </div>
      )}
    </div>
  );
};

export default SmartGoalsDashboard;
