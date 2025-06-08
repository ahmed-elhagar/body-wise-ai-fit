
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  progress: number;
}

interface GoalProgressWidgetProps {
  goals?: Goal[];
}

const GoalProgressWidget = ({ goals }: GoalProgressWidgetProps) => {
  const { t, isRTL } = useI18n();

  // Default goals if none provided
  const defaultGoals: Goal[] = [
    {
      id: '1',
      title: t('goals:weightLoss') || 'Weight Loss',
      current: 2.3,
      target: 5,
      unit: 'kg',
      progress: 46
    },
    {
      id: '2',
      title: t('goals:workoutGoal') || 'Weekly Workouts',
      current: 4,
      target: 5,
      unit: 'sessions',
      progress: 80
    },
    {
      id: '3',
      title: t('goals:stepsGoal') || 'Daily Steps',
      current: 8500,
      target: 10000,
      unit: 'steps',
      progress: 85
    }
  ];

  const displayGoals = goals || defaultGoals;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right font-arabic' : 'text-left'}`}>
          <Target className="w-5 h-5 text-blue-600" />
          {t('dashboard:goalProgress') || 'Goal Progress'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayGoals.map((goal) => (
          <div key={goal.id} className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h4 className="font-medium text-gray-900">{goal.title}</h4>
              <div className={`flex items-center gap-1 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TrendingUp className="w-3 h-3" />
                <span>{goal.current} / {goal.target} {goal.unit}</span>
              </div>
            </div>
            <Progress value={goal.progress} className="h-2" />
            <p className="text-xs text-gray-500">
              {goal.progress}% {t('common:complete') || 'complete'}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default GoalProgressWidget;
