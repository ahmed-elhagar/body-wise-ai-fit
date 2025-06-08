
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
  goals: Goal[];
}

const GoalProgressWidget = ({ goals }: GoalProgressWidgetProps) => {
  const { t, isRTL } = useI18n();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Target className="w-5 h-5 text-blue-600" />
          {t('dashboard:goalProgress') || 'Goal Progress'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-6">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {t('dashboard:noGoalsSet') || 'No goals set yet'}
            </p>
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="font-medium text-gray-700">{goal.title}</span>
                <span className="text-sm text-gray-500">
                  {goal.current} / {goal.target} {goal.unit}
                </span>
              </div>
              <Progress value={goal.progress} className="h-2" />
              <div className={`flex items-center gap-1 text-xs text-green-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TrendingUp className="w-3 h-3" />
                <span>{goal.progress}% {t('dashboard:complete') || 'complete'}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default GoalProgressWidget;
