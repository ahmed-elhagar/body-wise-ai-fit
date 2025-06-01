
import { useWeightTracking } from "@/hooks/useWeightTracking";
import { useMealPlanData } from "@/hooks/useMealPlanData";
import { useExerciseProgramData } from "@/hooks/useExerciseProgramData";
import { useMemo } from "react";

// Custom hook to generate real chart data
export const useChartData = () => {
  const { weightEntries } = useWeightTracking();
  const { data: currentMealPlan } = useMealPlanData(0);
  const { currentProgram: currentExerciseProgram } = useExerciseProgramData(0, "home");

  const weightData = useMemo(() => {
    if (weightEntries.length < 2) {
      // Provide some sample data if user hasn't logged enough entries
      return [
        { date: '2024-01-01', value: 75, target: 70 },
        { date: '2024-01-08', value: 74.5, target: 70 },
        { date: '2024-01-15', value: 74.2, target: 70 },
        { date: '2024-01-22', value: 73.8, target: 70 },
      ];
    }

    return weightEntries
      .slice()
      .reverse()
      .map(entry => ({
        date: entry.recorded_at.split('T')[0],
        value: parseFloat(entry.weight.toString()),
        target: 70 // This could come from user's weight goal
      }));
  }, [weightEntries]);

  const calorieData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayNumber = new Date(date).getDay() || 7;
      
      // Get meals for this day from actual meal plan
      const dayMeals = currentMealPlan?.dailyMeals?.filter(meal => meal.day_number === dayNumber) || [];
      const consumed = dayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
      
      // Estimate burned calories based on exercises
      const dayWorkouts = currentExerciseProgram?.daily_workouts?.filter(workout => workout.day_number === dayNumber) || [];
      const burned = dayWorkouts.reduce((sum, workout) => sum + (workout.estimated_calories || 0), 0);
      
      return {
        date,
        consumed,
        target: 2200, // This could come from user's calorie goal
        burned: consumed + burned // Base metabolic rate + exercise
      };
    });
  }, [currentMealPlan, currentExerciseProgram]);

  const workoutData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayNumber = new Date(date).getDay() || 7;
      
      // Get workouts for this day
      const dayWorkouts = currentExerciseProgram?.daily_workouts?.filter(workout => workout.day_number === dayNumber) || [];
      const duration = dayWorkouts.reduce((sum, workout) => sum + (workout.estimated_duration || 0), 0);
      const calories = dayWorkouts.reduce((sum, workout) => sum + (workout.estimated_calories || 0), 0);
      
      return {
        date,
        duration,
        calories
      };
    });
  }, [currentExerciseProgram]);

  return {
    weightData,
    calorieData,
    workoutData
  };
};

// For backward compatibility, export the original mock data as well
export const weightData = [
  { date: '2024-01-01', value: 75, target: 70 },
  { date: '2024-01-08', value: 74.5, target: 70 },
  { date: '2024-01-15', value: 74.2, target: 70 },
  { date: '2024-01-22', value: 73.8, target: 70 },
  { date: '2024-01-29', value: 73.2, target: 70 },
  { date: '2024-02-05', value: 72.8, target: 70 },
  { date: '2024-02-12', value: 72.5, target: 70 },
];

export const calorieData = [
  { date: '2024-02-06', consumed: 2100, target: 2200, burned: 2350 },
  { date: '2024-02-07', consumed: 1950, target: 2200, burned: 2100 },
  { date: '2024-02-08', consumed: 2250, target: 2200, burned: 2400 },
  { date: '2024-02-09', consumed: 2050, target: 2200, burned: 2200 },
  { date: '2024-02-10', consumed: 1900, target: 2200, burned: 2150 },
  { date: '2024-02-11', consumed: 2150, target: 2200, burned: 2300 },
  { date: '2024-02-12', consumed: 1847, target: 2200, burned: 2180 },
];

export const workoutData = [
  { date: '2024-02-06', duration: 45, calories: 320 },
  { date: '2024-02-07', duration: 0, calories: 0 },
  { date: '2024-02-08', duration: 60, calories: 450 },
  { date: '2024-02-09', duration: 30, calories: 210 },
  { date: '2024-02-10', duration: 50, calories: 380 },
  { date: '2024-02-11', duration: 0, calories: 0 },
  { date: '2024-02-12', duration: 40, calories: 290 },
];
