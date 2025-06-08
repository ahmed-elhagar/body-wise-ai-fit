
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface Goal {
  id: string;
  title: string;
  progress: number;
  target: number;
  goalType: 'weight' | 'exercise' | 'nutrition' | 'habit';
  deadline?: string;
  description?: string;
}

interface SmartGoalsDashboardProps {
  goals: Goal[];
  onUpdateGoal?: (goalId: string, progress: number) => void;
}

const SmartGoalsDashboard = ({ goals = [], onUpdateGoal }: SmartGoalsDashboardProps) => {
  const { t, isRTL } = useI18n();

  const getGoalIcon = (goalType: string) => {
    switch (goalType) {
      case 'weight':
        return Target;
      case 'exercise':
        return Trophy;
      case 'nutrition':
        return Calendar;
      case 'habit':
        return TrendingUp;
      default:
        return Target;
    }
  };

  const getGoalColor = (goalType: string) => {
    switch (goalType) {
      case 'weight':
        return 'bg-blue-500';
      case 'exercise':
        return 'bg-green-500';
      case 'nutrition':
        return 'bg-orange-500';
      case 'habit':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'text-green-600';
    if (progress >= 75) return 'text-blue-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!goals || goals.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('goals:noGoals') || 'No Goals Set'}
          </h3>
          <p className="text-gray-600">
            {t('goals:createFirstGoal') || 'Create your first goal to start tracking your progress'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const Icon = getGoalIcon(goal.goalType);
          const progressPercentage = Math.min((goal.progress / goal.target) * 100, 100);
          
          return (
            <Card key={goal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-12 h-12 ${getGoalColor(goal.goalType)} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {goal.goalType}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 mt-3">
                  {goal.title}
                </CardTitle>
                {goal.description && (
                  <p className="text-sm text-gray-600">{goal.description}</p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <div className={`flex justify-between items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className={`text-lg font-bold ${getProgressColor(progressPercentage)}`}>
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <div className={`flex justify-between items-center mt-2 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{goal.progress}</span>
                    <span>{goal.target}</span>
                  </div>
                </div>
                
                {goal.deadline && (
                  <div className={`flex items-center gap-2 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="w-4 h-4" />
                    <span>{t('goals:deadline')}: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SmartGoalsDashboard;
