
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Target, CheckCircle } from "lucide-react";

interface ExerciseProgramStatsCardProps {
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isRestDay: boolean;
  selectedDay: number;
}

const ExerciseProgramStatsCard = ({
  completedExercises,
  totalExercises,
  progressPercentage,
  isRestDay,
  selectedDay
}: ExerciseProgramStatsCardProps) => {
  const getDayName = (dayNumber: number) => {
    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNumber] || 'Day';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4" />
          {getDayName(selectedDay)} Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isRestDay ? (
          <div className="text-center py-4">
            <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Rest Day</p>
            <p className="text-xs text-gray-500">Recovery is part of progress!</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Exercises
                </span>
                <span className="font-medium">{completedExercises} / {totalExercises}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-fitness-primary">{progressPercentage.toFixed(0)}%</p>
              <p className="text-xs text-gray-500">Workout Complete</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseProgramStatsCard;
