
import { DailyWorkout } from '@/types/exercise';

export const generateWeeklyWorkouts = (workouts: any[], type: "home" | "gym"): DailyWorkout[] => {
  const weekDays = [1, 2, 3, 4, 5, 6, 7]; // Monday to Sunday
  const restDays = type === "home" ? [3, 6, 7] : [4, 7]; // Wed, Sat, Sun for home; Thu, Sun for gym
  
  return weekDays.map(dayNumber => {
    // Only look for workouts that have actual exercises and are not empty placeholders
    const existingWorkout = workouts.find(w => 
      w.day_number === dayNumber && 
      w.id && 
      !w.id.startsWith('empty-') && 
      !w.id.startsWith('rest-')
    );
    
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
    
    // Return empty workout day if no real data
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

// Helper function to check if a workout has real data
export const hasRealWorkoutData = (workout: DailyWorkout): boolean => {
  return workout && 
         !workout.id.startsWith('empty-') && 
         !workout.id.startsWith('rest-') &&
         workout.exercises && 
         workout.exercises.length > 0;
};

// Helper function to check if a day is a rest day
export const isRestDay = (dayNumber: number, workoutType: "home" | "gym"): boolean => {
  const restDays = workoutType === "home" ? [3, 6, 7] : [4, 7];
  return restDays.includes(dayNumber);
};
