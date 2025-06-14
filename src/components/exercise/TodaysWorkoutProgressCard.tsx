
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, CheckCircle, Play, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

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
  
  const workout = todaysWorkouts[0];
  const isCompleted = progressPercentage === 100;

  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/5 to-purple-500/10 rounded-3xl" />
      
      <Card className="relative p-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Workout Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                  isCompleted 
                    ? "bg-gradient-to-br from-green-500 to-green-600" 
                    : "bg-gradient-to-br from-blue-500 to-purple-600"
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Target className="w-6 h-6 text-white" />
                  )}
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {workout?.workout_name || 'Today\'s Workout'}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      {format(currentSelectedDate, 'EEEE, MMMM d')}
                      {isToday && (
                        <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 text-xs">
                          Today
                        </Badge>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {completedExercises}/{totalExercises}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Exercises Completed</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Workout Progress</div>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="flex flex-col gap-4 min-w-[200px]">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">Progress</span>
                  <span className="font-bold text-gray-900">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className="h-3 bg-gray-100"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!isCompleted ? (
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg rounded-xl font-semibold py-3 transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Workout
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    className="flex-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 rounded-xl font-semibold py-3 transition-all duration-300 hover:scale-105"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed!
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  className="bg-white/80 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl px-4 transition-all duration-300 hover:scale-105"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
