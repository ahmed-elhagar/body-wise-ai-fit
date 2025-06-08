
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, SkipForward } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { Exercise } from '@/types/exercise';

interface WorkoutSessionManagerProps {
  exercises: Exercise[];
  onExerciseComplete: (exerciseId: string) => void;
  onSessionComplete: () => void;
}

export const WorkoutSessionManager = ({
  exercises,
  onExerciseComplete,
  onSessionComplete
}: WorkoutSessionManagerProps) => {
  const { t, isRTL } = useI18n();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const currentExercise = exercises[currentExerciseIndex];
  const completedCount = exercises.filter(ex => ex.completed).length;
  const progress = exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleStop = () => {
    setIsActive(false);
    setTimeElapsed(0);
    setCurrentExerciseIndex(0);
  };

  const handleNext = () => {
    if (currentExercise) {
      onExerciseComplete(currentExercise.id);
    }
    
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      setIsActive(false);
      onSessionComplete();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('exercise:workoutSession') || 'Workout Session'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {formatTime(timeElapsed)}
          </div>
          <div className="text-sm text-gray-600">
            {t('exercise:exercise') || 'Exercise'} {currentExerciseIndex + 1} {t('exercise:of') || 'of'} {exercises.length}
          </div>
        </div>

        {currentExercise && (
          <div className="text-center p-4 bg-white rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{currentExercise.name}</h3>
            <p className="text-gray-600 text-sm">
              {currentExercise.sets} sets × {currentExercise.reps} reps
            </p>
          </div>
        )}

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className={`flex gap-2 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          {!isActive ? (
            <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              {t('exercise:start') || 'Start'}
            </Button>
          ) : (
            <Button onClick={handlePause} variant="outline">
              <Pause className="w-4 h-4 mr-2" />
              {t('exercise:pause') || 'Pause'}
            </Button>
          )}
          
          <Button onClick={handleNext} variant="outline">
            <SkipForward className="w-4 h-4 mr-2" />
            {t('exercise:next') || 'Next'}
          </Button>
          
          <Button onClick={handleStop} variant="outline">
            <Square className="w-4 h-4 mr-2" />
            {t('exercise:stop') || 'Stop'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutSessionManager;
