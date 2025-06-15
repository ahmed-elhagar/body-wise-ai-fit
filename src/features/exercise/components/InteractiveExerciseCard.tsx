
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Dumbbell, Play, Timer, Youtube, RefreshCw, BookOpen } from "lucide-react";
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
    <Card className={`transition-all duration-200 overflow-hidden ${
      exercise.completed 
        ? 'bg-green-50 border-green-200 shadow-sm' 
        : 'hover:shadow-lg border-gray-200 bg-white'
    }`}>
      <div className="p-4">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              exercise.completed 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-100 text-blue-600'
            }`}>
              {exercise.completed ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
              {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                <p className="text-sm text-gray-600">
                  {exercise.muscle_groups.slice(0, 2).join(', ')}
                  {exercise.muscle_groups.length > 2 && ` +${exercise.muscle_groups.length - 2}`}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!exercise.completed ? (
              <Button
                onClick={() => onExerciseComplete(exercise.id)}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Complete
              </Button>
            ) : (
              <Badge className="bg-green-600">
                ✓ Completed
              </Badge>
            )}
          </div>
        </div>

        {/* Exercise Details */}
        <div className="flex flex-wrap gap-2 mb-3">
          {exercise.sets && (
            <Badge variant="outline" className="text-xs">
              <Dumbbell className="w-3 h-3 mr-1" />
              {exercise.sets} sets
            </Badge>
          )}
          {exercise.reps && (
            <Badge variant="outline" className="text-xs">
              {exercise.reps} reps
            </Badge>
          )}
          {exercise.rest_seconds && (
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(exercise.rest_seconds)} rest
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            {isExpanded ? 'Hide Details' : 'View Details'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="px-3"
          >
            <Youtube className="w-4 h-4 text-red-600" />
          </Button>
          
          {!exercise.completed && (
            <Button
              variant="outline"
              size="sm"
              className="px-3"
            >
              <RefreshCw className="w-4 h-4 text-orange-600" />
            </Button>
          )}
        </div>

        {/* Expandable Instructions */}
        {isExpanded && exercise.instructions && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Instructions</span>
            </div>
            <p className="text-sm text-blue-800">{exercise.instructions}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
