
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Clock, Target, Home, Building2, Coffee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TodaysWorkoutCardProps {
  todaysWorkouts: any[];
  currentProgram: any;
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  workoutType: "home" | "gym";
  selectedDay: number;
  isRestDay?: boolean;
}

export const TodaysWorkoutCard = ({
  todaysWorkouts,
  currentProgram,
  completedExercises,
  totalExercises,
  progressPercentage,
  workoutType,
  selectedDay,
  isRestDay
}: TodaysWorkoutCardProps) => {
  const { t } = useLanguage();
  
  const todaysWorkout = todaysWorkouts?.[0];
  const isEmptyDay = !todaysWorkout || (!isRestDay && totalExercises === 0);

  // Rest Day Card
  if (isRestDay) {
    return (
      <div className="lg:col-span-1">
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 backdrop-blur-sm border-orange-200 shadow-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              {t('exercise.restDay') || 'Rest Day'}
            </h3>
            <p className="text-orange-700 text-sm">
              {t('exercise.restDayMessage') || 'Take a break and let your muscles recover. Stay hydrated and get good sleep!'}
            </p>
            <div className="mt-4 p-3 bg-orange-200/50 rounded-lg">
              <p className="text-xs text-orange-700">
                {t('exercise.restDayTip') || 'Light stretching or walking is recommended'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Empty Day Card
  if (isEmptyDay) {
    return (
      <div className="lg:col-span-1">
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t('exercise.noWorkout') || 'No Workout Planned'}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('exercise.noWorkoutMessage') || 'Generate an AI workout plan to get started'}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Active Workout Card
  return (
    <div className="lg:col-span-1">
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {t('exercise.todaysWorkout') || "Today's Workout"}
          </h3>
          <Badge variant="outline" className="bg-white/80">
            {workoutType === "home" ? (
              <><Home className="w-3 h-3 mr-1" /> {t('exercise.home') || 'Home'}</>
            ) : (
              <><Building2 className="w-3 h-3 mr-1" /> {t('exercise.gym') || 'Gym'}</>
            )}
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">{todaysWorkout.workout_name}</h4>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {todaysWorkout.estimated_duration && (
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {todaysWorkout.estimated_duration} {t('exercise.minutes') || 'min'}
                </span>
              )}
              {todaysWorkout.estimated_calories && (
                <span className="flex items-center">
                  <Target className="w-3 h-3 mr-1" />
                  {todaysWorkout.estimated_calories} {t('exercise.calories') || 'cal'}
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {t('exercise.progress') || 'Progress'}
              </span>
              <span className="text-sm text-gray-600">
                {completedExercises}/{totalExercises} {t('exercise.exercises') || 'exercises'}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {todaysWorkout.muscle_groups && todaysWorkout.muscle_groups.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700 block mb-2">
                {t('exercise.targetMuscles') || 'Target Muscles'}
              </span>
              <div className="flex flex-wrap gap-1">
                {todaysWorkout.muscle_groups.map((muscle: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
