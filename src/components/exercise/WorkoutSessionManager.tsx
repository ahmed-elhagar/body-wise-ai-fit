
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Exercise } from '@/features/exercise/types';
import { WorkoutSessionStats } from './WorkoutSessionStats';
import { WorkoutSessionControls } from './WorkoutSessionControls';
import { CurrentExerciseIndicator } from './CurrentExerciseIndicator';
import { SessionCompleteCard } from './SessionCompleteCard';

interface WorkoutSessionManagerProps {
  exercises: Exercise[];
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => void;
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
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);

  // Update session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive && sessionStartTime) {
      interval = setInterval(() => {
        setSessionDuration(Math.floor((Date.now() - sessionStartTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, sessionStartTime]);

  const completedExercises = exercises.filter(ex => ex.completed).length;
  const totalExercises = exercises.length;
  const sessionProgress = (completedExercises / totalExercises) * 100;

  const estimatedCalories = exercises.reduce((total, ex) => {
    return total + (ex.sets || 3) * 5;
  }, 0);

  const startSession = () => {
    setIsSessionActive(true);
    setSessionStartTime(new Date());
    setCurrentExerciseIndex(0);
  };

  const pauseSession = () => {
    setIsSessionActive(false);
  };

  const resumeSession = () => {
    setIsSessionActive(true);
  };

  const endSession = () => {
    setIsSessionActive(false);
    setSessionStartTime(null);
    setSessionDuration(0);
    onSessionComplete();
  };

  const moveToNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const currentExercise = exercises[currentExerciseIndex] || null;
  const canMoveNext = currentExerciseIndex < exercises.length - 1;

  return (
    <Card className="p-4 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      {/* Session Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{t('Workout Session')}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              {totalExercises} {t('exercises')}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              ~{estimatedCalories} {t('calories')}
            </span>
          </div>
        </div>
        <WorkoutSessionControls
          isSessionActive={isSessionActive}
          sessionStartTime={sessionStartTime}
          onStartSession={startSession}
          onPauseSession={pauseSession}
          onResumeSession={resumeSession}
          onEndSession={endSession}
        />
      </div>

      {/* Session Stats */}
      <WorkoutSessionStats
        sessionDuration={sessionDuration}
        completedExercises={completedExercises}
        totalExercises={totalExercises}
        sessionProgress={sessionProgress}
      />

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">{t('Session Progress')}</span>
          <Badge variant={sessionProgress === 100 ? "default" : "secondary"}>
            {completedExercises}/{totalExercises} {t('exercises')}
          </Badge>
        </div>
        <Progress value={sessionProgress} className="h-3" />
      </div>

      {/* Current Exercise Indicator */}
      <CurrentExerciseIndicator
        isSessionActive={isSessionActive}
        currentExercise={currentExercise}
        onMoveToNext={moveToNextExercise}
        canMoveNext={canMoveNext}
      />

      {/* Session Complete */}
      <SessionCompleteCard
        sessionProgress={sessionProgress}
        sessionDuration={sessionDuration}
      />
    </Card>
  );
};
