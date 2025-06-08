
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, Dumbbell, Weight, TrendingUp, Target, User } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface DashboardQuickActionsProps {
  onViewMealPlan?: () => void;
  onViewExercise?: () => void;
  onViewWeight?: () => void;
  onViewProgress?: () => void;
  onViewGoals?: () => void;
  onViewProfile?: () => void;
}

const DashboardQuickActions = ({
  onViewMealPlan,
  onViewExercise,
  onViewWeight,
  onViewProgress,
  onViewGoals,
  onViewProfile
}: DashboardQuickActionsProps) => {
  const { t, isRTL } = useI18n();

  const actions = [
    {
      icon: Utensils,
      label: t('navigation:mealPlan') || 'Meal Plan',
      onClick: onViewMealPlan,
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Dumbbell,
      label: t('navigation:exercise') || 'Exercise',
      onClick: onViewExercise,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Weight,
      label: t('navigation:weight') || 'Weight',
      onClick: onViewWeight,
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: TrendingUp,
      label: t('navigation:progress') || 'Progress',
      onClick: onViewProgress,
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Target,
      label: t('navigation:goals') || 'Goals',
      onClick: onViewGoals,
      color: 'from-red-500 to-red-600'
    },
    {
      icon: User,
      label: t('navigation:profile') || 'Profile',
      onClick: onViewProfile,
      color: 'from-gray-500 to-gray-600'
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {t('dashboard:quickActions') || 'Quick Actions'}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Button
              key={index}
              variant="outline"
              onClick={action.onClick}
              className={`h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-br ${action.color} hover:opacity-90 text-white border-0 shadow-lg ${isRTL ? 'flex-col-reverse' : ''}`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default DashboardQuickActions;
