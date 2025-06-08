
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, CheckCircle } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'overdue';
}

interface GoalProgressWidgetProps {
  goals: Goal[];
}

const GoalProgressWidget = ({ goals }: GoalProgressWidgetProps) => {
  const { t, isRTL } = useI18n();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}>
          <Target className="w-5 h-5 text-blue-500" />
          {t('dashboard:goals') || 'Goals Progress'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">
              {t('goals:noGoalsYet') || 'No goals set yet'}
            </p>
          </div>
        ) : (
          goals.slice(0, 3).map((goal) => {
            const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
            
            return (
              <div key={goal.id} className="space-y-2">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <h4 className="font-medium text-sm">{goal.title}</h4>
                    <Badge className={getStatusColor(goal.status)}>
                      {t(`goals:status.${goal.status}`) || goal.status}
                    </Badge>
                  </div>
                  {goal.status === 'completed' && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className={`flex justify-between text-xs text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{goal.current} / {goal.target} {goal.unit}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default GoalProgressWidget;
