
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
        category: 'nutrition',
        icon: 'target',
        rarity: 'common',
        requirement_value: 1,
        progress: hasWeeklyPlan ? 1 : 0,
        earned_at: hasWeeklyPlan ? new Date().toISOString() : undefined,
      },
      {
        id: 'daily-meals',
        title: 'Plan 3 Meals a Day',
        description: 'Plan at least 3 meals for a day.',
        completed: dailyMealsCount >= 3,
        category: 'nutrition',
        icon: 'star',
        rarity: 'common',
        requirement_value: 3,
        progress: Math.min(dailyMealsCount, 3),
        earned_at: dailyMealsCount >= 3 ? new Date().toISOString() : undefined,
      },
      {
        id: 'consistent-planning',
        title: 'Consistent Meal Planning',
        description: 'Plan meals for at least 5 days in a week.',
        completed: (currentWeekPlan?.dailyMeals?.length || 0) >= 15,
        category: 'consistency',
        icon: 'trophy',
        rarity: 'rare',
        requirement_value: 15,
        progress: Math.min(currentWeekPlan?.dailyMeals?.length || 0, 15),
        earned_at: (currentWeekPlan?.dailyMeals?.length || 0) >= 15 ? new Date().toISOString() : undefined,
      },
    ];
  }, [currentWeekPlan]);

  const earnedAchievements = useMemo(
    () => achievements.filter((achievement) => achievement.completed),
    [achievements]
  );

  const availableAchievements = useMemo(
    () => achievements.filter((achievement) => !achievement.completed),
    [achievements]
  );

  const completedAchievementsCount = useMemo(
    () => achievements.filter((achievement) => achievement.completed).length,
    [achievements]
  );

  const checkAchievements = () => {
    // Mock function for checking achievements
    console.log('Checking achievements...');
  };

  return {
    achievements,
    earnedAchievements,
    availableAchievements,
    completedAchievementsCount,
    isLoading: false,
    checkAchievements,
  };
};
