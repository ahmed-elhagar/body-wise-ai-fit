
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle, Coffee, Clock, Target } from "lucide-react";
import EnhancedLoadingIndicator from "@/components/ui/enhanced-loading-indicator";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  completed: boolean;
  progressPercentage: number;
  muscle_groups?: string[];
  equipment?: string;
  rest_seconds?: number;
}

interface OptimizedExerciseDayViewProps {
  currentWorkout: any;
  exercises: Exercise[];
  selectedDay: number;
  onStartWorkout: () => void;
  onCompleteWorkout: () => void;
  isLoading: boolean;
}

const OptimizedExerciseDayView = React.memo<OptimizedExerciseDayViewProps>(({ 
  currentWorkout, 
  exercises, 
  selectedDay,
  onStartWorkout,
  onCompleteWorkout,
  isLoading 
}) => {
  if (!currentWorkout) {
    return (
      <Card className="p-8 text-center">
        <Coffee className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Rest Day</h3>
        <p className="text-gray-600">Take a well-deserved break and let your muscles recover.</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <EnhancedLoadingIndicator
          status="loading"
          type="exercise"
          message="Loading workout..."
          size="sm"
          variant="inline"
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">{currentWorkout.workout_name}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {currentWorkout.estimated_duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{currentWorkout.estimated_duration} min</span>
              </div>
            )}
            {currentWorkout.estimated_calories && (
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{currentWorkout.estimated_calories} cal</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          {!currentWorkout.completed && (
            <Button 
              onClick={onStartWorkout}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Workout
            </Button>
          )}
          
          <Button 
            onClick={onCompleteWorkout}
            variant={currentWorkout.completed ? "secondary" : "outline"}
            disabled={currentWorkout.completed}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {currentWorkout.completed ? 'Completed' : 'Complete All'}
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <Card key={exercise.id} className="p-4 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-lg">{exercise.name}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span>{exercise.sets} sets × {exercise.reps} reps</span>
                  {exercise.rest_seconds && (
                    <span>Rest: {exercise.rest_seconds}s</span>
                  )}
                  {exercise.equipment && (
                    <Badge variant="outline" className="text-xs">
                      {exercise.equipment}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {Math.round(exercise.progressPercentage)}%
                  </div>
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${exercise.progressPercentage}%` }}
                    />
                  </div>
                </div>
                
                {exercise.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Button size="sm" variant="outline">
                    Start
                  </Button>
                )}
              </div>
            </div>
            
            {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {exercise.muscle_groups.map((muscle) => (
                  <Badge key={muscle} variant="secondary" className="text-xs">
                    {muscle}
                  </Badge>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </Card>
  );
});

OptimizedExerciseDayView.displayName = 'OptimizedExerciseDayView';

export default OptimizedExerciseDayView;
