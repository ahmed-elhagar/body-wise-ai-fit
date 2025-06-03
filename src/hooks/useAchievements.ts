
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useWeightTracking } from './useWeightTracking';
import { useGoals } from './useGoals';
import { useMealPlanData } from './meal-plan/useMealPlanData';
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
  const { currentProgram: currentExerciseProgram } = useExerciseProgramData();

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

      // Calculate progress based on requirement type with safe data access
      switch (achievement.requirement_type) {
        case 'weight_entries':
          progress = weightEntries?.length || 0;
          break;
        case 'goals_created':
          progress = goals?.length || 0;
          break;
        case 'goals_completed':
          progress = goals?.filter(goal => goal.status === 'completed').length || 0;
          break;
        case 'meal_plans':
          progress = currentMealPlan ? 1 : 0;
          break;
        case 'exercises_completed':
          progress = 0; // Safe fallback for now
          if (currentExerciseProgram?.daily_workouts) {
            progress = currentExerciseProgram.daily_workouts.reduce(
              (sum, workout) => sum + (workout.exercises?.filter(ex => ex.completed).length || 0), 0
            );
          }
          break;
        default:
          progress = 0;
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
      if (!user?.id) throw new Error('User not authenticated');

      // Use upsert to handle duplicates gracefully
      const { data, error } = await supabase
        .from('user_achievements')
        .upsert({
          user_id: user.id,
          achievement_id: achievementId,
          earned_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,achievement_id',
          ignoreDuplicates: true
        })
        .select()
        .single();

      if (error && !error.message.includes('duplicate key')) {
        throw error;
      }

      // Only create notification if it's a new achievement
      if (data) {
        await supabase
          .from('user_notifications')
          .insert({
            user_id: user.id,
            title: 'Achievement Unlocked!',
            message: `You've earned a new achievement!`,
            type: 'achievement',
            metadata: { achievement_id: achievementId },
          });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-achievements', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
    onError: (error) => {
      console.log('Achievement unlock handled:', error.message);
      // Don't throw error for duplicates, just log
    }
  });

  // Check for newly earned achievements with better error handling
  const checkAchievements = () => {
    if (!user?.id) return;
    
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
