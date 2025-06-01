
import { useExerciseProgramQuery } from '@/hooks/useExerciseProgramQuery';
import { useWeightTracking } from '@/hooks/useWeightTracking';
import { useMealPlanData } from '@/hooks/useMealPlanData';

export const useChartData = () => {
  const exerciseData = useExerciseProgramQuery();
  const { weightEntries } = useWeightTracking();
  const { data: mealPlanData } = useMealPlanData(1);

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

// Export individual data arrays for ChartConfig
export const workoutData = [
  { day: 'Mon', duration: 45, target: 60 },
  { day: 'Tue', duration: 30, target: 60 },
  { day: 'Wed', duration: 60, target: 60 },
  { day: 'Thu', duration: 0, target: 60 },
  { day: 'Fri', duration: 50, target: 60 },
  { day: 'Sat', duration: 0, target: 0 },
  { day: 'Sun', duration: 0, target: 0 },
];

export const calorieData = [
  { day: 'Mon', consumed: 1800, target: 2000 },
  { day: 'Tue', consumed: 1950, target: 2000 },
  { day: 'Wed', consumed: 2100, target: 2000 },
  { day: 'Thu', consumed: 1750, target: 2000 },
  { day: 'Fri', consumed: 2050, target: 2000 },
  { day: 'Sat', consumed: 1900, target: 2000 },
  { day: 'Sun', consumed: 1850, target: 2000 },
];

export const weightData = [
  { day: 'Day 1', value: 75, target: 70 },
  { day: 'Day 2', value: 74.5, target: 70 },
  { day: 'Day 3', value: 74.2, target: 70 },
  { day: 'Day 4', value: 73.8, target: 70 },
  { day: 'Day 5', value: 73.5, target: 70 },
  { day: 'Day 6', value: 73.2, target: 70 },
  { day: 'Day 7', value: 72.8, target: 70 },
];
