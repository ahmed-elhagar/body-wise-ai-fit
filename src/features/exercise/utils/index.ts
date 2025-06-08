
// Utility functions for exercise feature
export const calculateWorkoutProgress = (exercises: any[]) => {
  const completed = exercises.filter(ex => ex.completed).length;
  const total = exercises.length;
  return total > 0 ? (completed / total) * 100 : 0;
};

export const generateWeekStructure = (program: any) => {
  if (!program?.daily_workouts) return [];
  
  const today = new Date().getDay() || 7;
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return program.daily_workouts.map((workout: any) => ({
    dayNumber: workout.day_number,
    dayName: dayNames[workout.day_number - 1] || `Day ${workout.day_number}`,
    workout: workout,
    isRestDay: workout.is_rest_day || false,
    isCompleted: workout.completed || false,
    isToday: workout.day_number === today,
  }));
};

export const getExerciseStats = (exercises: any[]) => {
  const completed = exercises.filter(ex => ex.completed).length;
  const total = exercises.length;
  return {
    total,
    completed,
    remaining: total - completed,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
};
