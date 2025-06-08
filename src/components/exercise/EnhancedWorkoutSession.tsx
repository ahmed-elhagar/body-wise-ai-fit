import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timer, Play, Pause, SkipForward, CheckCircle } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface EnhancedWorkoutSessionProps {
  exercises: any[];
  onComplete: () => void;
}

const EnhancedWorkoutSession = ({ exercises, onComplete }: EnhancedWorkoutSessionProps) => {
  const { t, isRTL } = useI18n();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive) {
      intervalId = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isActive]);

  const handleTogglePause = () => {
    setIsActive((prevIsActive) => !prevIsActive);
  };

  const handleSkipForward = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
      setTimeElapsed(0);
      setIsActive(false);
    }
  };

  const handleCompleteExercise = () => {
    if (currentExerciseIndex === exercises.length - 1) {
      onComplete();
    } else {
      handleSkipForward();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Timer className="w-5 h-5" />
          {t('exercise:workoutSession') || 'Workout Session'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Enhanced workout session content */}
        <div className="space-y-4">
          <Progress value={(currentExerciseIndex / exercises.length) * 100} />
          <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
            <p className="text-lg font-semibold">
              {exercises[currentExerciseIndex]?.name || t('exercise:noExercise')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedWorkoutSession;
