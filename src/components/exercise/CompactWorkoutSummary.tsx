import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Flame, Target, Calendar, Dumbbell, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getWorkoutStatistics, getTrainingDays, getRestDays } from "@/features/exercise/utils/exerciseDataUtils";

interface CompactWorkoutSummaryProps {
  todaysWorkouts: any[];
  currentProgram: any;
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  workoutType: "home" | "gym";
  selectedDay: number;
  isRestDay?: boolean;
}

export const CompactWorkoutSummary = ({
  todaysWorkouts,
  currentProgram,
  completedExercises,
  totalExercises,
  progressPercentage,
  workoutType,
  selectedDay,
  isRestDay = false
}: CompactWorkoutSummaryProps) => {
  const { t } = useLanguage();

  // Get workout statistics
  const weekStats = currentProgram?.daily_workouts ? getWorkoutStatistics(currentProgram.daily_workouts) : null;
  const trainingDays = currentProgram?.daily_workouts ? getTrainingDays(currentProgram.daily_workouts) : [];
  const restDays = currentProgram?.daily_workouts ? getRestDays(currentProgram.daily_workouts) : [];

  const currentWorkout = todaysWorkouts?.[0];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDayName = dayNames[selectedDay - 1];

  // Rest Day Display
  if (isRestDay) {
    return (
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-orange-800 mb-2">
              {t('exercise.restDay')} - {currentDayName}
            </h3>
            <p className="text-orange-700 text-sm">
              {t('exercise.restDayMessage') || 'Take time to recover and prepare for your next workout!'}
            </p>
          </div>

          {weekStats && (
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-orange-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-800">{weekStats.totalWorkouts}</div>
                <div className="text-xs text-orange-600">{t('exercise.weeklyWorkouts')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-800">{weekStats.completedWorkouts}</div>
                <div className="text-xs text-orange-600">{t('exercise.completed')}</div>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Active Workout Display
  return (
    <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-fitness-gradient rounded-lg flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {currentWorkout?.workout_name || `${currentDayName} Workout`}
              </h3>
              <p className="text-xs text-gray-600">
                {workoutType === "gym" ? t('exercise.gymWorkout') : t('exercise.homeWorkout')}
              </p>
            </div>
          </div>
          
          <Badge variant="outline" className="bg-white/80">
            {currentProgram?.difficulty_level || 'Beginner'}
          </Badge>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Clock className="w-4 h-4 text-gray-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-gray-800">
              {currentWorkout?.estimated_duration || 45}min
            </div>
            <div className="text-xs text-gray-600">{t('exercise.duration')}</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Flame className="w-4 h-4 text-orange-500 mx-auto mb-1" />
            <div className="text-sm font-medium text-gray-800">
              {currentWorkout?.estimated_calories || 250}
            </div>
            <div className="text-xs text-gray-600">{t('exercise.calories')}</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Target className="w-4 h-4 text-green-500 mx-auto mb-1" />
            <div className="text-sm font-medium text-gray-800">
              {totalExercises}
            </div>
            <div className="text-xs text-gray-600">{t('exercise.exercises')}</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <TrendingUp className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <div className="text-sm font-medium text-gray-800">
              {Math.round(progressPercentage)}%
            </div>
            <div className="text-xs text-gray-600">{t('exercise.progress')}</div>
          </div>
        </div>

        {/* Progress Bar */}
        {totalExercises > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t('exercise.todayProgress')}</span>
              <span className="font-medium text-gray-800">
                {completedExercises}/{totalExercises} {t('exercise.exercises')}
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-gray-200"
            />
          </div>
        )}

        {/* Muscle Groups */}
        {currentWorkout?.muscle_groups && currentWorkout.muscle_groups.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">{t('exercise.targetMuscles')}:</div>
            <div className="flex flex-wrap gap-1">
              {currentWorkout.muscle_groups.map((muscle: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  {muscle}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Week Overview */}
        {weekStats && (
          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2">{t('exercise.weekOverview')}:</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-sm font-medium text-gray-800">{trainingDays.length}</div>
                <div className="text-xs text-gray-600">{t('exercise.training')}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">{restDays.length}</div>
                <div className="text-xs text-gray-600">{t('exercise.rest')}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">{weekStats.totalEstimatedCalories}</div>
                <div className="text-xs text-gray-600">{t('exercise.totalCalories')}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
