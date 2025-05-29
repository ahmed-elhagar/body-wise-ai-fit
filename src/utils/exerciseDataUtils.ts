
import { DailyWorkout } from '@/types/exercise';

export const generateWeeklyWorkouts = (workouts: any[], type: "home" | "gym"): DailyWorkout[] => {
  const weekDays = [1, 2, 3, 4, 5, 6, 7]; // Monday to Sunday
  const restDays = type === "home" ? [3, 6, 7] : [4, 7]; // Wed, Sat, Sun for home; Thu, Sun for gym
  
  return weekDays.map(dayNumber => {
    const existingWorkout = workouts.find(w => w.day_number === dayNumber);
    const isRestDay = restDays.includes(dayNumber);
    
    if (isRestDay) {
      return {
        id: `rest-${dayNumber}`,
        weekly_program_id: '',
        day_number: dayNumber,
        workout_name: 'Rest Day',
        completed: false,
        exercises: [],
        is_rest_day: true
      };
    }
    
    if (existingWorkout) {
      return {
        ...existingWorkout,
        completed: existingWorkout.completed || false,
        is_rest_day: false,
        exercises: existingWorkout.exercises?.map((exercise: any) => ({
          ...exercise,
          completed: exercise.completed || false
        })) || []
      };
    }
    
    // Return empty workout day if no data
    return {
      id: `empty-${dayNumber}`,
      weekly_program_id: '',
      day_number: dayNumber,
      workout_name: 'No Workout',
      completed: false,
      exercises: [],
      is_rest_day: false
    };
  });
};
