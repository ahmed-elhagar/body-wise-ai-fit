
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Activity } from "lucide-react";

interface ProgressTrackerProps {
  completedWorkouts: number;
  totalWorkouts: number;
  weeklyGoal: number;
  currentStreak: number;
}

export const ProgressTracker = ({
  completedWorkouts,
  totalWorkouts,
  weeklyGoal,
  currentStreak
}: ProgressTrackerProps) => {
  const completionPercentage = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;
  const weeklyProgress = weeklyGoal > 0 ? (completedWorkouts / weeklyGoal) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Progress Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <Progress value={completionPercentage} />
          <p className="text-xs text-gray-600">
            {completedWorkouts} of {totalWorkouts} workouts completed
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Weekly Goal</span>
            <span>{Math.round(weeklyProgress)}%</span>
          </div>
          <Progress value={weeklyProgress} />
          <p className="text-xs text-gray-600">
            {completedWorkouts} of {weeklyGoal} weekly workouts
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{currentStreak}</p>
            <p className="text-xs text-gray-600">Day Streak</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold">{completedWorkouts}</p>
            <p className="text-xs text-gray-600">Completed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
