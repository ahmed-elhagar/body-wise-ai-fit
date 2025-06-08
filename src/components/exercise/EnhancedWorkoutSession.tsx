
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, RotateCcw, Timer, Target, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EnhancedWorkoutSessionProps {
  exercises: any[];
  isRestDay: boolean;
  onSessionStart: () => void;
  onSessionPause: () => void;
  onSessionEnd: () => void;
  onSessionReset: () => void;
}

export const EnhancedWorkoutSession = ({
  exercises,
  isRestDay,
  onSessionStart,
  onSessionPause,
  onSessionEnd,
  onSessionReset
}: EnhancedWorkoutSessionProps) => {
  const { t } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  useEffect(() => {
    const completed = exercises.filter(ex => ex.completed).length;
    setCompletedCount(completed);
  }, [exercises]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    onSessionStart();
  };

  const handlePause = () => {
    setIsPaused(true);
    onSessionPause();
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    onSessionEnd();
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setSessionTime(0);
    onSessionReset();
  };

  const progressPercentage = exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;

  if (isRestDay) {
    return (
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-2xl">😌</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-orange-800 mb-2">
              Rest Day - Recovery Mode
            </h3>
            <p className="text-orange-600">
              Take this time to rest and prepare for tomorrow's workout
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-lg">
      <div className="space-y-6">
        {/* Session Header */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Workout Session
          </h3>
          <p className="text-gray-600">
            {exercises.length} exercises • Track your progress in real-time
          </p>
        </div>

        {/* Timer Display */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-8 py-4 shadow-md border border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Timer className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 font-mono">
                {formatTime(sessionTime)}
              </div>
              <div className="text-sm text-gray-500">
                {isActive ? (isPaused ? 'Paused' : 'Active') : 'Ready'}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Target className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{completedCount}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>

          <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{exercises.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>

          <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-600 font-bold text-sm">%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{Math.round(progressPercentage)}</div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-3">
          {!isActive ? (
            <Button
              onClick={handleStart}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Workout
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button
                  onClick={handlePause}
                  size="lg"
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50 px-6"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button
                  onClick={handleResume}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Resume
                </Button>
              )}

              <Button
                onClick={handleStop}
                size="lg"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50 px-6"
              >
                <Square className="w-5 h-5 mr-2" />
                End
              </Button>
            </>
          )}

          <Button
            onClick={handleReset}
            size="lg"
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>

        {/* Motivational Message */}
        {isActive && (
          <div className="text-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
            <p className="font-semibold">
              {progressPercentage === 100 
                ? "🎉 Workout Complete! Amazing job!" 
                : progressPercentage > 50 
                ? "💪 You're crushing it! Keep going!" 
                : progressPercentage > 0 
                ? "🔥 Great start! Stay focused!" 
                : "🚀 Let's make it happen!"}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
