
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, Trophy, Calendar } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface Goal {
  id: string;
  title: string;
  progress: number;
  target: string;
  deadline: string;
  category: 'weight' | 'exercise' | 'nutrition';
}

interface GoalProgressWidgetProps {
  goals: Goal[];
}

const GoalProgressWidget = ({ goals }: GoalProgressWidgetProps) => {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          {t('dashboard:goalProgress') || 'Goal Progress'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{goal.title}</h4>
              <span className="text-sm text-gray-600">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{t('dashboard:target') || 'Target'}: {goal.target}</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{goal.deadline}</span>
              </div>
            </div>
          </div>
        ))}
        
        {goals.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t('dashboard:noGoalsSet') || 'No goals set yet'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalProgressWidget;
