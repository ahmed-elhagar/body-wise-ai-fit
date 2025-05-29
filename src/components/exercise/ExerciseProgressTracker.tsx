
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Target, TrendingUp, Calendar, Clock, Flame, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getWorkoutStatistics } from "@/utils/exerciseDataUtils";
import { useMemo } from "react";

interface ExerciseProgressTrackerProps {
  currentProgram: any;
  selectedDay: number;
  currentWeekOffset: number;
  completedExercises: number;
  totalExercises: number;
}

export const ExerciseProgressTracker = ({
  currentProgram,
  selectedDay,
  currentWeekOffset,
  completedExercises,
  totalExercises
}: ExerciseProgressTrackerProps) => {
  const { t } = useLanguage();

  const weekStats = useMemo(() => {
    if (!currentProgram?.daily_workouts) {
      return {
        totalWorkouts: 0,
        totalExercises: 0,
        completedWorkouts: 0,
        completedExercises: 0,
        averageWorkoutDuration: 0,
        totalEstimatedCalories: 0
      };
    }
    return getWorkoutStatistics(currentProgram.daily_workouts);
  }, [currentProgram]);

  const todayProgress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
  const weekProgress = weekStats.totalExercises > 0 ? (weekStats.completedExercises / weekStats.totalExercises) * 100 : 0;

  const dayNames = [
    t('day.monday'), t('day.tuesday'), t('day.wednesday'), 
    t('day.thursday'), t('day.friday'), t('day.saturday'), t('day.sunday')
  ];
  const currentDayName = dayNames[selectedDay - 1];

  // Calculate the actual week number based on offset
  const displayWeek = (currentProgram?.current_week || 1) + currentWeekOffset;

  if (!currentProgram?.daily_workouts) return null;

  return (
    <div className="p-6">
      {/* Header with Week Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {t('exercise.progressTracker')}
            </h2>
            <p className="text-sm text-gray-500">
              {t('exercise.week')} {displayWeek} • {currentDayName}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm font-medium px-3 py-1">
          {currentProgram.workout_type === "home" ? t('exercise.home') : t('exercise.gym')}
        </Badge>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Today's Progress */}
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {Math.round(todayProgress)}%
          </div>
          <div className="text-xs text-gray-600">{t('exercise.today')}</div>
        </div>

        {/* Week Progress */}
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {Math.round(weekProgress)}%
          </div>
          <div className="text-xs text-gray-600">{t('exercise.weekProgress')}</div>
        </div>

        {/* Completed Workouts */}
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600 mb-1">
            {weekStats.completedWorkouts}
          </div>
          <div className="text-xs text-gray-600">{t('exercise.workouts')}</div>
        </div>

        {/* Total Exercises */}
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Target className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {weekStats.totalExercises}
          </div>
          <div className="text-xs text-gray-600">{t('exercise.exercises')}</div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        {/* Today's Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {t('exercise.todaysProgress')}
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {completedExercises}/{totalExercises}
            </span>
          </div>
          <Progress value={todayProgress} className="h-2" />
        </div>

        {/* Week Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {t('exercise.weekProgress')}
            </span>
            <span className="text-sm font-semibold text-purple-600">
              {weekStats.completedExercises}/{weekStats.totalExercises}
            </span>
          </div>
          <Progress value={weekProgress} className="h-2" />
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-orange-500" />
          <span>{weekStats.averageWorkoutDuration} {t('exercise.min')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Flame className="w-4 h-4 text-red-500" />
          <span>{weekStats.totalEstimatedCalories} {t('exercise.cal')}</span>
        </div>
      </div>
    </div>
  );
};
