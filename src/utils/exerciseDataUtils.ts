
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
  if (!Array.isArray(workouts)) {
    console.error('isRestDay expects an array of workouts, received:', typeof workouts);
    return false;
  }
  
  const workout = workouts.find(w => w.day_number === dayNumber);
  return !workout || workout.is_rest_day || !hasRealWorkoutData(workout);
};

// Helper function to get training days from AI response
export const getTrainingDays = (workouts: DailyWorkout[]): number[] => {
  if (!Array.isArray(workouts)) {
    console.error('getTrainingDays expects an array of workouts, received:', typeof workouts);
    return [];
  }
  
  return workouts
    .filter(w => hasRealWorkoutData(w) && !w.is_rest_day)
    .map(w => w.day_number)
    .sort((a, b) => a - b);
};

// Helper function to get rest days from AI response
export const getRestDays = (workouts: DailyWorkout[]): number[] => {
  if (!Array.isArray(workouts)) {
    console.error('getRestDays expects an array of workouts, received:', typeof workouts);
    return [];
  }
  
  const trainingDays = getTrainingDays(workouts);
  const allDays = [1, 2, 3, 4, 5, 6, 7];
  return allDays.filter(day => !trainingDays.includes(day));
};

// Helper function to calculate workout statistics
export const getWorkoutStatistics = (workouts: DailyWorkout[]) => {
  if (!Array.isArray(workouts)) {
    return {
      totalWorkouts: 0,
      totalExercises: 0,
      completedWorkouts: 0,
      completedExercises: 0,
      averageWorkoutDuration: 0,
      totalEstimatedCalories: 0
    };
  }

  const activeWorkouts = workouts.filter(w => hasRealWorkoutData(w));
  const totalExercises = activeWorkouts.reduce((total, workout) => total + (workout.exercises?.length || 0), 0);
  const completedExercises = activeWorkouts.reduce((total, workout) => 
    total + (workout.exercises?.filter(ex => ex.completed).length || 0), 0);
  
  const completedWorkouts = activeWorkouts.filter(w => w.completed).length;
  const totalDuration = activeWorkouts.reduce((total, workout) => total + (workout.estimated_duration || 0), 0);
  const totalCalories = activeWorkouts.reduce((total, workout) => total + (workout.estimated_calories || 0), 0);

  return {
    totalWorkouts: activeWorkouts.length,
    totalExercises,
    completedWorkouts,
    completedExercises,
    averageWorkoutDuration: activeWorkouts.length > 0 ? Math.round(totalDuration / activeWorkouts.length) : 0,
    totalEstimatedCalories: totalCalories
  };
};

// Helper function to get workout progress percentage
export const getWorkoutProgress = (workouts: DailyWorkout[]): number => {
  const stats = getWorkoutStatistics(workouts);
  if (stats.totalExercises === 0) return 0;
  return Math.round((stats.completedExercises / stats.totalExercises) * 100);
};

// Helper function to validate workout data structure
export const validateWorkoutData = (workout: any): workout is DailyWorkout => {
  return workout &&
         typeof workout === 'object' &&
         typeof workout.id === 'string' &&
         typeof workout.day_number === 'number' &&
         typeof workout.workout_name === 'string' &&
         Array.isArray(workout.exercises);
};

// Helper function to get next training day
export const getNextTrainingDay = (currentDay: number, workouts: DailyWorkout[]): number | null => {
  const trainingDays = getTrainingDays(workouts);
  
  // Find the next training day after current day
  const nextDay = trainingDays.find(day => day > currentDay);
  
  // If no day found after current, return the first training day of next week
  return nextDay || (trainingDays.length > 0 ? trainingDays[0] : null);
};

// Helper function to get previous training day
export const getPreviousTrainingDay = (currentDay: number, workouts: DailyWorkout[]): number | null => {
  const trainingDays = getTrainingDays(workouts);
  
  // Find the last training day before current day
  const previousDay = [...trainingDays].reverse().find(day => day < currentDay);
  
  // If no day found before current, return the last training day of previous week
  return previousDay || (trainingDays.length > 0 ? trainingDays[trainingDays.length - 1] : null);
};
