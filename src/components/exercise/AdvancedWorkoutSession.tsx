
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Timer, 
  Target, 
  Trophy, 
  Share2,
  TrendingUp,
  Flame,
  Clock,
  Calendar
} from "lucide-react";
import { useWorkoutSession } from "@/hooks/useWorkoutSession";
import { useLanguage } from "@/contexts/LanguageContext";

interface AdvancedWorkoutSessionProps {
  exercises: any[];
  isRestDay: boolean;
  onSessionStart: () => void;
  onSessionPause: () => void;
  onSessionEnd: () => void;
  onSessionReset: () => void;
}

export const AdvancedWorkoutSession = ({
  exercises,
  isRestDay,
  onSessionStart,
  onSessionPause,
  onSessionEnd,
  onSessionReset
}: AdvancedWorkoutSessionProps) => {
  const { t } = useLanguage();
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const {
    sessionStarted,
    isActive,
    isPaused,
    totalTime,
    totalSeconds,
    startSession,
    pauseSession,
    resumeSession,
    resetSession,
    shareProgress
  } = useWorkoutSession();

  const completedCount = exercises.filter(ex => ex.completed).length;
  const progressPercentage = exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;
  const estimatedCalories = Math.round(exercises.length * 15 + (totalSeconds / 60) * 5);
  const workoutIntensity = progressPercentage > 80 ? 'High' : progressPercentage > 50 ? 'Medium' : 'Light';

  const handleStart = () => {
    startSession();
    onSessionStart();
  };

  const handlePause = () => {
    pauseSession();
    onSessionPause();
  };

  const handleResume = () => {
    resumeSession();
  };

  const handleStop = () => {
    resetSession();
    onSessionEnd();
    if (progressPercentage === 100) {
      shareProgress();
    }
  };

  const handleReset = () => {
    resetSession();
    onSessionReset();
  };

  if (isRestDay) {
    return (
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-lg">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
            <span className="text-3xl">😌</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-orange-800 mb-3">
              Rest & Recovery Day
            </h3>
            <p className="text-orange-600 text-lg leading-relaxed">
              Your body needs time to recover and grow stronger. Take this time to rest, stretch, or do light activities.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-white rounded-xl border border-orange-200">
              <div className="text-2xl font-bold text-orange-800">💧</div>
              <div className="text-sm text-orange-600 mt-1">Stay Hydrated</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-orange-200">
              <div className="text-2xl font-bold text-orange-800">🧘</div>
              <div className="text-sm text-orange-600 mt-1">Light Stretching</div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Advanced Session Timer */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-xl">
        <div className="space-y-6">
          {/* Session Header */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Advanced Workout Session
            </h3>
            <p className="text-gray-600">
              {exercises.length} exercises • Real-time tracking & analytics
            </p>
          </div>

          {/* Main Timer Display */}
          <div className="text-center">
            <div className="inline-flex items-center gap-6 bg-white rounded-3xl px-8 py-6 shadow-lg border border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Timer className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900 font-mono mb-1">
                  {totalTime}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isActive ? (isPaused ? 'bg-orange-400' : 'bg-green-400') : 'bg-gray-400'}`} />
                  {isActive ? (isPaused ? 'Paused' : 'Active') : 'Ready'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{estimatedCalories}</div>
                <div className="text-sm text-gray-600">cal burned</div>
              </div>
            </div>
          </div>

          {/* Progress Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{completedCount}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>

            <div className="text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{exercises.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>

            <div className="text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{Math.round(progressPercentage)}</div>
              <div className="text-sm text-gray-600">% Progress</div>
            </div>

            <div className="text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">{workoutIntensity}</div>
              <div className="text-sm text-gray-600">Intensity</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Workout Progress</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-gray-200" />
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {!isActive ? (
              <Button
                onClick={handleStart}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Advanced Session
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
                  End Session
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

            {progressPercentage === 100 && (
              <Button
                onClick={shareProgress}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Progress
              </Button>
            )}
          </div>

          {/* Session Analytics Toggle */}
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="text-gray-600 hover:text-gray-900"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {showAnalytics ? 'Hide' : 'Show'} Analytics
            </Button>
          </div>

          {/* Analytics Panel */}
          {showAnalytics && (
            <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200 space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Session Analytics
              </h4>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Average Exercise Time
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {completedCount > 0 ? Math.round(totalSeconds / completedCount / 60) : 0}m
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Flame className="w-4 h-4" />
                    Calories/Minute
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {totalSeconds > 0 ? Math.round(estimatedCalories / (totalSeconds / 60)) : 0}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Workout Pace
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {progressPercentage > 80 ? 'Fast' : progressPercentage > 40 ? 'Steady' : 'Relaxed'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Motivational Messages */}
          {isActive && (
            <div className={`text-center p-4 rounded-xl text-white ${
              progressPercentage === 100 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : progressPercentage > 75 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                : progressPercentage > 50 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                : 'bg-gradient-to-r from-orange-500 to-red-500'
            }`}>
              <p className="font-semibold text-lg">
                {progressPercentage === 100 
                  ? "🎉 Incredible! Workout Complete! You're unstoppable!" 
                  : progressPercentage > 75 
                  ? "💪 Almost there! You're crushing this workout!" 
                  : progressPercentage > 50 
                  ? "🔥 Halfway done! Keep up the amazing work!" 
                  : progressPercentage > 0 
                  ? "⚡ Great start! Your future self will thank you!" 
                  : "🚀 Let's make today legendary!"}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
