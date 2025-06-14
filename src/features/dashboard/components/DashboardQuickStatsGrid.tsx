
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Target, Activity, Sparkles } from "lucide-react";

interface DashboardQuickStatsGridProps {
  todaysCalories: number;
  todaysProtein: number;
  todaysMealsLength: number;
  exerciseProgress: number;
  completedExercises: number;
  todaysExercisesLength: number;
  aiGenerationsRemaining: number;
}

export const DashboardQuickStatsGrid = ({
  todaysCalories,
  todaysProtein,
  todaysMealsLength,
  exerciseProgress,
  completedExercises,
  todaysExercisesLength,
  aiGenerationsRemaining
}: DashboardQuickStatsGridProps) => {
  return (
    <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Today's Calories</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg md:text-2xl font-bold">{todaysCalories}</div>
          <p className="text-xs text-muted-foreground">
            {todaysMealsLength} meals planned
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Protein Intake</CardTitle>
          <Target className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg md:text-2xl font-bold">{todaysProtein.toFixed(1)}g</div>
          <p className="text-xs text-muted-foreground">Daily protein goal</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Exercise Progress</CardTitle>
          <Activity className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg md:text-2xl font-bold">{exerciseProgress.toFixed(0)}%</div>
          <p className="text-xs text-muted-foreground">
            {completedExercises}/{todaysExercisesLength} exercises done
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">AI Generations</CardTitle>
          <Sparkles className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg md:text-2xl font-bold">{aiGenerationsRemaining}</div>
          <p className="text-xs text-muted-foreground">Credits remaining</p>
        </CardContent>
      </Card>
    </div>
  );
};
