
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Timer, 
  Target, 
  Trophy, 
  Dumbbell,
  Calendar,
  TrendingUp,
  Flame,
  Share2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { InteractiveExerciseCard } from "./InteractiveExerciseCard";
import { RestDayCard } from "./RestDayCard";
import { useWorkoutSession } from "@/hooks/useWorkoutSession";
import { AnimatedProgressRing } from "./AnimatedProgressRing";

interface UnifiedExerciseContainerProps {
  exercises: any[];
  isLoading: boolean;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isRestDay?: boolean;
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isToday: boolean;
  currentProgram: any;
  selectedDayNumber: number;
}

export const UnifiedExerciseContainer = ({ 
  exercises, 
  isLoading, 
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay = false,
  completedExercises,
  totalExercises,
  progressPercentage,
  isToday,
  currentProgram,
  selectedDayNumber
}: UnifiedExerciseContainerProps) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("workout");
  
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

  const estimatedCalories = Math.round(exercises.length * 15 + (totalSeconds / 60) * 5);
  const workoutIntensity = progressPercentage > 80 ? 'High' : progressPercentage > 50 ? 'Medium' : 'Light';
  const weekProgress = currentProgram?.daily_workouts_count || 7;
  const programDuration = Math.ceil((new Date().getTime() - new Date(currentProgram?.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24));

  const handleStart = () => {
    startSession();
  };

  const handlePause = () => {
    pauseSession();
  };

  const handleResume = () => {
    resumeSession();
  };

  const handleStop = () => {
    resetSession();
  };

  const handleReset = () => {
    resetSession();
  };

  if (isLoading) {
    return (
      <Card className="p-8 bg-white shadow-lg">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
            <div className="w-8 h-8 animate-spin border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Exercises</h3>
            <p className="text-gray-600">Preparing your personalized workout...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (isRestDay) {
    return <RestDayCard />;
  }

  if (!exercises || exercises.length === 0) {
    return (
      <Card className="p-12 bg-white shadow-lg text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Dumbbell className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {t('exercise.noExercises') || 'No Exercises Available'}
        </h3>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
          {t('exercise.noExercisesMessage') || 'No exercises are scheduled for this day. Check back later or generate a new program.'}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Unified Header with Progress and Controls */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Progress Ring Section */}
          <div className="flex-shrink-0">
            <AnimatedProgressRing
              completedExercises={completedExercises}
              totalExercises={totalExercises}
              progressPercentage={progressPercentage}
              isToday={isToday}
              isRestDay={isRestDay}
            />
          </div>

          {/* Timer and Controls Section */}
          <div className="flex-1 space-y-4">
            {/* Timer Display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Timer className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 font-mono">{totalTime}</div>
                  <div className="text-sm text-gray-500">{isActive ? (isPaused ? 'Paused' : 'Active') : 'Ready'}</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{completedExercises}</div>
                  <div className="text-gray-600">Done</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{estimatedCalories}</div>
                  <div className="text-gray-600">Cal</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{workoutIntensity}</div>
                  <div className="text-gray-600">Level</div>
                </div>
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
            <div className="flex gap-2">
              {!isActive ? (
                <Button
                  onClick={handleStart}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex-1"
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
                      className="border-orange-300 text-orange-700 hover:bg-orange-50 flex-1"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button
                      onClick={handleResume}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex-1"
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
                    <Square className="w-4 h-4" />
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
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workout">Exercises</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="workout" className="space-y-4 mt-6">
          {exercises.map((exercise, index) => (
            <InteractiveExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={index}
              onExerciseComplete={onExerciseComplete}
              onExerciseProgressUpdate={onExerciseProgressUpdate}
            />
          ))}
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Workout Analytics
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{completedExercises}</div>
                <div className="text-sm text-green-700">Completed</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{totalExercises}</div>
                <div className="text-sm text-blue-700">Total</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">{estimatedCalories}</div>
                <div className="text-sm text-orange-700">Calories</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{Math.round(progressPercentage)}%</div>
                <div className="text-sm text-purple-700">Complete</div>
              </div>
            </div>

            {/* Motivational Message */}
            {isActive && (
              <div className={`mt-6 text-center p-4 rounded-xl text-white ${
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
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Program Overview
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Week Progress</span>
                <Badge variant="outline" className="bg-purple-100 border-purple-200 text-purple-700">
                  Day {selectedDayNumber}/{weekProgress}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Program Duration</span>
                <span className="font-semibold text-gray-800">{programDuration} days</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Workout Type</span>
                <Badge className="bg-purple-500 text-white">
                  {currentProgram?.workout_type === 'gym' ? '🏋️ Gym' : '🏠 Home'}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Difficulty</span>
                <span className="font-semibold text-gray-800">{currentProgram?.difficulty_level || 'Intermediate'}</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
