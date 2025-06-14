
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Clock,
  Target,
  Dumbbell,
  X
} from "lucide-react";
import { Exercise } from "../types";

interface ActiveExerciseTrackerProps {
  exercise: Exercise;
  onComplete: (exerciseId: string) => Promise<void>;
  onProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  onDeactivate: () => void;
}

export const ActiveExerciseTracker = ({
  exercise,
  onComplete,
  onProgressUpdate,
  onDeactivate
}: ActiveExerciseTrackerProps) => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [completedSets, setCompletedSets] = useState(0);
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTimer(0);
    setIsRunning(false);
  };

  const handleCompleteSet = () => {
    setCompletedSets(prev => prev + 1);
    setCurrentSet(prev => prev + 1);
    
    // Auto-pause for rest between sets
    setIsRunning(false);
  };

  const handleCompleteExercise = async () => {
    try {
      await onProgressUpdate(exercise.id, completedSets, exercise.reps || "", "", weight);
      await onComplete(exercise.id);
      onDeactivate();
    } catch (error) {
      console.error('Error completing exercise:', error);
    }
  };

  const progressPercentage = exercise.sets ? (completedSets / exercise.sets) * 100 : 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 sticky top-4 z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Active Exercise</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDeactivate}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-center mb-6">
        <h4 className="text-xl font-bold text-gray-900 mb-2">{exercise.name}</h4>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          {exercise.sets && (
            <span className="flex items-center gap-1">
              <Dumbbell className="w-4 h-4" />
              {exercise.sets} sets
            </span>
          )}
          {exercise.reps && (
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              {exercise.reps} reps
            </span>
          )}
        </div>
      </div>

      {/* Timer */}
      <div className="text-center mb-6">
        <div className="text-4xl font-mono font-bold text-blue-600 mb-2">
          {formatTime(timer)}
        </div>
        <div className="flex justify-center gap-2">
          <Button
            onClick={handleStartPause}
            className={isRunning ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Progress */}
      {exercise.sets && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Set Progress
            </span>
            <span className="text-sm text-gray-600">
              {completedSets}/{exercise.sets}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2 mb-3" />
          
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 mb-2">
              Current Set: {currentSet}
            </div>
            {currentSet <= (exercise.sets || 0) && (
              <Button
                onClick={handleCompleteSet}
                disabled={completedSets >= (exercise.sets || 0)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Check className="w-4 h-4 mr-1" />
                Complete Set {currentSet}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Weight Tracking */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Weight (kg)
        </label>
        <div className="flex items-center gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeight(Math.max(0, weight - 2.5))}
          >
            -
          </Button>
          <span className="text-lg font-semibold w-16 text-center">{weight}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeight(weight + 2.5)}
          >
            +
          </Button>
        </div>
      </div>

      {/* Complete Exercise */}
      <Button
        onClick={handleCompleteExercise}
        disabled={completedSets === 0}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        size="lg"
      >
        <Check className="w-5 h-5 mr-2" />
        Complete Exercise
      </Button>

      {exercise.instructions && (
        <div className="mt-4 p-3 bg-white/80 rounded-lg">
          <h5 className="text-sm font-medium text-gray-900 mb-1">Instructions:</h5>
          <p className="text-sm text-gray-600">{exercise.instructions}</p>
        </div>
      )}
    </Card>
  );
};
