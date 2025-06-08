
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Calendar } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  category: 'weight' | 'exercise' | 'nutrition' | 'habit';
  priority: 'low' | 'medium' | 'high';
}

interface EnhancedGoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export const EnhancedGoalCard = ({ goal, onEdit, onDelete }: EnhancedGoalCardProps) => {
  const { t, isRTL } = useI18n();

  const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
  const isCompleted = progress >= 100;

  const getCategoryIcon = () => {
    const icons = {
      weight: '⚖️',
      exercise: '💪',
      nutrition: '🥗',
      habit: '✅'
    };
    return icons[goal.category] || '🎯';
  };

  const getPriorityColor = () => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[goal.priority];
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-xl">{getCategoryIcon()}</span>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <CardTitle className="text-lg">{goal.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
            </div>
          </div>
          <Badge className={getPriorityColor()}>
            {t(`goals:priority.${goal.priority}`) || goal.priority}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-sm font-medium">
              {t('goals:progress') || 'Progress'}
            </span>
            <span className="text-sm text-gray-600">
              {goal.current} / {goal.target} {goal.unit}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-center">
            <span className={`text-lg font-bold ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <div className={`flex items-center justify-between pt-2 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-1 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar className="w-4 h-4" />
            <span>{goal.deadline}</span>
          </div>
          
          {isCompleted && (
            <Badge className="bg-green-100 text-green-800">
              <Target className="w-3 h-3 mr-1" />
              {t('goals:completed') || 'Completed'}
            </Badge>
          )}
          
          {!isCompleted && progress > 0 && (
            <div className={`flex items-center gap-1 text-sm text-blue-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="w-4 h-4" />
              <span>{t('goals:onTrack') || 'On Track'}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedGoalCard;
