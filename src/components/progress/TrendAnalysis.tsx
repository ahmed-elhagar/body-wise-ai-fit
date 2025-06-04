
import { Card } from '@/components/ui/card';
import { useOptimizedExerciseProgramPage } from '@/hooks/useOptimizedExerciseProgramPage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const TrendAnalysis = () => {
  const { currentProgram } = useOptimizedExerciseProgramPage();
  
  const data = currentProgram?.daily_workouts?.map((workout: any, index: number) => ({
    day: `Day ${workout.day_number || index + 1}`,
    exercises: workout.exercises?.length || 0,
    completed: workout.exercises?.filter((ex: any) => ex.completed).length || 0,
  })) || [];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Weekly Progress Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="completed" fill="#10b981" name="Completed" />
          <Bar dataKey="exercises" fill="#e5e7eb" name="Total" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

// Export as default for backward compatibility
export default TrendAnalysis;
