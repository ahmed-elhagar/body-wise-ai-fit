
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Play, 
  Pause,
  RotateCcw, 
  Timer,
  Dumbbell,
  Target,
  Clock,
  SkipForward,
  Loader2,
  Plus,
  Minus,
  Edit3,
  RefreshCw
} from 'lucide-react';
import { Exercise } from '../types';

interface SmartExerciseCardProps {
  exercise: Exercise;
  onComplete: (exerciseId: string) => void;
  onTrackProgress: (exerciseId: string, sets: number, reps: string, weight?: number, notes?: string) => Promise<void>;
  onExchange: (exerciseId: string, reason: string) => void;
  isExchanging?: boolean;
}

export const SmartExerciseCard: React.FC<SmartExerciseCardProps> = ({
  exercise,
  onComplete,
  onTrackProgress,
  onExchange,
  isExchanging = false
}) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [currentReps, setCurrentReps] = useState(exercise.reps || '10');
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [completedSets, setCompletedSets] = useState<Array<{
    setNumber: number;
    reps: string;
    weight: number;
  }>>([]);
  const [isEditingReps, setIsEditingReps] = useState(false);
  const [isTrackingProgress, setIsTrackingProgress] = useState(false);

  const totalSets = exercise.sets || 3;
  const restSeconds = exercise.rest_seconds || 60;

  // Rest timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const handleCompleteSet = async () => {
    if (isTrackingProgress) return;

    try {
      setIsTrackingProgress(true);
      
      // Add completed set to our local state
      const newCompletedSet = {
        setNumber: currentSet,
        reps: currentReps,
        weight: currentWeight
      };
      
      setCompletedSets(prev => [...prev, newCompletedSet]);
      
      // Track progress in backend
      await onTrackProgress(
        exercise.id, 
        currentSet, 
        currentReps, 
        currentWeight || undefined, 
        `Set ${currentSet} of ${totalSets} completed`
      );

      if (currentSet < totalSets) {
        // Move to next set
        setCurrentSet(prev => prev + 1);
        setCurrentReps(exercise.reps || '10'); // Reset to default
        setCurrentWeight(currentWeight); // Keep same weight
        
        // Start rest timer
        if (restSeconds > 0) {
          setRestTimer(restSeconds);
          setIsResting(true);
        }
      } else {
        // All sets complete - complete the exercise
        onComplete(exercise.id);
      }
    } catch (error) {
      console.error('Error completing set:', error);
    } finally {
      setIsTrackingProgress(false);
    }
  };

  const handleSkipRest = () => {
    setRestTimer(0);
    setIsResting(false);
  };

  const handleReset = () => {
    setCurrentSet(1);
    setCurrentReps(exercise.reps || '10');
    setCurrentWeight(0);
    setCompletedSets([]);
    setRestTimer(0);
    setIsResting(false);
  };

  const adjustReps = (increment: boolean) => {
    const current = parseInt(currentReps) || 0;
    const newValue = increment ? current + 1 : Math.max(0, current - 1);
    setCurrentReps(newValue.toString());
  };

  const adjustWeight = (increment: boolean) => {
    const newValue = increment ? currentWeight + 2.5 : Math.max(0, currentWeight - 2.5);
    setCurrentWeight(newValue);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (completedSets.length / totalSets) * 100;

  const handleExchange = () => {
    onExchange(exercise.id, 'User requested alternative exercise');
  };

  if (exercise.completed) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <div>
                <CardTitle className="text-lg font-semibold text-green-800">
                  {exercise.name}
                </CardTitle>
                <p className="text-sm text-green-600">Exercise completed!</p>
              </div>
            </div>
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 mb-2">
              <Dumbbell className="h-5 w-5 text-blue-600" />
              {exercise.name}
            </CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {totalSets} sets
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Play className="h-3 w-3" />
                {exercise.reps} reps
              </Badge>
              {restSeconds > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  {restSeconds}s rest
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleExchange}
              disabled={isExchanging}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
              title="Change Exercise"
            >
              {isExchanging ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
              title="Reset Progress"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {exercise.instructions && (
          <p className="text-sm text-gray-600 leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100">
            {exercise.instructions}
          </p>
        )}

        {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {exercise.muscle_groups.map((group, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {group}
              </Badge>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{completedSets.length}/{totalSets} sets</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Completed Sets Summary */}
        {completedSets.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Completed Sets:</h4>
            <div className="flex flex-wrap gap-2">
              {completedSets.map((set, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  Set {set.setNumber}: {set.reps} reps {set.weight > 0 && `@ ${set.weight}kg`}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Rest Timer */}
        {isResting && (
          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Rest Time</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono font-bold text-orange-600">
                  {formatTime(restTimer)}
                </span>
                <Button
                  onClick={handleSkipRest}
                  size="sm"
                  variant="outline"
                  className="text-orange-600 border-orange-300 hover:bg-orange-100"
                >
                  <SkipForward className="h-4 w-4 mr-1" />
                  Skip
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Current Set Input */}
        {!isResting && currentSet <= totalSets && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-blue-900">
                Set {currentSet} of {totalSets}
              </h4>
              <Badge variant="outline" className="text-blue-700">
                {completedSets.length} completed
              </Badge>
            </div>
            
            {/* Reps and Weight Input */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Reps Input */}
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-2">
                  Reps
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => adjustReps(false)}
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  {isEditingReps ? (
                    <Input
                      value={currentReps}
                      onChange={(e) => setCurrentReps(e.target.value)}
                      onBlur={() => setIsEditingReps(false)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') setIsEditingReps(false);
                      }}
                      className="text-center w-16 h-10"
                      autoFocus
                    />
                  ) : (
                    <Button
                      onClick={() => setIsEditingReps(true)}
                      variant="ghost"
                      className="h-10 w-16 text-lg font-semibold"
                    >
                      {currentReps}
                    </Button>
                  )}
                  <Button
                    onClick={() => adjustReps(true)}
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Weight Input */}
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-2">
                  Weight (kg)
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => adjustWeight(false)}
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="text-lg font-semibold w-16 text-center h-10 flex items-center justify-center">
                    {currentWeight}
                  </div>
                  <Button
                    onClick={() => adjustWeight(true)}
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCompleteSet}
              disabled={isTrackingProgress}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isTrackingProgress ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete Set {currentSet}
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartExerciseCard;
