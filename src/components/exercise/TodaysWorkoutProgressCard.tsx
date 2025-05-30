
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";

interface TodaysWorkoutProgressCardProps {
  todaysWorkouts: any[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  currentSelectedDate: Date;
  isToday: boolean;
}

export const TodaysWorkoutProgressCard = ({
  todaysWorkouts,
  completedExercises,
  totalExercises,
  progressPercentage,
  currentSelectedDate,
  isToday
}: TodaysWorkoutProgressCardProps) => {
  const { t } = useLanguage();

  return (
    <Card className="p-6 bg-gradient-to-r from-health-primary/5 to-health-secondary/5 border-health-border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-health-primary">
            {todaysWorkouts[0]?.workout_name || t('exercise.todaysWorkout')}
          </div>
          <p className="text-health-text-secondary mt-1">
            {format(currentSelectedDate, 'EEEE, MMM d')}
            {isToday && (
              <Badge variant="outline" className="ml-2 bg-blue-50 border-blue-200 text-blue-700">
                {t('exercise.today') || 'Today'}
              </Badge>
            )}
          </p>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-health-primary">
            {completedExercises}/{totalExercises}
          </div>
          <p className="text-health-text-secondary mt-1">
            {t('exercise.exercisesCompleted') || 'Exercises Completed'}
          </p>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-health-primary">
            {Math.round(progressPercentage)}%
          </div>
          <p className="text-health-text-secondary mt-1">
            {t('exercise.workoutProgress') || 'Workout Progress'}
          </p>
          <Progress value={progressPercentage} className="mt-2 h-2" />
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-3">
        <Button
          className="bg-green-600 hover:bg-green-700 text-white px-6"
          disabled={progressPercentage >= 100}
        >
          <Calendar className="w-4 h-4 mr-2" />
          {progressPercentage >= 100 
            ? (t('exercise.workoutCompleted') || 'Workout Completed!') 
            : (t('exercise.startWorkout') || 'Start Workout')
          }
        </Button>

        <Button
          variant="outline"
          onClick={() => {/* Handle reset */}}
          className="border-health-border hover:bg-health-soft"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {t('exercise.reset') || 'Reset'}
        </Button>
      </div>
    </Card>
  );
};
