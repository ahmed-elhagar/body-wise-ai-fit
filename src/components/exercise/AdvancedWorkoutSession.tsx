
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Timer,
  CheckCircle,
  Target,
  Activity
} from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest_time: number;
  instructions?: string;
}

interface AdvancedWorkoutSessionProps {
  exercises: Exercise[];
  onComplete: () => void;
  onExit: () => void;
}

const AdvancedWorkoutSession = ({ exercises, onComplete, onExit }: AdvancedWorkoutSessionProps) => {
  const { t } = useI18n();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const currentExercise = exercises[currentExerciseIndex];
  const totalExercises = exercises.length;
  const overallProgress = ((currentExerciseIndex + (currentSet / currentExercise?.sets || 1)) / totalExercises) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, restTimer]);

  const handleSetComplete = () => {
    if (currentSet < currentExercise.sets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setRestTimer(currentExercise.rest_time);
      setIsTimerRunning(true);
    } else {
      // Exercise complete
      setCompletedExercises(prev => [...prev, currentExercise.id]);
      
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
        setIsResting(false);
        setRestTimer(0);
      } else {
        // Workout complete
        onComplete();
      }
    }
  };

  const skipExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
      setRestTimer(0);
    } else {
      onComplete();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {t('exercise:workoutSession')}
            </CardTitle>
            <Button variant="outline" onClick={onExit}>
              {t('exercise:exit')}
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{t('exercise:progress')}</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Current Exercise */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{currentExercise?.name}</CardTitle>
            <Badge variant="outline">
              {currentExerciseIndex + 1} / {totalExercises}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Set Info */}
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {currentExercise?.reps} {t('exercise:reps')}
            </div>
            <div className="flex items-center justify-center gap-2">
              <Target className="w-4 h-4" />
              <span>{t('exercise:set')} {currentSet} / {currentExercise?.sets}</span>
            </div>
          </div>

          {/* Instructions */}
          {currentExercise?.instructions && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">{t('exercise:instructions')}</h4>
              <p className="text-sm text-gray-700">{currentExercise.instructions}</p>
            </div>
          )}

          {/* Rest Timer */}
          {isResting && (
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <Timer className="w-12 h-12 mx-auto mb-3 text-orange-600" />
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {formatTime(restTimer)}
              </div>
              <p className="text-orange-700 mb-4">
                {t('exercise:restBetweenSets')}
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setRestTimer(currentExercise.rest_time);
                    setIsTimerRunning(false);
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleSetComplete}
              disabled={isResting && isTimerRunning}
              className="bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {currentSet === currentExercise?.sets ? 
                t('exercise:completeExercise') : 
                t('exercise:setComplete')
              }
            </Button>
            
            <Button
              onClick={skipExercise}
              variant="outline"
              size="lg"
            >
              <SkipForward className="w-5 h-5 mr-2" />
              {t('exercise:skip')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedWorkoutSession;
