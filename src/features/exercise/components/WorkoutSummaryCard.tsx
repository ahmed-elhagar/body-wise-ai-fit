
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play } from "lucide-react";
import { ProgramTypeIndicator } from "@/features/exercise";

interface WorkoutSummaryCardProps {
  currentWorkout: any;
  currentProgram: any;
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  workoutType: "home" | "gym";
}

export const WorkoutSummaryCard = ({ 
  currentWorkout, 
  currentProgram, 
  completedExercises, 
  totalExercises, 
  progressPercentage,
  workoutType 
}: WorkoutSummaryCardProps) => {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Today's Workout</h3>
        <ProgramTypeIndicator type={workoutType} />
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-800">{currentWorkout?.workout_name || 'Rest Day'}</h4>
          <p className="text-sm text-gray-600">{currentProgram?.difficulty_level}</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Duration</span>
            <span className="text-sm font-medium">{currentWorkout?.estimated_duration || 0} min</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Calories</span>
            <span className="text-sm font-medium">{currentWorkout?.estimated_calories || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Muscle Groups</span>
            <span className="text-sm font-medium">{currentWorkout?.muscle_groups?.join(', ') || 'Full Body'}</span>
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

        {currentWorkout && (
          <Button className="w-full bg-fitness-gradient hover:opacity-90 text-white">
            <Play className="w-4 h-4 mr-2" />
            {progressPercentage > 0 ? 'Continue Workout' : 'Start Workout'}
          </Button>
        )}
      </div>
    </Card>
  );
};
