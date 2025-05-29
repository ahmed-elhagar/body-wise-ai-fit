
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Target, TrendingUp, Calendar, Clock, Flame } from "lucide-react";
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

  const dayNames = [
    t('day.monday'), t('day.tuesday'), t('day.wednesday'), 
    t('day.thursday'), t('day.friday'), t('day.saturday'), t('day.sunday')
  ];
  const currentDayName = dayNames[selectedDay - 1];

  return (
    <Card className="p-4 bg-white border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {t('exercise.progressTracker')}
            </h3>
            <p className="text-xs text-gray-500">
              {t('exercise.week')} {currentProgram.current_week || 1}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs font-medium">
          {currentDayName}
        </Badge>
      </div>

      {/* Today's Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-medium text-gray-700">
              {t('exercise.todaysProgress')}
            </span>
          </div>
          <span className="text-xs font-semibold text-blue-600">
            {completedExercises}/{totalExercises}
          </span>
        </div>
        
        <Progress value={todayProgress} className="h-2 mb-1" />
        <div className="text-xs text-gray-500 text-right">
          {Math.round(todayProgress)}% {t('exercise.completed').toLowerCase()}
        </div>
      </div>

      {/* Week Overview Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full mx-auto mb-1">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
          </div>
          <div className="text-lg font-bold text-green-600 mb-1">
            {weekStats.completedWorkouts}
          </div>
          <div className="text-xs text-gray-600">{t('exercise.completed')}</div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full mx-auto mb-1">
            <Target className="w-3 h-3 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-blue-600 mb-1">
            {weekStats.totalWorkouts}
          </div>
          <div className="text-xs text-gray-600">{t('exercise.total') || 'Total'}</div>
        </div>
      </div>

      {/* Week Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700">
            {t('exercise.weekProgress')}
          </span>
          <span className="text-xs font-semibold text-indigo-600">
            {weekStats.completedExercises}/{weekStats.totalExercises}
          </span>
        </div>
        
        <Progress value={weekProgress} className="h-2 mb-1" />
        <div className="text-xs text-gray-500 text-right">
          {Math.round(weekProgress)}% {t('exercise.completed').toLowerCase()}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Clock className="w-3 h-3 text-orange-500" />
          <span>{weekStats.averageWorkoutDuration}{t('min')} {t('exercise.averageWorkoutDuration')}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Flame className="w-3 h-3 text-red-500" />
          <span>{weekStats.totalEstimatedCalories} {t('exercise.totalCalories')}</span>
        </div>
      </div>
    </Card>
  );
};
