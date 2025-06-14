
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dumbbell,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { InteractiveExerciseCard } from "./InteractiveExerciseCard";
import { RestDayCard } from "./RestDayCard";
import { useWorkoutSession } from "@/features/exercise/hooks";
import { WorkoutHeader } from "./WorkoutHeader";

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

  if (isLoading) {
    return (
      <Card className="p-6 bg-white shadow-lg">
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
      <Card className="p-8 bg-white shadow-lg text-center">
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
    <div className="space-y-3">
      <WorkoutHeader
        completedExercises={completedExercises}
        totalExercises={totalExercises}
        progressPercentage={progressPercentage}
        isToday={isToday}
        isRestDay={isRestDay}
        totalTime={totalTime}
        isActive={isActive}
        isPaused={isPaused}
        estimatedCalories={estimatedCalories}
        workoutIntensity={workoutIntensity}
        startSession={startSession}
        pauseSession={pauseSession}
        resumeSession={resumeSession}
        resetSession={resetSession}
        shareProgress={shareProgress}
      />

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-8">
          <TabsTrigger value="workout" className="text-xs">Exercises</TabsTrigger>
          <TabsTrigger value="progress" className="text-xs">Progress</TabsTrigger>
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="workout" className="space-y-2 mt-3">
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

        <TabsContent value="progress" className="mt-3">
          <Card className="p-3">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-3 h-3" />
              Workout Analytics
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{completedExercises}</div>
                <div className="text-xs text-green-700">Completed</div>
              </div>
              
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{totalExercises}</div>
                <div className="text-xs text-blue-700">Total</div>
              </div>
              
              <div className="text-center p-2 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600">{estimatedCalories}</div>
                <div className="text-xs text-orange-700">Calories</div>
              </div>
              
              <div className="text-center p-2 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{Math.round(progressPercentage)}%</div>
                <div className="text-xs text-purple-700">Complete</div>
              </div>
            </div>

            {isActive && (
              <div className={`mt-3 text-center p-2 rounded-lg text-white text-xs ${
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

        <TabsContent value="overview" className="mt-3">
          <Card className="p-3">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              Program Overview
            </h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Week Progress</span>
                <Badge variant="outline" className="bg-purple-100 border-purple-200 text-purple-700 text-xs">
                  Day {selectedDayNumber}/{weekProgress}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Program Duration</span>
                <span className="font-semibold text-gray-800">{programDuration} days</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Workout Type</span>
                <Badge className="bg-purple-500 text-white text-xs">
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
