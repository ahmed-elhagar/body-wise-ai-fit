
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
  Loader2
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
  const [currentReps, setCurrentReps] = useState('');
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isTrackingProgress, setIsTrackingProgress] = useState(false);

  const totalSets = exercise.sets || 3;
  const restSeconds = exercise.rest_seconds || 60;

  // Rest timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev - 1);
      }, 1000);
    } else if (restTimer === 0 && isResting) {
      setIsResting(false);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const handleSetComplete = async () => {
    if (!currentReps || isTrackingProgress) return;

    try {
      setIsTrackingProgress(true);
      
      await onTrackProgress(
        exercise.id, 
        currentSet, 
        currentReps, 
        currentWeight || undefined, 
        `Set ${currentSet} completed`
      );

      setCompletedSets(prev => [...prev, currentSet]);
      
      if (currentSet < totalSets) {
        setCurrentSet(prev => prev + 1);
        setCurrentReps('');
        setCurrentWeight(0);
        setRestTimer(restSeconds);
        setIsResting(true);
      } else {
        // All sets complete
        onComplete(exercise.id);
      }
    } catch (error) {
      console.error('Error tracking set:', error);
    } finally {
      setIsTrackingProgress(false);
    }
  };

  const handleSkipRest = () => {
    setRestTimer(0);
    setIsResting(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (completedSets.length / totalSets) * 100;

  return (
    <Card className={`transition-all duration-200 ${
      exercise.completed 
        ? 'bg-green-50 border-green-200' 
        : isActive 
        ? 'border-blue-500 shadow-md' 
        : 'hover:shadow-sm'
    }`}>
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
            {exercise.completed && (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            )}
            <Button
              onClick={() => onExchange(exercise.id, 'User requested alternative')}
              disabled={isExchanging}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
            >
              {isExchanging ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {exercise.instructions && (
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
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

        {!exercise.completed && (
          <>
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{completedSets.length}/{totalSets} sets</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Rest Timer */}
            {isResting && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
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
            {!isResting && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-blue-900">
                    Set {currentSet} of {totalSets}
                  </h4>
                  <Button
                    onClick={() => setIsActive(!isActive)}
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-300"
                  >
                    {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">
                      Reps
                    </label>
                    <Input
                      value={currentReps}
                      onChange={(e) => setCurrentReps(e.target.value)}
                      placeholder={exercise.reps}
                      className="text-center"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">
                      Weight (kg)
                    </label>
                    <Input
                      type="number"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(Number(e.target.value))}
                      min="0"
                      step="0.5"
                      className="text-center"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleSetComplete}
                      disabled={!currentReps || isTrackingProgress}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      {isTrackingProgress ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Complete Set'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Complete Exercise Button */}
            {completedSets.length === totalSets && (
              <div className="pt-4 border-t">
                <Button
                  onClick={() => onComplete(exercise.id)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete Exercise
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartExerciseCard;
