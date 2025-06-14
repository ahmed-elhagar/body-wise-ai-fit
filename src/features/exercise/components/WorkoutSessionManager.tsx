
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Target, 
  TrendingUp,
  CheckCircle,
  Trophy
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Exercise } from '../types';

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
  const sessionProgress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  const startSession = () => {
    setIsSessionActive(true);
    setSessionStartTime(new Date());
    setCurrentExerciseIndex(0);
  };

  const pauseSession = () => {
    setIsSessionActive(false);
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

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const estimatedCalories = exercises.reduce((total, ex) => {
    // Rough estimation: 5 calories per set
    return total + (ex.sets || 3) * 5;
  }, 0);

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
        <div className="flex items-center gap-2">
          {!isSessionActive && !sessionStartTime && (
            <Button onClick={startSession} className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              {t('Start Workout')}
            </Button>
          )}
          {isSessionActive && (
            <>
              <Button variant="outline" onClick={pauseSession}>
                <Pause className="w-4 h-4 mr-2" />
                {t('Pause')}
              </Button>
              <Button variant="destructive" onClick={endSession}>
                <Square className="w-4 h-4 mr-2" />
                {t('End')}
              </Button>
            </>
          )}
          {!isSessionActive && sessionStartTime && (
            <Button onClick={() => setIsSessionActive(true)} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              {t('Resume')}
            </Button>
          )}
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-white rounded-lg border">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">
            {formatDuration(sessionDuration)}
          </div>
          <div className="text-xs text-gray-500">{t('Duration')}</div>
        </div>
        
        <div className="text-center p-3 bg-white rounded-lg border">
          <div className="flex items-center justify-center mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">
            {completedExercises}/{totalExercises}
          </div>
          <div className="text-xs text-gray-500">{t('Completed')}</div>
        </div>
        
        <div className="text-center p-3 bg-white rounded-lg border">
          <div className="flex items-center justify-center mb-1">
            <Trophy className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">
            {Math.round(sessionProgress)}%
          </div>
          <div className="text-xs text-gray-500">{t('Progress')}</div>
        </div>
      </div>

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
      {isSessionActive && exercises[currentExerciseIndex] && (
        <div className="bg-white border-2 border-blue-300 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-blue-800">{t('Current Exercise')}</div>
              <div className="font-bold text-gray-900">
                {exercises[currentExerciseIndex].name}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={moveToNextExercise}
              disabled={currentExerciseIndex >= exercises.length - 1}
            >
              {t('Next Exercise')}
            </Button>
          </div>
        </div>
      )}

      {/* Session Complete */}
      {sessionProgress === 100 && (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
          <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="font-bold text-green-800 mb-1">
            {t('Workout Complete!')}
          </div>
          <div className="text-sm text-green-700">
            {t('Great job! You completed all exercises in')} {formatDuration(sessionDuration)}
          </div>
        </div>
      )}
    </Card>
  );
};
