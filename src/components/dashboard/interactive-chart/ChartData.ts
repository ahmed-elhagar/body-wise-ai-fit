import { subDays, format } from 'date-fns';
import { useOptimizedExerciseProgramPage } from '@/features/exercise/hooks/useOptimizedExerciseProgramPage';

// Mock data for different chart types
const generateWeightData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    data.push({
      date: date.toISOString(),
      value: 70 + Math.random() * 2 - 1, // Random weight around 70kg
      target: 68 // Target weight
    });
  }
  return data;
};

const generateCalorieData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    data.push({
      date: date.toISOString(),
      consumed: 1800 + Math.random() * 400, // Random calories consumed
      target: 2000, // Target calories
      burned: 300 + Math.random() * 200 // Calories burned
    });
  }
  return data;
};

const generateWorkoutData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    data.push({
      date: date.toISOString(),
      duration: Math.random() > 0.3 ? 30 + Math.random() * 60 : 0, // Random workout duration
      calories: Math.random() > 0.3 ? 200 + Math.random() * 300 : 0 // Calories burned
    });
  }
  return data;
};

export const weightData = generateWeightData();
export const calorieData = generateCalorieData();
export const workoutData = generateWorkoutData();

export const useChartData = () => {
  const { currentProgram } = useOptimizedExerciseProgramPage();
  
  const exerciseData = currentProgram?.daily_workouts?.map((workout: any, index: number) => ({
    day: `Day ${workout.day_number || index + 1}`,
    exercises: workout.exercises?.length || 0,
    completed: workout.exercises?.filter((ex: any) => ex.completed).length || 0,
  })) || [];

  const progressData = [
    { name: 'Completed', value: exerciseData.reduce((sum, day) => sum + day.completed, 0) },
    { name: 'Remaining', value: exerciseData.reduce((sum, day) => sum + (day.exercises - day.completed), 0) },
  ];

  return { 
    exerciseData, 
    progressData,
    weightData,
    calorieData,
    workoutData
  };
};
