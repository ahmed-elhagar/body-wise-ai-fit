
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, Dumbbell, Scale, TrendingUp, Target, User } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface DashboardQuickActionsProps {
  onViewMealPlan: () => void;
  onViewExercise: () => void;
  onViewWeight: () => void;
  onViewProgress: () => void;
  onViewGoals: () => void;
  onViewProfile: () => void;
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
      title: t('navigation:mealPlan') || 'Meal Plan',
      description: t('dashboard:viewTodaysMeals') || "View today's meals",
      icon: Utensils,
      onClick: onViewMealPlan,
      color: 'bg-green-500'
    },
    {
      title: t('navigation:exercise') || 'Exercise',
      description: t('dashboard:startWorkout') || 'Start your workout',
      icon: Dumbbell,
      onClick: onViewExercise,
      color: 'bg-blue-500'
    },
    {
      title: t('navigation:weight') || 'Weight',
      description: t('dashboard:trackWeight') || 'Track your weight',
      icon: Scale,
      onClick: onViewWeight,
      color: 'bg-purple-500'
    },
    {
      title: t('navigation:progress') || 'Progress',
      description: t('dashboard:viewProgress') || 'View your progress',
      icon: TrendingUp,
      onClick: onViewProgress,
      color: 'bg-indigo-500'
    },
    {
      title: t('navigation:goals') || 'Goals',
      description: t('dashboard:manageGoals') || 'Manage your goals',
      icon: Target,
      onClick: onViewGoals,
      color: 'bg-orange-500'
    },
    {
      title: t('navigation:profile') || 'Profile',
      description: t('dashboard:updateProfile') || 'Update your profile',
      icon: User,
      onClick: onViewProfile,
      color: 'bg-pink-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {actions.map((action, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={action.onClick}>
          <CardContent className="p-4 text-center">
            <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">
              {action.title}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2">
              {action.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardQuickActions;
