
import { Scale, Flame, Activity } from "lucide-react";
import { weightData, calorieData, workoutData } from "./ChartData";

export const chartConfig = {
  weight: {
    title: 'Weight Progress',
    icon: Scale,
    color: '#3b82f6',
    data: weightData,
    dataKey: 'value',
    targetKey: 'target'
  },
  calories: {
    title: 'Calorie Tracking',
    icon: Flame,
    color: '#f97316',
    data: calorieData,
    dataKey: 'consumed',
    targetKey: 'target'
  },
  workouts: {
    title: 'Workout Duration',
    icon: Activity,
    color: '#8b5cf6',
    data: workoutData,
    dataKey: 'duration',
    targetKey: 'target'
  }
};
