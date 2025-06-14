
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkoutSessionManagerProps {
  exercises: any[];
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  onSessionComplete: () => void;
}

export const WorkoutSessionManager = ({ 
  exercises, 
  onExerciseComplete, 
  onExerciseProgressUpdate, 
  onSessionComplete 
}: WorkoutSessionManagerProps) => {
  const { t } = useLanguage();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const completedCount = exercises.filter(ex => ex.completed).length;
  const progressPercentage = exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;

  const handleStartSession = () => {
    setIsSessionActive(true);
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    if (completedCount === exercises.length) {
      onSessionComplete();
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">{t('Workout Session')}</h3>
          <p className="text-sm text-gray-600">
            {completedCount}/{exercises.length} exercises completed
          </p>
        </div>
        
        <div className="flex gap-2">
          {!isSessionActive ? (
            <Button onClick={handleStartSession} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-1" />
              Start Session
            </Button>
          ) : (
            <Button onClick={handleEndSession} variant="outline">
              <Square className="w-4 h-4 mr-1" />
              End Session
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-3" />
      </div>

      {progressPercentage === 100 && (
        <div className="mt-4 p-3 bg-green-100 rounded-lg text-center">
          <Trophy className="w-6 h-6 mx-auto mb-2 text-green-600" />
          <p className="text-green-800 font-semibold">Workout Complete! 🎉</p>
        </div>
      )}
    </Card>
  );
};
