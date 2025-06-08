import { useMemo } from 'react';
import { useMealPlanState } from '@/features/meal-plan/hooks';
import { useAuth } from './useAuth';

export const useAchievements = () => {
  const { user } = useAuth();
  const { currentWeekPlan } = useMealPlanState();

  const achievements = useMemo(() => {
    const dailyMealsCount = currentWeekPlan?.dailyMeals?.length || 0;
    const hasWeeklyPlan = !!currentWeekPlan?.weeklyPlan;

    return [
      {
        id: 'weekly-plan',
        title: 'Weekly Meal Plan',
        description: 'Create a meal plan for the entire week.',
        completed: hasWeeklyPlan,
      },
      {
        id: 'daily-meals',
        title: 'Plan 3 Meals a Day',
        description: 'Plan at least 3 meals for a day.',
        completed: dailyMealsCount >= 3,
      },
      {
        id: 'consistent-planning',
        title: 'Consistent Meal Planning',
        description: 'Plan meals for at least 5 days in a week.',
        completed: (currentWeekPlan?.dailyMeals?.length || 0) >= 15,
      },
    ];
  }, [currentWeekPlan]);

  const completedAchievementsCount = useMemo(
    () => achievements.filter((achievement) => achievement.completed).length,
    [achievements]
  );

  return {
    achievements,
    completedAchievementsCount,
  };
};
