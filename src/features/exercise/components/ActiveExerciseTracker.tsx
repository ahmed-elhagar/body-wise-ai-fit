
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Timer, Play, Pause, Square, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ActiveExerciseTrackerProps {
  exercise: any;
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
  const { t } = useLanguage();
  const [currentSet, setCurrentSet] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = async () => {
    await onComplete(exercise.id);
    onDeactivate();
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">{exercise.name}</h3>
          <p className="text-sm text-gray-600">Set {currentSet} of {exercise.sets || 3}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4" />
          <span className="font-mono text-lg">{formatTime(timer)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <Progress value={(currentSet / (exercise.sets || 3)) * 100} className="h-2" />
        
        <div className="flex gap-2">
          <Button
            onClick={() => setIsActive(!isActive)}
            variant={isActive ? "outline" : "default"}
            size="sm"
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          
          <Button
            onClick={handleComplete}
            variant="outline"
            size="sm"
            className="text-green-600"
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Complete
          </Button>
          
          <Button
            onClick={onDeactivate}
            variant="outline"
            size="sm"
          >
            <Square className="w-4 h-4" />
            Stop
          </Button>
        </div>
      </div>
    </Card>
  );
};
