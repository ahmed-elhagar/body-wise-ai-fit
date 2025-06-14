
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

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <Target className="h-5 w-5 text-blue-600" />
            <span>{t('Goal Progress')}</span>
          </CardTitle>
          {activeGoals.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/goals')}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              {t('View All')}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {activeGoals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm font-medium mb-4">{t('No active goals set')}</p>
            <Button
              onClick={() => navigate('/goals/create')}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('Create Goal')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center my-4">
              <GoalProgressRing progress={overallProgress} size={120} strokeWidth={10}>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">{Math.round(overallProgress)}%</div>
                  <div className="text-sm text-gray-600">{t('Overall')}</div>
                </div>
              </GoalProgressRing>
            </div>
            <div className="space-y-3">
              {activeGoals.map(goal => {
                const progress = calculateProgress(goal);
                return (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-semibold text-gray-700 truncate flex-1 mr-2">
                        {goal.title}
                      </span>
                      <span className="font-bold text-gray-800">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalProgressWidget;
