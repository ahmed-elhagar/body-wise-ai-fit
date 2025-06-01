
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Target, ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGoals } from "@/hooks/useGoals";
import GoalProgressRing from "@/components/goals/GoalProgressRing";

const GoalProgressWidget = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { goals, calculateProgress } = useGoals();

  const activeGoals = goals.filter(goal => goal.status === 'active').slice(0, 3);
  const overallProgress = goals.length > 0 
    ? goals.reduce((acc, goal) => acc + calculateProgress(goal), 0) / goals.length
    : 0;

  if (activeGoals.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-blue-600" />
            {t('Goals')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-gray-500 text-sm">
            {t('No active goals set')}
          </div>
          <Button
            onClick={() => navigate('/goals')}
            variant="outline"
            size="sm"
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            <Plus className="w-3 h-3 mr-1" />
            {t('Create Goal')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-blue-600" />
            {t('Goal Progress')}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/goals')}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            {t('View All')}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress Ring */}
        <div className="flex justify-center">
          <GoalProgressRing progress={overallProgress} size={100}>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{Math.round(overallProgress)}%</div>
              <div className="text-xs text-gray-600">{t('Overall')}</div>
            </div>
          </GoalProgressRing>
        </div>

        {/* Individual Goals */}
        <div className="space-y-3">
          {activeGoals.map(goal => {
            const progress = calculateProgress(goal);
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 truncate flex-1 mr-2">
                    {goal.title}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t border-gray-100">
          <Button
            onClick={() => navigate('/goals')}
            variant="ghost"
            size="sm"
            className="w-full justify-center text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            <Target className="w-3 h-3 mr-1" />
            {t('Manage Goals')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalProgressWidget;
