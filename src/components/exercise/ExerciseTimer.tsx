import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useI18n";
import { Play, Pause, SkipForward, RotateCw } from "lucide-react";

interface ExerciseTimerProps {
  duration: number;
  onComplete: () => void;
}

export const ExerciseTimer = ({ duration, onComplete }: ExerciseTimerProps) => {
  const { t } = useI18n();
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      onComplete();
    }

    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft, onComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const skipTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    onComplete();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {t('exercise.restTimer')}
      </h3>
      <div className="text-4xl font-bold text-fitness-primary mb-4">
        {formatTime(timeLeft)}
      </div>
      
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          className="bg-white/80"
          onClick={resetTimer}
        >
          <RotateCw className="w-4 h-4 mr-2" />
          {t('exercise.reset')}
        </Button>
        
        <Button
          className="bg-fitness-gradient hover:opacity-90 text-white"
          onClick={toggleTimer}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              {t('exercise.pause')}
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              {t('exercise.start')}
            </>
          )}
        </Button>
        
        <Button
          variant="ghost"
          onClick={skipTimer}
        >
          <SkipForward className="w-4 h-4 mr-2" />
          {t('exercise.skip')}
        </Button>
      </div>
    </Card>
  );
};
