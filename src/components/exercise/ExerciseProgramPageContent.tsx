import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { ExerciseProgramSelector } from "./ExerciseProgramSelector";
import { AIExerciseDialog } from "./AIExerciseDialog";
import { ExerciseEnhancedNavigation } from "./ExerciseEnhancedNavigation";
import { CompactWorkoutSummary } from "./CompactWorkoutSummary";
import { ExerciseProgressTracker } from "./ExerciseProgressTracker";
import { ExerciseMotivationCard } from "./ExerciseMotivationCard";
import { ExerciseQuickActions } from "./ExerciseQuickActions";
import { ExerciseProgram, ExercisePreferences } from "@/hooks/useExerciseProgramPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWorkoutSession } from "@/hooks/useWorkoutSession";

interface ExerciseProgramPageContentProps {
  currentDate: Date;
  weekStartDate: Date;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  currentProgram: ExerciseProgram | null;
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  todaysWorkouts: any[];
  todaysExercises: any[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  aiPreferences: ExercisePreferences;
  setAiPreferences: (prefs: ExercisePreferences) => void;
  handleGenerateAIProgram: (preferences: ExercisePreferences) => void;
  handleRegenerateProgram: () => void;
  handleExerciseComplete: (exerciseId: string) => void;
  handleExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isGenerating: boolean;
  refetch: () => void;
  isRestDay?: boolean;
}

export const ExerciseProgramPageContent = ({
  currentDate,
  weekStartDate,
  selectedDayNumber,
  setSelectedDayNumber,
  currentWeekOffset,
  setCurrentWeekOffset,
  currentProgram,
  workoutType,
  setWorkoutType,
  todaysWorkouts,
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  showAIDialog,
  setShowAIDialog,
  aiPreferences,
  setAiPreferences,
  handleGenerateAIProgram,
  handleRegenerateProgram,
  handleExerciseComplete,
  handleExerciseProgressUpdate,
  isGenerating,
  refetch,
  isRestDay
}: ExerciseProgramPageContentProps) => {
  const { t } = useLanguage();
  const workoutSession = useWorkoutSession();

  // Check if current week has data for the selected workout type
  const hasDataForCurrentWeek = currentProgram && currentProgram.workout_type === workoutType;

  const handleGenerateForCurrentWeek = () => {
    const preferences = {
      ...aiPreferences,
      workoutType: workoutType
    };
    handleGenerateAIProgram(preferences);
  };

  const handleStartWorkout = () => {
    workoutSession.startSession();
  };

  const handleCompleteExercise = (exerciseId: string) => {
    workoutSession.completeExercise(exerciseId);
    handleExerciseComplete(exerciseId);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Enhanced Navigation - Week and Day Selection */}
      <ExerciseEnhancedNavigation
        currentWeekOffset={currentWeekOffset}
        setCurrentWeekOffset={setCurrentWeekOffset}
        weekStartDate={weekStartDate}
        selectedDayNumber={selectedDayNumber}
        setSelectedDayNumber={setSelectedDayNumber}
        currentProgram={currentProgram}
        workoutType={workoutType}
        hasDataForCurrentWeek={!!hasDataForCurrentWeek}
        onGenerateForWeek={handleGenerateForCurrentWeek}
      />

      {/* Workout Type Tabs */}
      <Tabs value={workoutType} onValueChange={(value) => setWorkoutType(value as "home" | "gym")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white h-12 border border-gray-200">
          <TabsTrigger 
            value="home" 
            className="data-[state=active]:bg-fitness-gradient data-[state=active]:text-white text-gray-700 font-medium"
          >
            <Home className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('exercise.homeWorkout') || 'Home Workout'}</span>
            <span className="sm:hidden">Home</span>
          </TabsTrigger>
          <TabsTrigger 
            value="gym" 
            className="data-[state=active]:bg-fitness-gradient data-[state=active]:text-white text-gray-700 font-medium"
          >
            <Building2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('exercise.gymWorkout') || 'Gym Workout'}</span>
            <span className="sm:hidden">Gym</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="mt-4">
          {currentProgram && currentProgram.workout_type === "home" ? (
            <div className="space-y-4">
              {/* Quick Actions with Timer - Always Visible */}
              <ExerciseQuickActions
                isWorkoutActive={workoutSession.isActive}
                isPaused={workoutSession.isPaused}
                totalTime={workoutSession.totalTime}
                onStartWorkout={handleStartWorkout}
                onPauseWorkout={workoutSession.pauseSession}
                onResumeWorkout={workoutSession.resumeSession}
                onRestartWorkout={workoutSession.resetSession}
                onShareProgress={workoutSession.shareProgress}
                canStart={totalExercises > 0}
                isRestDay={isRestDay}
              />

              {/* Optimized Layout - Less Scrolling */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Main Exercise List - Takes More Space */}
                <div className="lg:col-span-3">
                  <ExerciseListEnhanced 
                    exercises={todaysExercises}
                    isLoading={false}
                    onExerciseComplete={handleCompleteExercise}
                    onExerciseProgressUpdate={handleExerciseProgressUpdate}
                    isRestDay={isRestDay}
                  />
                </div>

                {/* Compact Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                  {/* Compact Workout Summary */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold text-gray-800">Today's Progress</h3>
                      <div className="text-2xl font-bold text-blue-600">
                        {completedExercises}/{totalExercises}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.round(progressPercentage)}% completed
                      </div>
                    </div>
                  </div>

                  {/* Compact Motivation */}
                  <ExerciseMotivationCard
                    completedExercises={completedExercises}
                    totalExercises={totalExercises}
                    isRestDay={isRestDay}
                  />
                </div>
              </div>
            </div>
          ) : (
            <ExerciseProgramSelector 
              onGenerateProgram={(prefs) => handleGenerateAIProgram({...prefs, workoutType: "home"})}
              isGenerating={isGenerating}
              workoutType="home"
            />
          )}
        </TabsContent>

