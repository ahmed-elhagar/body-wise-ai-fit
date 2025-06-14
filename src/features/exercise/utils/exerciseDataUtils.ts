
// Feature-specific exercise utilities following our agreed structure
export const formatWorkoutDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const calculateWorkoutCalories = (
  exerciseType: string,
  durationMinutes: number,
  weight: number = 70
): number => {
  const metValues: Record<string, number> = {
    'strength': 6.0,
    'cardio': 8.0,
    'yoga': 3.0,
    'pilates': 4.0,
    'running': 10.0,
    'cycling': 8.0,
    'swimming': 9.0,
    'walking': 4.0,
  };

  const met = metValues[exerciseType.toLowerCase()] || 5.0;
  return Math.round(met * weight * (durationMinutes / 60));
};

export const getWorkoutDifficulty = (sets: number, reps: number): 'easy' | 'medium' | 'hard' => {
  const totalVolume = sets * reps;
  if (totalVolume < 30) return 'easy';
  if (totalVolume < 60) return 'medium';
  return 'hard';
};

export const calculateExerciseProgress = (exercises: any[]) => {
  const total = exercises.length;
  const completed = exercises.filter(ex => ex.completed).length;
  return {
    total,
    completed,
    percentage: total > 0 ? (completed / total) * 100 : 0
  };
};

export const getWorkoutStatistics = (dailyWorkouts: any[]) => {
  const totalWorkouts = dailyWorkouts.length;
  const completedWorkouts = dailyWorkouts.filter(w => w.completed).length;
  const totalEstimatedCalories = dailyWorkouts.reduce((sum, w) => sum + (w.estimated_calories || 0), 0);
  const totalExercises = dailyWorkouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0);

  return {
    totalWorkouts,
    completedWorkouts,
    totalEstimatedCalories,
    totalExercises,
    completionRate: totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0
  };
};

export const getTrainingDays = (dailyWorkouts: any[]) => {
  return dailyWorkouts.filter(w => w.exercises && w.exercises.length > 0);
};

export const getRestDays = (dailyWorkouts: any[]) => {
  return dailyWorkouts.filter(w => !w.exercises || w.exercises.length === 0);
};
