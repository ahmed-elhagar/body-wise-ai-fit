
import { useState, useEffect } from 'react';
import { useOptimizedExerciseProgramPage } from './useOptimizedExerciseProgramPage';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export const useAchievements = () => {
  const { currentProgram } = useOptimizedExerciseProgramPage();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!currentProgram) return;

    const totalExercises = currentProgram.daily_workouts?.reduce((sum, workout) => 
      sum + (workout.exercises?.length || 0), 0) || 0;
    
    const completedExercises = currentProgram.daily_workouts?.reduce((sum, workout) => 
      sum + (workout.exercises?.filter((ex: any) => ex.completed).length || 0), 0) || 0;

    const newAchievements: Achievement[] = [
      {
        id: 'first-workout',
        title: 'First Steps',
        description: 'Complete your first exercise',
        icon: '🎯',
        unlocked: completedExercises > 0,
        progress: Math.min(completedExercises, 1),
        maxProgress: 1,
      },
      {
        id: 'week-warrior',
        title: 'Week Warrior',
        description: 'Complete all exercises in a week',
        icon: '💪',
        unlocked: completedExercises >= totalExercises && totalExercises > 0,
        progress: completedExercises,
        maxProgress: totalExercises,
      },
      {
        id: 'consistency',
        title: 'Consistency King',
        description: 'Work out 5 days in a row',
        icon: '🔥',
        unlocked: false, // This would need day tracking
        progress: 0,
        maxProgress: 5,
      },
    ];

    setAchievements(newAchievements);
  }, [currentProgram]);

  return { achievements };
};
