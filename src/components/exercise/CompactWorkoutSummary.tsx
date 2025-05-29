
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Target, Home, Building2, Coffee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  isRestDay
}: CompactWorkoutSummaryProps) => {
  const { t } = useLanguage();
  
  const todaysWorkout = todaysWorkouts?.[0];
  const isEmptyDay = !todaysWorkout || (!isRestDay && totalExercises === 0);

  // Rest Day Summary
  if (isRestDay) {
    return (
      <Card className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
              <Coffee className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-800">{t('exercise.restDay')}</h3>
              <p className="text-sm text-orange-600">{t('exercise.restDayTip')}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
            {t('exercise.rest')}
          </Badge>
        </div>
      </Card>
    );
  }

  // Empty Day Summary
  if (isEmptyDay) {
    return (
      <Card className="p-4 bg-gray-50 border-gray-200 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              {workoutType === "home" ? (
                <Home className="w-5 h-5 text-gray-500" />
              ) : (
                <Building2 className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">{t('exercise.noWorkout')}</h3>
              <p className="text-sm text-gray-500">{t('exercise.noWorkoutMessage')}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-gray-100 text-gray-600">
            {t('exercise.empty')}
          </Badge>
        </div>
      </Card>
    );
  }

  // Active Workout Summary
  return (
    <Card className="p-4 bg-white border-0 shadow-md mb-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-fitness-gradient rounded-full flex items-center justify-center">
              {workoutType === "home" ? (
                <Home className="w-5 h-5 text-white" />
              ) : (
                <Building2 className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{todaysWorkout.workout_name}</h3>
              <p className="text-sm text-gray-600">{t('exercise.today')}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-fitness-gradient/10 text-fitness-700 border-fitness-200">
            {workoutType === "home" ? t('exercise.home') : t('exercise.gym')}
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            {todaysWorkout.estimated_duration && (
              <span className="flex items-center text-gray-600">
                <Clock className="w-3 h-3 mr-1" />
                {todaysWorkout.estimated_duration} {t('min')}
              </span>
            )}
            {todaysWorkout.estimated_calories && (
              <span className="flex items-center text-gray-600">
                <Target className="w-3 h-3 mr-1" />
                {todaysWorkout.estimated_calories} {t('cal')}
              </span>
            )}
          </div>
          <span className="text-gray-600">
            {completedExercises}/{totalExercises} {t('exercise.exercises')}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">{t('exercise.progress')}</span>
            <span className="text-gray-700 font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Muscle Groups */}
        {todaysWorkout.muscle_groups && todaysWorkout.muscle_groups.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {todaysWorkout.muscle_groups.slice(0, 3).map((muscle: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                {muscle}
              </Badge>
            ))}
            {todaysWorkout.muscle_groups.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                +{todaysWorkout.muscle_groups.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
