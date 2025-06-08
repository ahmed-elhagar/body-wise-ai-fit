import { useState, useEffect } from 'react';
import { useMealPlanState } from './useMealPlanState';
import { useOptimizedExerciseProgramPage } from '@/features/exercise/hooks/useOptimizedExerciseProgramPage';

interface Achievement {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  rarity: string;
  category: string;
  icon: string;
  earned_at?: string;
  progress?: number;
  requirement_value?: number;
}

export const useAchievements = () => {
  const { currentWeekPlan } = useMealPlanState();
  const { currentProgram } = useOptimizedExerciseProgramPage();
  
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-meal-plan',
      title: 'Generated First Meal Plan',
      description: 'Generate your first personalized meal plan.',
      achieved: false,
      rarity: 'common',
      category: 'nutrition',
      icon: 'target'
    },
    {
      id: 'first-workout-plan',
      title: 'Generated First Workout Plan',
      description: 'Generate your first personalized workout plan.',
      achieved: false,
      rarity: 'common',
      category: 'fitness',
      icon: 'trophy'
    },
    {
      id: 'consistent-meal-planning',
      title: 'Consistent Meal Planning',
      description: 'Generate meal plans for 7 consecutive days.',
      achieved: false,
      rarity: 'rare',
      category: 'consistency',
      icon: 'star'
    },
    {
      id: 'consistent-workouts',
      title: 'Consistent Workouts',
      description: 'Complete workouts for 7 consecutive days.',
      achieved: false,
      rarity: 'rare',
      category: 'consistency',
      icon: 'flame'
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const earnedAchievements = achievements.filter(a => a.achieved);
  const availableAchievements = achievements.filter(a => !a.achieved);

  const checkAchievements = () => {
    setIsLoading(true);
    
    // Check if the user has generated a meal plan
    if (currentWeekPlan) {
      setAchievements((prevAchievements) =>
        prevAchievements.map((achievement) =>
          achievement.id === 'first-meal-plan'
            ? { ...achievement, achieved: true, earned_at: new Date().toISOString() }
            : achievement
        )
      );
    }

    // Check if the user has generated a workout plan
    if (currentProgram) {
      setAchievements((prevAchievements) =>
        prevAchievements.map((achievement) =>
          achievement.id === 'first-workout-plan'
            ? { ...achievement, achieved: true, earned_at: new Date().toISOString() }
            : achievement
        )
      );
    }

    setIsLoading(false);
  };

  useEffect(() => {
    checkAchievements();
  }, [currentWeekPlan, currentProgram]);

  return { 
    achievements,
    earnedAchievements,
    availableAchievements,
    isLoading,
    checkAchievements
  };
};
