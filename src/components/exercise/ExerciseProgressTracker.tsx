
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
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{t('exercise.progressTracker')}</h3>
          </div>
          <Badge variant="outline" className="bg-white/80 text-xs sm:text-sm w-fit">
            Week {currentProgram.current_week || 1}
          </Badge>
        </div>

        {/* Today's Progress */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{currentDayName} Progress</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Exercises</span>
              <span className="text-blue-600 font-semibold">
                {completedExercises}/{totalExercises}
              </span>
            </div>
            <Progress value={todayProgress} className="h-3 bg-white/60" />
            <div className="text-xs text-gray-500 text-right">
              {Math.round(todayProgress)}% complete
            </div>
          </div>
        </div>

        {/* Week Overview - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/70 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600">{t('exercise.completed')}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {weekStats.completedWorkouts}
            </div>
            <div className="text-xs text-gray-500">workouts</div>
          </div>
          
          <div className="bg-white/70 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-600">{t('exercise.total')}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {weekStats.totalWorkouts}
            </div>
            <div className="text-xs text-gray-500">workouts</div>
          </div>
        </div>

        {/* Week Progress */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">{t('exercise.weekProgress')}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Exercises</span>
              <span className="text-indigo-600 font-semibold">
                {weekStats.completedExercises}/{weekStats.totalExercises}
              </span>
            </div>
            <Progress value={weekProgress} className="h-3 bg-white/60" />
            <div className="text-xs text-gray-500 text-right">
              {Math.round(weekProgress)}% complete
            </div>
          </div>
        </div>

        {/* Quick Stats - Responsive Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/50">
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/40 p-2 rounded">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{weekStats.averageWorkoutDuration}min avg</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/40 p-2 rounded">
            <Flame className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{weekStats.totalEstimatedCalories} cal total</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
