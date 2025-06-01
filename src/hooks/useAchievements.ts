
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useExerciseProgramQuery } from './useExerciseProgramQuery';
import { useWeightTracking } from './useWeightTracking';
import { useMealPlanData } from './useMealPlanData';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number;
  category: 'workout' | 'nutrition' | 'weight' | 'streak';
}

export const useAchievements = () => {
  const { user } = useAuth();
  const exerciseData = useExerciseProgramQuery();
  const { weightEntries } = useWeightTracking();
  const { currentWeekPlan } = useMealPlanData('1'); // Use string for weekOffset

  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Mock achievements based on user data
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          title: 'First Workout',
          description: 'Complete your first workout',
          icon: '🏋️',
          earned: exerciseData.program ? true : false,
          progress: exerciseData.program ? 100 : 0,
          category: 'workout'
        },
        {
          id: '2',
          title: 'Weight Tracker',
          description: 'Log your weight for 7 consecutive days',
          icon: '⚖️',
          earned: weightEntries.length >= 7,
          progress: Math.min(weightEntries.length * 100 / 7, 100),
          category: 'weight'
        },
        {
          id: '3',
          title: 'Meal Planner',
          description: 'Create your first meal plan',
          icon: '🍽️',
          earned: !!currentWeekPlan,
          progress: currentWeekPlan ? 100 : 0,
          category: 'nutrition'
        }
      ];

      return mockAchievements;
    },
    enabled: !!user
  });

  return {
    achievements,
    isLoading
  };
};
