
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Dumbbell, Play, Timer } from "lucide-react";
import { useWorkoutTimer } from "@/hooks/useWorkoutTimer";

interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  rest_seconds?: number;
  muscle_groups?: string[];
  instructions?: string;
  completed: boolean;
}

interface InteractiveExerciseCardProps {
  exercise: Exercise;
  index: number;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
}

export const InteractiveExerciseCard = ({
  exercise,
  index,
  onExerciseComplete,
  onExerciseProgressUpdate
}: InteractiveExerciseCardProps) => {
  const { formatTime } = useWorkoutTimer();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={`p-3 transition-all duration-200 ${
      exercise.completed 
        ? 'bg-green-50 border-green-200 shadow-sm' 
        : 'hover:shadow-md border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
              {index + 1}
            </div>
            <h3 className="font-semibold text-sm">{exercise.name}</h3>
            {exercise.completed && (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {exercise.sets && (
              <Badge variant="outline" className="text-xs h-5">
                {exercise.sets} sets
              </Badge>
            )}
            {exercise.reps && (
              <Badge variant="outline" className="text-xs h-5">
                {exercise.reps} reps
              </Badge>
            )}
            {exercise.rest_seconds && (
              <Badge variant="outline" className="text-xs h-5">
                <Clock className="w-2 h-2 mr-1" />
                {formatTime(exercise.rest_seconds)} rest
              </Badge>
            )}
          </div>
          
          {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {exercise.muscle_groups.slice(0, 3).map((group, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs h-5">
                  {group}
                </Badge>
              ))}
              {exercise.muscle_groups.length > 3 && (
                <Badge variant="secondary" className="text-xs h-5">
                  +{exercise.muscle_groups.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="ml-3">
          {!exercise.completed ? (
            <Button
              onClick={() => onExerciseComplete(exercise.id)}
              size="sm"
              className="bg-green-600 hover:bg-green-700 h-7 px-3 text-xs"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Done
            </Button>
          ) : (
            <Badge className="bg-green-600 text-xs h-7 px-3">
              ✓ Complete
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};
