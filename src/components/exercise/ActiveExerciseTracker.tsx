
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timer, Play, Pause, CheckCircle, SkipForward } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { Exercise } from '@/types/exercise';

interface ActiveExerciseTrackerProps {
  exercise: Exercise;
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const ActiveExerciseTracker = ({ 
  exercise, 
  onComplete, 
  onNext, 
  onPrevious 
}: ActiveExerciseTrackerProps) => {
  const { t, isRTL } = useI18n();
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleNextSet = () => {
    if (currentSet < (exercise.sets || 1)) {
      setCurrentSet(prev => prev + 1);
      setTimeElapsed(0);
      setIsTimerRunning(false);
    }
  };

  const totalSets = exercise.sets || 1;
  const progress = (currentSet / totalSets) * 100;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Timer className="w-5 h-5 text-blue-600" />
          {t('exercise:activeExercise') || 'Active Exercise'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{exercise.name}</h3>
          <p className="text-gray-600">
            {t('exercise:set')} {currentSet} {t('common:of')} {totalSets}
          </p>
        </div>

        <div className="space-y-2">
          <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span>{t('exercise:progress')}</span>
            <span>{currentSet}/{totalSets}</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {formatTime(timeElapsed)}
          </div>
          <p className="text-sm text-gray-600">
            {exercise.reps} {t('exercise:reps')} • {exercise.rest_seconds || 60}s {t('exercise:rest')}
          </p>
        </div>

        <div className={`flex gap-3 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="outline"
            onClick={handleStartTimer}
            className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isTimerRunning ? t('exercise:pause') : t('exercise:start')}
          </Button>

          {currentSet < totalSets ? (
            <Button
              onClick={handleNextSet}
              className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <SkipForward className="w-4 h-4" />
              {t('exercise:nextSet')}
            </Button>
          ) : (
            <Button
              onClick={onComplete}
              className={`bg-green-600 hover:bg-green-700 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <CheckCircle className="w-4 h-4" />
              {t('exercise:complete')}
            </Button>
          )}
        </div>

        {exercise.instructions && (
          <div className="p-3 bg-white rounded-lg border">
            <p className="text-sm text-gray-700">{exercise.instructions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveExerciseTracker;
