
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
  Dumbbell
} from "lucide-react";
import { useWorkoutSession } from "@/hooks/useWorkoutSession";

interface CompactWorkoutControlProps {
  exercises: any[];
  isRestDay: boolean;
  onSessionStart: () => void;
  onSessionPause: () => void;
  onSessionEnd: () => void;
  onSessionReset: () => void;
}

export const CompactWorkoutControl = ({
  exercises,
  isRestDay,
  onSessionStart,
  onSessionPause,
  onSessionEnd,
  onSessionReset
}: CompactWorkoutControlProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
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
  };

  const handleReset = () => {
    resetSession();
    onSessionReset();
  };

  if (isRestDay) {
    return (
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">😌</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-orange-800 mb-1">Rest & Recovery Day</h3>
              <p className="text-orange-600">Take time to rest and prepare for tomorrow's workout</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">💧 Stay Hydrated</Badge>
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">🧘 Light Stretching</Badge>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-lg">
      <div className="space-y-4">
        {/* Compact Header with Timer and Progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Today's Workout</h3>
              <p className="text-gray-600 text-sm">{exercises.length} exercises • Advanced tracking</p>
            </div>
          </div>
          
          {/* Timer Display */}
          <div className="flex items-center gap-4 bg-white rounded-xl px-4 py-2 shadow-sm border">
            <Timer className="w-5 h-5 text-blue-600" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 font-mono">{totalTime}</div>
              <div className="text-xs text-gray-500">{isActive ? (isPaused ? 'Paused' : 'Active') : 'Ready'}</div>
            </div>
          </div>
        </div>

        {/* Progress and Stats in One Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Workout Progress</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-gray-200" />
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4 text-green-600" />
                {completedCount}/{exercises.length}
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-600" />
                {estimatedCalories} cal
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                {workoutIntensity}
              </span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-end gap-2">
            {!isActive ? (
              <Button
                onClick={handleStart}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Workout
              </Button>
            ) : (
              <>
                {!isPaused ? (
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button
                    onClick={handleResume}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                )}
                <Button
                  onClick={handleStop}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Square className="w-4 h-4 mr-2" />
                  End
                </Button>
              </>
            )}
            
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            {progressPercentage === 100 && (
              <Button
                onClick={shareProgress}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            )}
          </div>
        </div>

        {/* Motivational Message */}
        {isActive && (
          <div className={`text-center p-3 rounded-xl text-white text-sm ${
            progressPercentage === 100 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
              : progressPercentage > 75 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
              : progressPercentage > 50 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500'
              : 'bg-gradient-to-r from-orange-500 to-red-500'
          }`}>
            <p className="font-semibold">
              {progressPercentage === 100 
                ? "🎉 Workout Complete! Amazing job!" 
                : progressPercentage > 75 
                ? "💪 Almost there! You're crushing this!" 
                : progressPercentage > 50 
                ? "🔥 Halfway done! Keep going!" 
                : "⚡ Great start! Stay focused!"}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
