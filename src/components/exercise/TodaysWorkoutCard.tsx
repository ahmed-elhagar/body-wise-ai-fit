
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Zap, Target, CheckCircle } from "lucide-react";
import { ProgramTypeIndicator } from "./ProgramTypeIndicator";

interface TodaysWorkoutCardProps {
  todaysWorkouts: any[];
  currentProgram: any;
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  workoutType: "home" | "gym";
  selectedDay: number;
}

export const TodaysWorkoutCard = ({
  todaysWorkouts,
  currentProgram,
  completedExercises,
  totalExercises,
  progressPercentage,
  workoutType,
  selectedDay
}: TodaysWorkoutCardProps) => {
  const currentWorkout = todaysWorkouts?.[0];
  const isRestDay = !currentWorkout;
  
  if (isRestDay) {
    return (
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Rest Day</h3>
          <p className="text-gray-600 mb-4">
            Take a well-deserved break and let your muscles recover.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• Stay hydrated</p>
            <p>• Light stretching</p>
            <p>• Get adequate sleep</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Day {selectedDay} Workout</h3>
        <ProgramTypeIndicator type={workoutType} />
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-800 mb-1">{currentWorkout?.workout_name}</h4>
          <p className="text-sm text-gray-600">{currentProgram?.difficulty_level}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-fitness-primary" />
            <div>
              <p className="text-xs text-gray-600">Duration</p>
              <p className="text-sm font-medium">{currentWorkout?.estimated_duration || 0} min</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-fitness-primary" />
            <div>
              <p className="text-xs text-gray-600">Calories</p>
              <p className="text-sm font-medium">{currentWorkout?.estimated_calories || 0}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-fitness-primary" />
          <div className="flex-1">
            <p className="text-xs text-gray-600 mb-1">Target Muscles</p>
            <div className="flex flex-wrap gap-1">
              {currentWorkout?.muscle_groups?.map((muscle: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {muscle}
                </Badge>
              )) || <Badge variant="outline" className="text-xs">Full Body</Badge>}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium">
              {completedExercises}/{totalExercises}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Button 
          className="w-full bg-fitness-gradient hover:opacity-90 text-white"
          disabled={totalExercises === 0}
        >
          <Play className="w-4 h-4 mr-2" />
          {progressPercentage > 0 ? 'Continue Workout' : 'Start Workout'}
        </Button>
      </div>
    </Card>
  );
};
