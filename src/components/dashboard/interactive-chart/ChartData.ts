
import { useExerciseProgramQuery } from '@/hooks/useExerciseProgramQuery';
import { useWeightTracking } from '@/hooks/useWeightTracking';
import { useMealPlanData } from '@/hooks/useMealPlanData';

export const useChartData = () => {
  const exerciseData = useExerciseProgramQuery();
  const { weightEntries } = useWeightTracking();
  const { currentWeekPlan } = useMealPlanData('1'); // Use string for weekOffset

  // Sample chart data
  const workoutData = [
    { day: 'Mon', completed: exerciseData.program ? 1 : 0, planned: 1 },
    { day: 'Tue', completed: 0, planned: 1 },
    { day: 'Wed', completed: 1, planned: 1 },
    { day: 'Thu', completed: 0, planned: 1 },
    { day: 'Fri', completed: 1, planned: 1 },
    { day: 'Sat', completed: 0, planned: 0 },
    { day: 'Sun', completed: 0, planned: 0 },
  ];

  const calorieData = [
    { day: 'Mon', consumed: 1800, target: 2000 },
    { day: 'Tue', consumed: 1950, target: 2000 },
    { day: 'Wed', consumed: 2100, target: 2000 },
    { day: 'Thu', consumed: 1750, target: 2000 },
    { day: 'Fri', consumed: 2050, target: 2000 },
    { day: 'Sat', consumed: 1900, target: 2000 },
    { day: 'Sun', consumed: 1850, target: 2000 },
  ];

  const weightData = weightEntries.slice(0, 7).map((entry, index) => ({
    day: `Day ${index + 1}`,
    weight: entry.weight,
    target: 70 // Mock target weight
  }));

  return {
    workoutData,
    calorieData,
    weightData
  };
};
