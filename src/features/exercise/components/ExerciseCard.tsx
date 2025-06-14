
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Check, 
  Clock, 
  Target, 
  Dumbbell,
  Info,
  Plus,
  Minus
} from "lucide-react";
import { Exercise } from "../types";

interface ExerciseCardProps {
  exercise: Exercise;
  onComplete: (exerciseId: string) => Promise<void>;
  onProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  isActive: boolean;
  onSetActive: () => void;
}

export const ExerciseCard = ({
  exercise,
  onComplete,
  onProgressUpdate,
  isActive,
  onSetActive
}: ExerciseCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentSets, setCurrentSets] = useState(exercise.sets || 0);
  const [currentWeight, setCurrentWeight] = useState(0);

  const handleComplete = async () => {
    setIsUpdating(true);
    try {
      await onComplete(exercise.id);
    } catch (error) {
      console.error('Error completing exercise:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleProgressUpdate = async () => {
    setIsUpdating(true);
    try {
      await onProgressUpdate(exercise.id, currentSets, exercise.reps || "", "", currentWeight);
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className={`p-4 transition-all duration-200 ${
      isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
    } ${exercise.completed ? 'bg-green-50 border-green-200' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{exercise.name}</h4>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            {exercise.sets && (
              <span className="flex items-center gap-1">
                <Dumbbell className="w-3 h-3" />
                {exercise.sets} sets
              </span>
            )}
            {exercise.reps && (
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {exercise.reps} reps
              </span>
            )}
            {exercise.rest_seconds && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {exercise.rest_seconds}s rest
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {exercise.difficulty && (
            <Badge variant="outline" className="text-xs">
              {exercise.difficulty}
            </Badge>
          )}
          
          {exercise.completed ? (
            <Badge className="bg-green-500 text-white">
              <Check className="w-3 h-3 mr-1" />
              Done
            </Badge>
          ) : (
            <div className="flex gap-1">
              {!isActive ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSetActive}
                  className="text-blue-600 border-blue-200"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Start
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleComplete}
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Complete
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {exercise.muscle_groups.map((muscle, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {muscle}
            </Badge>
          ))}
        </div>
      )}

      {isActive && !exercise.completed && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Track Progress</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-blue-700 block mb-1">Sets completed</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentSets(Math.max(0, currentSets - 1))}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-sm font-medium w-8 text-center">{currentSets}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentSets(currentSets + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-xs text-blue-700 block mb-1">Weight (kg)</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeight(Math.max(0, currentWeight - 2.5))}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-sm font-medium w-12 text-center">{currentWeight}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeight(currentWeight + 2.5)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          <Button
            onClick={handleProgressUpdate}
            disabled={isUpdating}
            size="sm"
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
          >
            {isUpdating ? 'Updating...' : 'Update Progress'}
          </Button>
        </div>
      )}

      {exercise.instructions && (
        <div className="mt-3 text-xs text-gray-600">
          <p className="line-clamp-2">{exercise.instructions}</p>
        </div>
      )}
    </Card>
  );
};
