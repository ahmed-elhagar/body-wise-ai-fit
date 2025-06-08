import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useOptimizedExerciseProgramPage } from "@/features/exercise/hooks/useOptimizedExerciseProgramPage";
import { TrendingUp, Target, Calendar, Activity } from "lucide-react";

interface ProgressAnalyticsProps {
  exercises: any[];
}

export const ProgressAnalytics = ({ exercises }: ProgressAnalyticsProps) => {
  const { completedExercises, totalExercises, progressPercentage } = useOptimizedExerciseProgramPage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total Exercises */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-gray-500" />
            <span>Total Exercises</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{totalExercises}</div>
        </CardContent>
      </Card>

      {/* Completed Exercises */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-green-500" />
            <span>Completed Exercises</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{completedExercises}</div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span>Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Progress value={progressPercentage} className="w-2/3" />
            <span className="text-xl font-semibold">{Math.round(progressPercentage)}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
