
export const formatExerciseDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const calculateCaloriesBurned = (
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

export const getExerciseDifficulty = (sets: number, reps: number): 'easy' | 'medium' | 'hard' => {
  const totalVolume = sets * reps;
  if (totalVolume < 30) return 'easy';
  if (totalVolume < 60) return 'medium';
  return 'hard';
};
