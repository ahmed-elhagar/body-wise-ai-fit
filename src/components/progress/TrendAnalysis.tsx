import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useOptimizedExerciseProgramPage } from "@/features/exercise/hooks/useOptimizedExerciseProgramPage";
import { TrendingUp, Target, Calendar } from "lucide-react";

const TrendAnalysis = () => {
  const { currentProgram } = useOptimizedExerciseProgramPage();

  if (!currentProgram) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>No data available.</CardContent>
      </Card>
    );
  }

  const totalWorkouts = currentProgram.daily_workouts?.length || 0;
  const completedWorkouts = currentProgram.daily_workouts?.filter(workout => workout.completed).length || 0;
  const completionRate = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-gray-500" />
          <span>Workout Completion Rate</span>
        </div>
        <Progress value={completionRate} />
        <div className="text-sm text-gray-500">
          {completedWorkouts} of {totalWorkouts} workouts completed
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendAnalysis;
