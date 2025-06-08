import { useState, useEffect } from 'react';
import { useMealPlanState } from './useMealPlanState';
import { useOptimizedExerciseProgramPage } from '@/features/exercise/hooks/useOptimizedExerciseProgramPage';

interface Achievement {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
}

export const useAchievements = () => {
  const { mealPlan } = useMealPlanState();
  const { currentProgram } = useOptimizedExerciseProgramPage();
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-meal-plan',
      title: 'Generated First Meal Plan',
      description: 'Generate your first personalized meal plan.',
      achieved: false,
    },
    {
      id: 'first-workout-plan',
      title: 'Generated First Workout Plan',
      description: 'Generate your first personalized workout plan.',
      achieved: false,
    },
    {
      id: 'consistent-meal-planning',
      title: 'Consistent Meal Planning',
      description: 'Generate meal plans for 7 consecutive days.',
      achieved: false,
    },
    {
      id: 'consistent-workouts',
      title: 'Consistent Workouts',
      description: 'Complete workouts for 7 consecutive days.',
      achieved: false,
    },
  ]);

  useEffect(() => {
    // Check if the user has generated a meal plan
    if (mealPlan) {
      setAchievements((prevAchievements) =>
        prevAchievements.map((achievement) =>
          achievement.id === 'first-meal-plan'
            ? { ...achievement, achieved: true }
            : achievement
        )
      );
    }

    // Check if the user has generated a workout plan
    if (currentProgram) {
      setAchievements((prevAchievements) =>
        prevAchievements.map((achievement) =>
          achievement.id === 'first-workout-plan'
            ? { ...achievement, achieved: true }
            : achievement
        )
      );
    }

    // TODO: Implement logic to check for consistent meal planning and workouts
    // This will require tracking daily activity over time

  }, [mealPlan, currentProgram]);

  return { achievements };
};
