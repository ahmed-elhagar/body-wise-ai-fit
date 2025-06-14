
import { DailyWorkout } from '../types';

export const generateWeeklyWorkouts = (existingWorkouts: DailyWorkout[], workoutType: "home" | "gym"): DailyWorkout[] => {
  const days = [1, 2, 3, 4, 5, 6, 7];
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return days.map(dayNumber => {
    const existingWorkout = existingWorkouts.find(w => w.day_number === dayNumber);
    
    if (existingWorkout) {
      return existingWorkout;
    }
    
    // Create rest day for missing workouts
    return {
      id: `rest-day-${dayNumber}`,
      weekly_program_id: 'temp',
      day_number: dayNumber,
      workout_name: `Rest Day - ${dayNames[dayNumber - 1]}`,
      estimated_duration: 0,
      estimated_calories: 0,
      muscle_groups: [],
      completed: false,
      exercises: [],
      is_rest_day: true
    };
  });
};

export const calculateExerciseProgress = (exercises: any[]): {
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
} => {
  const completed = exercises.filter(ex => ex.completed).length;
  const total = exercises.length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  return {
    completedExercises: completed,
    totalExercises: total,
    progressPercentage: percentage
  };
};

export const getWorkoutStatistics = (dailyWorkouts: DailyWorkout[]) => {
  if (!dailyWorkouts || dailyWorkouts.length === 0) {
    return {
      totalWorkouts: 0,
      completedWorkouts: 0,
      totalEstimatedCalories: 0,
    };
  }
  const trainingDays = dailyWorkouts.filter(d => !d.is_rest_day);
  const completedWorkouts = trainingDays.filter(d => d.completed).length;
  const totalEstimatedCalories = trainingDays.reduce((acc, curr) => acc + (curr.estimated_calories || 0), 0);
  
  return {
    totalWorkouts: trainingDays.length,
    completedWorkouts,
    totalEstimatedCalories,
  };
};

export const getTrainingDays = (dailyWorkouts: DailyWorkout[]) => {
  if (!dailyWorkouts) return [];
  return dailyWorkouts.filter(d => !d.is_rest_day);
};

export const getRestDays = (dailyWorkouts: DailyWorkout[]) => {
  if (!dailyWorkouts) return [];
  return dailyWorkouts.filter(d => d.is_rest_day);
};
