
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Target, Flame, TrendingUp } from "lucide-react";
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
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">{t('exercise.progressTracker')}</h3>
          </div>
          <Badge variant="outline" className="bg-white/80">
            Week {currentProgram.current_week || 1}
          </Badge>
        </div>

        {/* Today's Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 font-medium">{currentDayName} Progress</span>
            <span className="text-blue-600 font-semibold">
              {completedExercises}/{totalExercises} exercises
            </span>
          </div>
          <Progress value={todayProgress} className="h-2 bg-white/60" />
          <div className="text-xs text-gray-600 text-right">
            {Math.round(todayProgress)}% complete
          </div>
        </div>

        {/* Week Overview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/60 p-3 rounded-lg text-center">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-xs text-gray-600">{t('exercise.completed')}</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              {weekStats.completedWorkouts}
            </div>
            <div className="text-xs text-gray-500">workouts</div>
          </div>
          
          <div className="bg-white/60 p-3 rounded-lg text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-xs text-gray-600">{t('exercise.total')}</span>
            </div>
            <div className="text-lg font-bold text-blue-600">
              {weekStats.totalWorkouts}
            </div>
            <div className="text-xs text-gray-500">workouts</div>
          </div>
        </div>

        {/* Week Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 font-medium">{t('exercise.weekProgress')}</span>
            <span className="text-indigo-600 font-semibold">
              {weekStats.completedExercises}/{weekStats.totalExercises} exercises
            </span>
          </div>
          <Progress value={weekProgress} className="h-2 bg-white/60" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-3 h-3" />
            <span>{weekStats.averageWorkoutDuration}min avg</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Flame className="w-3 h-3" />
            <span>{weekStats.totalEstimatedCalories} cal total</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
