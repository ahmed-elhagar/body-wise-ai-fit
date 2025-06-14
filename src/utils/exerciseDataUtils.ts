
import { DailyWorkout } from '@/features/exercise';

export const generateWeeklyWorkouts = (workouts: DailyWorkout[], workoutType: 'home' | 'gym'): DailyWorkout[] => {
  if (!workouts) {
    workouts = [];
  }

  const allWorkouts = [...workouts];

  // Find which days are missing
  const workoutDays = new Set(allWorkouts.map(w => w.day_number));
  for (let i = 1; i <= 7; i++) {
    if (!workoutDays.has(i)) {
      // Add a rest day for missing days
      allWorkouts.push({
        id: `rest-day-${i}`,
        weekly_program_id: allWorkouts.length > 0 ? allWorkouts[0].weekly_program_id : 'no-program',
        day_number: i,
        workout_name: 'Rest Day',
        is_rest_day: true,
        completed: false,
      });
    }
  }

  // Sort by day number
  return allWorkouts.sort((a, b) => a.day_number - b.day_number);
};
