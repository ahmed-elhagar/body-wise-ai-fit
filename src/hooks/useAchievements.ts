
import { useState, useEffect } from 'react';
import { useOptimizedExerciseProgramPage } from './useOptimizedExerciseProgramPage';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  requirement_value?: number;
  earned_at?: string;
}

export const useAchievements = () => {
  const { currentProgram } = useOptimizedExerciseProgramPage();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentProgram) return;

    const totalExercises = currentProgram.daily_workouts?.reduce((sum: number, workout: any) => 
      sum + (workout.exercises?.length || 0), 0) || 0;
    
    const completedExercises = currentProgram.daily_workouts?.reduce((sum: number, workout: any) => 
      sum + (workout.exercises?.filter((ex: any) => ex.completed).length || 0), 0) || 0;

    const newAchievements: Achievement[] = [
      {
        id: 'first-workout',
        title: 'First Steps',
        description: 'Complete your first exercise',
        icon: 'trophy',
        category: 'fitness',
        rarity: 'common',
        unlocked: completedExercises > 0,
        progress: Math.min(completedExercises, 1),
        maxProgress: 1,
        requirement_value: 1,
        earned_at: completedExercises > 0 ? new Date().toISOString() : undefined,
      },
      {
        id: 'week-warrior',
        title: 'Week Warrior',
        description: 'Complete all exercises in a week',
        icon: 'trophy',
        category: 'fitness',
        rarity: 'rare',
        unlocked: completedExercises >= totalExercises && totalExercises > 0,
        progress: completedExercises,
        maxProgress: totalExercises,
        requirement_value: totalExercises,
        earned_at: (completedExercises >= totalExercises && totalExercises > 0) ? new Date().toISOString() : undefined,
      },
      {
        id: 'consistency',
        title: 'Consistency King',
        description: 'Work out 5 days in a row',
        icon: 'flame',
        category: 'consistency',
        rarity: 'epic',
        unlocked: false,
        progress: 0,
        maxProgress: 5,
        requirement_value: 5,
      },
    ];

    setAchievements(newAchievements);
  }, [currentProgram]);

  const earnedAchievements = achievements.filter(a => a.unlocked);
  const availableAchievements = achievements.filter(a => !a.unlocked);

  const checkAchievements = () => {
    // Function to manually check achievements - can be expanded later
    console.log('Checking achievements...');
  };

  return { 
    achievements,
    earnedAchievements,
    availableAchievements,
    isLoading,
    checkAchievements
  };
};
