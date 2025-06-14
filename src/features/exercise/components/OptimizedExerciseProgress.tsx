
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Target, 
  Calendar,
  Award,
  Flame
} from "lucide-react";

interface ProgressMetrics {
  weeklyProgress: number;
  completedWorkouts: number;
  totalWorkouts: number;
  currentStreak: number;
  totalCaloriesBurned: number;
  averageIntensity: string;
}

interface WeekStructure {
  [key: number]: {
    dayName: string;
    isRestDay: boolean;
    isCompleted: boolean;
    workoutName?: string;
  };
}

interface OptimizedExerciseProgressProps {
  progressMetrics: ProgressMetrics;
  weekStructure: WeekStructure;
}

const OptimizedExerciseProgress: React.FC<OptimizedExerciseProgressProps> = ({
  progressMetrics,
  weekStructure
}) => {
  const {
    weeklyProgress,
    completedWorkouts,
    totalWorkouts,
    currentStreak,
    totalCaloriesBurned,
    averageIntensity
  } = progressMetrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Weekly Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Weekly Progress</span>
          </div>
          <span className="text-xs text-gray-500">{Math.round(weeklyProgress)}%</span>
        </div>
        <Progress value={weeklyProgress} className="h-2 mb-2" />
        <p className="text-xs text-gray-600">
          {completedWorkouts}/{totalWorkouts} workouts completed
        </p>
      </Card>

      {/* Current Streak */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-gray-700">Current Streak</span>
        </div>
        <div className="text-2xl font-bold text-orange-600 mb-1">
          {currentStreak}
        </div>
        <p className="text-xs text-gray-600">
          {currentStreak === 1 ? 'day' : 'days'} in a row
        </p>
      </Card>

      {/* Calories Burned */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-gray-700">Calories Burned</span>
        </div>
        <div className="text-2xl font-bold text-red-600 mb-1">
          {totalCaloriesBurned.toLocaleString()}
        </div>
        <p className="text-xs text-gray-600">this week</p>
      </Card>

      {/* Average Intensity */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-gray-700">Avg. Intensity</span>
        </div>
        <Badge 
          variant="outline" 
          className={`text-xs ${
            averageIntensity === 'High' ? 'border-red-200 text-red-700' :
            averageIntensity === 'Medium' ? 'border-yellow-200 text-yellow-700' :
            'border-green-200 text-green-700'
          }`}
        >
          {averageIntensity}
        </Badge>
        <p className="text-xs text-gray-600 mt-1">intensity level</p>
      </Card>
    </div>
  );
};

export default OptimizedExerciseProgress;
