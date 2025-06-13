
import { Exercise } from '../types';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Dumbbell, Target, Clock } from "lucide-react";

interface ExerciseListViewProps {
  exercises: Exercise[];
  onExerciseComplete: (exerciseId: string) => Promise<void>;
}

export const ExerciseListView = ({
  exercises,
  onExerciseComplete
}: ExerciseListViewProps) => {
  return (
    <div className="space-y-3">
      {exercises.map((exercise, index) => (
        <Card key={exercise.id} className={`p-4 transition-all duration-200 ${
          exercise.completed 
            ? 'bg-green-50 border-green-200' 
            : 'bg-white border-gray-200 hover:border-fitness-primary-300 hover:shadow-md'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                exercise.completed 
                  ? 'bg-green-500 text-white' 
                  : 'bg-fitness-primary-100 text-fitness-primary-600'
              }`}>
                {exercise.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{index + 1}</span>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span>{exercise.sets || 3} × {exercise.reps || '10'}</span>
                  </div>
                  {exercise.rest_seconds && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{exercise.rest_seconds}s rest</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {exercise.completed ? (
                <Badge className="bg-green-500 text-white">
                  Completed
                </Badge>
              ) : (
                <Button
                  onClick={() => onExerciseComplete(exercise.id)}
                  size="sm"
                  className="bg-fitness-primary-500 hover:bg-fitness-primary-600"
                >
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
