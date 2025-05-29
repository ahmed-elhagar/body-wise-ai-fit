
import { DailyWorkout } from '@/types/exercise';

export const generateWeeklyWorkouts = (workouts: any[], type: "home" | "gym"): DailyWorkout[] => {
  const weekDays = [1, 2, 3, 4, 5, 6, 7]; // Monday to Sunday
  
  return weekDays.map(dayNumber => {
    // Look for workouts that have actual exercises and are not empty placeholders
    const existingWorkout = workouts.find(w => 
      w.day_number === dayNumber && 
      w.id && 
      !w.id.startsWith('empty-') && 
      !w.id.startsWith('rest-')
    );
    
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
    
    // If no workout found for this day, it's a rest day (as determined by AI)
    return {
      id: `rest-${dayNumber}`,
      weekly_program_id: '',
      day_number: dayNumber,
      workout_name: 'Rest Day',
      completed: false,
      exercises: [],
      is_rest_day: true
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

// Helper function to check if a day is a rest day (now determined by AI response)
export const isRestDay = (dayNumber: number, workouts: DailyWorkout[]): boolean => {
  const workout = workouts.find(w => w.day_number === dayNumber);
  return !workout || workout.is_rest_day || !hasRealWorkoutData(workout);
};

// Helper function to get training days from AI response
export const getTrainingDays = (workouts: DailyWorkout[]): number[] => {
  return workouts
    .filter(w => hasRealWorkoutData(w) && !w.is_rest_day)
    .map(w => w.day_number)
    .sort((a, b) => a - b);
};

// Helper function to get rest days from AI response
export const getRestDays = (workouts: DailyWorkout[]): number[] => {
  const trainingDays = getTrainingDays(workouts);
  const allDays = [1, 2, 3, 4, 5, 6, 7];
  return allDays.filter(day => !trainingDays.includes(day));
};
