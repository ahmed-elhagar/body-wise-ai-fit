
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useWeightTracking } from './useWeightTracking';
import { useGoals } from './useGoals';
import { useMealPlanData } from './useMealPlanData';
import { useExerciseProgramData } from './useExerciseProgramData';
import { useMemo } from 'react';

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  progress_data?: any;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'nutrition' | 'consistency' | 'goals';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  requirement_type: string;
  requirement_value: number;
  is_earned?: boolean;
  earned_at?: string;
  progress?: number;
}

export const useAchievements = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { weightEntries } = useWeightTracking();
  const { goals } = useGoals();
  const { data: currentMealPlan } = useMealPlanData(0);
  const { currentProgram: currentExerciseProgram } = useExerciseProgramData(0, "home");

  const { data: userAchievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as UserAchievement[];
    },
    enabled: !!user?.id,
  });

  const achievements = useMemo(() => {
    const baseAchievements: Achievement[] = [
      {
        id: 'first_weigh_in',
        title: 'First Steps',
        description: 'Record your first weight entry',
        category: 'fitness',
        rarity: 'common',
        icon: 'star',
        requirement_type: 'weight_entries',
        requirement_value: 1,
      },
      {
        id: 'consistent_tracker',
        title: 'Consistent Tracker',
        description: 'Record weight 7 times',
        category: 'consistency',
        rarity: 'rare',
        icon: 'calendar',
        requirement_type: 'weight_entries',
        requirement_value: 7,
      },
      {
        id: 'goal_setter',
        title: 'Goal Setter',
        description: 'Create your first goal',
        category: 'goals',
        rarity: 'common',
        icon: 'target',
        requirement_type: 'goals_created',
        requirement_value: 1,
      },
      {
        id: 'goal_achiever',
        title: 'Goal Achiever',
        description: 'Complete your first goal',
        category: 'goals',
        rarity: 'rare',
        icon: 'award',
        requirement_type: 'goals_completed',
        requirement_value: 1,
      },
      {
        id: 'meal_planner',
        title: 'Meal Planner',
        description: 'Generate your first meal plan',
        category: 'nutrition',
        rarity: 'common',
        icon: 'star',
        requirement_type: 'meal_plans',
        requirement_value: 1,
      },
      {
        id: 'workout_warrior',
        title: 'Workout Warrior',
        description: 'Complete 50 exercises',
        category: 'fitness',
        rarity: 'epic',
        icon: 'trophy',
        requirement_type: 'exercises_completed',
        requirement_value: 50,
      },
    ];

    return baseAchievements.map(achievement => {
      const userAchievement = userAchievements?.find(ua => ua.achievement_id === achievement.id);
      let progress = 0;

      // Calculate progress based on requirement type
      switch (achievement.requirement_type) {
        case 'weight_entries':
          progress = weightEntries.length;
          break;
        case 'goals_created':
          progress = goals.length;
          break;
        case 'goals_completed':
          progress = goals.filter(goal => goal.status === 'completed').length;
          break;
        case 'meal_plans':
          progress = currentMealPlan ? 1 : 0;
          break;
        case 'exercises_completed':
          progress = currentExerciseProgram?.daily_workouts?.reduce(
            (sum, workout) => sum + (workout.exercises?.filter(ex => ex.completed).length || 0), 0
          ) || 0;
          break;
      }

      return {
        ...achievement,
        is_earned: !!userAchievement,
        earned_at: userAchievement?.earned_at,
        progress: Math.min(progress, achievement.requirement_value),
      };
    });
  }, [userAchievements, weightEntries, goals, currentMealPlan, currentExerciseProgram]);

  const unlockAchievement = useMutation({
    mutationFn: async (achievementId: string) => {
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user?.id,
          achievement_id: achievementId,
        });

      if (error) throw error;

      // Create notification for achievement
      await supabase
        .from('user_notifications')
        .insert({
          user_id: user?.id,
          title: 'Achievement Unlocked!',
          message: `You've earned a new achievement!`,
          type: 'achievement',
          metadata: { achievement_id: achievementId },
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-achievements', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
  });

  // Check for newly earned achievements
  const checkAchievements = () => {
    achievements.forEach(achievement => {
      if (!achievement.is_earned && achievement.progress >= achievement.requirement_value) {
        unlockAchievement.mutate(achievement.id);
      }
    });
  };

  const earnedAchievements = achievements.filter(a => a.is_earned);
  const availableAchievements = achievements.filter(a => !a.is_earned);

  return {
    achievements,
    earnedAchievements,
    availableAchievements,
    isLoading: achievementsLoading,
    checkAchievements,
    unlockAchievement: unlockAchievement.mutate,
  };
};
