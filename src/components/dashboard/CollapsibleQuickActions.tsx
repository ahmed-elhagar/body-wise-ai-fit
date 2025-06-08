
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import DashboardQuickActions from './DashboardQuickActions';

interface CollapsibleQuickActionsProps {
  onViewMealPlan: () => void;
  onViewExercise: () => void;
  onViewWeight: () => void;
  onViewProgress: () => void;
  onViewGoals: () => void;
  onViewProfile: () => void;
}

const CollapsibleQuickActions = ({
  onViewMealPlan,
  onViewExercise,
  onViewWeight,
  onViewProgress,
  onViewGoals,
  onViewProfile
}: CollapsibleQuickActionsProps) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                {t('dashboard:quickActions') || 'Quick Actions'}
              </div>
              {isOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
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
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CollapsibleQuickActions;
