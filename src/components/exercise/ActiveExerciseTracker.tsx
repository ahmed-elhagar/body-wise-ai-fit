
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, CheckCircle, Timer } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useI18n } from '@/hooks/useI18n';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest_time: number;
}

interface ActiveExerciseTrackerProps {
  exercise: Exercise;
  onComplete: () => void;
  onSkip: () => void;
}

const ActiveExerciseTracker = ({ exercise, onComplete, onSkip }: ActiveExerciseTrackerProps) => {
  const { t } = useI18n();
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

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
    if (currentSet < exercise.sets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setRestTimer(exercise.rest_time);
      setIsTimerRunning(true);
    } else {
      onComplete();
    }
  };

  const startRest = () => {
    setIsResting(true);
    setRestTimer(exercise.rest_time);
    setIsTimerRunning(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{exercise.name}</span>
          <Badge variant="outline">
            {t('exercise:set')} {currentSet} / {exercise.sets}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">
            {exercise.reps} {t('exercise:reps')}
          </div>
          <p className="text-gray-600">
            {t('exercise:currentSet')} {currentSet}
          </p>
        </div>

        {isResting && (
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Timer className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {formatTime(restTimer)}
            </div>
            <p className="text-sm text-blue-600">
              {t('exercise:restTime')}
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsTimerRunning(!isTimerRunning);
                }}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setRestTimer(exercise.rest_time);
                  setIsTimerRunning(false);
                }}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleSetComplete}
            disabled={isResting && isTimerRunning}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {currentSet === exercise.sets ? 
              t('exercise:complete') : 
              t('exercise:setDone')
            }
          </Button>
          
          <Button
            onClick={onSkip}
            variant="outline"
          >
            {t('exercise:skip')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveExerciseTracker;