        <TabsContent value="gym" className="mt-4">
          {currentProgram && currentProgram.workout_type === "gym" ? (
            <div className="space-y-4">
              {/* Quick Actions with Timer - Always Visible */}
              <ExerciseQuickActions
                isWorkoutActive={workoutSession.isActive}
                isPaused={workoutSession.isPaused}
                totalTime={workoutSession.totalTime}
                onStartWorkout={handleStartWorkout}
                onPauseWorkout={workoutSession.pauseSession}
                onResumeWorkout={workoutSession.resumeSession}
                onRestartWorkout={workoutSession.resetSession}
                onShareProgress={workoutSession.shareProgress}
                canStart={totalExercises > 0}
                isRestDay={isRestDay}
              />

              {/* Optimized Layout - Less Scrolling */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Main Exercise List - Takes More Space */}
                <div className="lg:col-span-3">
                  <ExerciseListEnhanced 
                    exercises={todaysExercises}
                    isLoading={false}
                    onExerciseComplete={handleCompleteExercise}
                    onExerciseProgressUpdate={handleExerciseProgressUpdate}
                    isRestDay={isRestDay}
                  />
                </div>

                {/* Compact Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                  {/* Compact Workout Summary */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold text-gray-800">Today's Progress</h3>
                      <div className="text-2xl font-bold text-blue-600">
                        {completedExercises}/{totalExercises}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.round(progressPercentage)}% completed
                      </div>
                    </div>
                  </div>

                  {/* Compact Motivation */}
                  <ExerciseMotivationCard
                    completedExercises={completedExercises}
                    totalExercises={totalExercises}
                    isRestDay={isRestDay}
                  />
                </div>
              </div>
            </div>
          ) : (
            <ExerciseProgramSelector 
              onGenerateProgram={(prefs) => handleGenerateAIProgram({...prefs, workoutType: "gym"})}
              isGenerating={isGenerating}
              workoutType="gym"
            />
          )}
        </TabsContent>
      </Tabs>

      <AIExerciseDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        preferences={aiPreferences}
        setPreferences={setAiPreferences}
        onGenerate={handleGenerateAIProgram}
        isGenerating={isGenerating}
      />
    </div>
  );
};
