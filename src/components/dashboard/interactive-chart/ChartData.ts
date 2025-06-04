
import { useOptimizedExerciseProgramPage } from '@/hooks/useOptimizedExerciseProgramPage';

export const useChartData = () => {
  const { currentProgram } = useOptimizedExerciseProgramPage();
  
  const exerciseData = currentProgram?.daily_workouts?.map((workout, index) => ({
    day: `Day ${workout.day_number || index + 1}`,
    exercises: workout.exercises?.length || 0,
    completed: workout.exercises?.filter((ex: any) => ex.completed).length || 0,
  })) || [];

  const progressData = [
    { name: 'Completed', value: exerciseData.reduce((sum, day) => sum + day.completed, 0) },
    { name: 'Remaining', value: exerciseData.reduce((sum, day) => sum + (day.exercises - day.completed), 0) },
  ];

  return { exerciseData, progressData };
};
