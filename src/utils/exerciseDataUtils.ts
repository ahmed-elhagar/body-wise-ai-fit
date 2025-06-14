
export const generateWeeklyWorkouts = (workouts: any[], workoutType: string) => {
  // Generate 7 days of workouts, filling in rest days as needed
  const weeklyWorkouts = [];
  
  for (let day = 1; day <= 7; day++) {
    const existingWorkout = workouts.find(w => w.day_number === day);
    if (existingWorkout) {
      weeklyWorkouts.push(existingWorkout);
    } else {
      // Create a rest day
      weeklyWorkouts.push({
        id: `rest-${day}`,
        day_number: day,
        is_rest_day: true,
        exercises: []
      });
    }
  }
  
  return weeklyWorkouts;
};
