
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import DashboardQuickActions from './DashboardQuickActions';

interface QuickActionsGridProps {
  onViewMealPlan: () => void;
  onViewExercise: () => void;
  onViewWeight: () => void;
  onViewProgress: () => void;
  onViewGoals: () => void;
  onViewProfile: () => void;
}

const QuickActionsGrid = ({
  onViewMealPlan,
  onViewExercise,
  onViewWeight,
  onViewProgress,
  onViewGoals,
  onViewProfile
}: QuickActionsGridProps) => {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          {t('dashboard:quickActions') || 'Quick Actions'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DashboardQuickActions 
          onViewMealPlan={onViewMealPlan}
          onViewExercise={onViewExercise}
          onViewWeight={onViewWeight}
          onViewProgress={onViewProgress}
          onViewGoals={onViewGoals}
          onViewProfile={onViewProfile}
        />
      </CardContent>
    </Card>
  );
};

export default QuickActionsGrid;
