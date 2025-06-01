import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface RestTimerCardProps {
  restTime: number;
  onRestComplete: () => void;
}

export const RestTimerCard = ({ restTime, onRestComplete }: RestTimerCardProps) => {
  const { t } = useI18n();
  const [timeLeft, setTimeLeft] = useState(restTime);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onRestComplete();
    }

    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft, onRestComplete]);

  const togglePause = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8 text-blue-600" />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-blue-800 mb-2">
            {t('exercise.rest')}
          </h3>
          <p className="text-blue-700 mb-4">
            {t('exercise.nextExerciseStartsIn')}
          </p>
        </div>

        <div className="text-5xl font-semibold text-blue-900">
          {formatTime(timeLeft)}
        </div>

        <Button 
          onClick={togglePause}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isRunning ? t('exercise.pause') : t('exercise.resume')}
        </Button>
      </div>
    </Card>
  );
};

