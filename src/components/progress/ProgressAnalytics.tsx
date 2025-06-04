
import { Card } from '@/components/ui/card';
import { useOptimizedExerciseProgramPage } from '@/hooks/useOptimizedExerciseProgramPage';
import { TrendingUp, Target, Calendar } from 'lucide-react';

export const ProgressAnalytics = () => {
  const { currentProgram } = useOptimizedExerciseProgramPage();
  
  const totalExercises = currentProgram?.daily_workouts?.reduce((sum: number, workout: any) => 
    sum + (workout.exercises?.length || 0), 0) || 0;
  
  const completedExercises = currentProgram?.daily_workouts?.reduce((sum: number, workout: any) => 
    sum + (workout.exercises?.filter((ex: any) => ex.completed).length || 0), 0) || 0;
  
  const completionRate = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-2xl font-bold">{Math.round(completionRate)}%</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">Exercises Completed</p>
            <p className="text-2xl font-bold">{completedExercises}/{totalExercises}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-purple-600" />
          <div>
            <p className="text-sm text-gray-600">Current Week</p>
            <p className="text-2xl font-bold">{currentProgram?.current_week || 1}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
