
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Target, Flame, TrendingUp, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getWorkoutStatistics } from "@/utils/exerciseDataUtils";

interface ExerciseProgressTrackerProps {
  currentProgram: any;
  selectedDay: number;
  completedExercises: number;
  totalExercises: number;
}

export const ExerciseProgressTracker = ({
  currentProgram,
  selectedDay,
  completedExercises,
  totalExercises
}: ExerciseProgressTrackerProps) => {
  const { t } = useLanguage();

  if (!currentProgram?.daily_workouts) return null;

  const weekStats = getWorkoutStatistics(currentProgram.daily_workouts);
  const todayProgress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
  const weekProgress = weekStats.totalExercises > 0 ? (weekStats.completedExercises / weekStats.totalExercises) * 100 : 0;

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDayName = dayNames[selectedDay - 1];

  return (
    <Card className="p-4 bg-white border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">{t('exercise.progressTracker')}</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          Week {currentProgram.current_week || 1}
        </Badge>
      </div>

      {/* Today's Progress */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">{currentDayName} Progress</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Exercises</span>
            <span className="font-semibold text-blue-600">
              {completedExercises}/{totalExercises}
            </span>
          </div>
          <Progress value={todayProgress} className="h-2" />
          <div className="text-xs text-gray-500 text-right">
            {Math.round(todayProgress)}% complete
          </div>
        </div>
      </div>

      {/* Week Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">
            {weekStats.completedWorkouts}
          </div>
          <div className="text-xs text-gray-500">workouts</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2">
            <Target className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {weekStats.totalWorkouts}
          </div>
          <div className="text-xs text-gray-500">workouts</div>
        </div>
      </div>

      {/* Week Progress */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-600">{t('exercise.weekProgress')}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Exercises</span>
            <span className="font-semibold text-indigo-600">
              {weekStats.completedExercises}/{weekStats.totalExercises}
            </span>
          </div>
          <Progress value={weekProgress} className="h-2" />
          <div className="text-xs text-gray-500 text-right">
            {Math.round(weekProgress)}% complete
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <Clock className="w-3 h-3" />
          <span>{weekStats.averageWorkoutDuration}min avg</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <Flame className="w-3 h-3" />
          <span>{weekStats.totalEstimatedCalories} cal</span>
        </div>
      </div>
    </Card>
  );
};
