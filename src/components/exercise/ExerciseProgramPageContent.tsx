
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
    <div className="max-w-7xl mx-auto space-y-6">
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

        <TabsContent value="home" className="mt-6">
          {currentProgram && currentProgram.workout_type === "home" ? (
            <div className="space-y-6">
              {/* Quick Actions */}
              <ExerciseQuickActions
                isWorkoutActive={workoutSession.isActive}
                onStartWorkout={handleStartWorkout}
                onPauseWorkout={workoutSession.pauseSession}
                onRestartWorkout={workoutSession.resetSession}
                onShareProgress={workoutSession.shareProgress}
                canStart={totalExercises > 0}
                isRestDay={isRestDay}
              />

              {/* Mobile Layout - Stack everything */}
              <div className="block xl:hidden space-y-6">
                <CompactWorkoutSummary
                  todaysWorkouts={todaysWorkouts}
                  currentProgram={currentProgram}
                  completedExercises={completedExercises}
                  totalExercises={totalExercises}
                  progressPercentage={progressPercentage}
                  workoutType="home"
                  selectedDay={selectedDayNumber}
                  isRestDay={isRestDay}
                />

                <ExerciseProgressTracker
                  currentProgram={currentProgram}
                  selectedDay={selectedDayNumber}
                  completedExercises={completedExercises}
                  totalExercises={totalExercises}
                />

                <ExerciseMotivationCard
                  completedExercises={completedExercises}
                  totalExercises={totalExercises}
                  isRestDay={isRestDay}
                />

                <ExerciseListEnhanced 
                  exercises={todaysExercises}
                  isLoading={false}
                  onExerciseComplete={handleCompleteExercise}
                  onExerciseProgressUpdate={handleExerciseProgressUpdate}
                  isRestDay={isRestDay}
                />
              </div>

              {/* Desktop Layout - Grid with sidebar */}
              <div className="hidden xl:grid xl:grid-cols-5 gap-6">
                {/* Main Content */}
                <div className="xl:col-span-3 space-y-6">
                  <CompactWorkoutSummary
                    todaysWorkouts={todaysWorkouts}
                    currentProgram={currentProgram}
                    completedExercises={completedExercises}
                    totalExercises={totalExercises}
                    progressPercentage={progressPercentage}
                    workoutType="home"
                    selectedDay={selectedDayNumber}
                    isRestDay={isRestDay}
                  />

                  <ExerciseListEnhanced 
                    exercises={todaysExercises}
                    isLoading={false}
                    onExerciseComplete={handleCompleteExercise}
                    onExerciseProgressUpdate={handleExerciseProgressUpdate}
                    isRestDay={isRestDay}
                  />
                </div>

                {/* Sidebar */}
                <div className="xl:col-span-2 space-y-6">
                  <ExerciseProgressTracker
                    currentProgram={currentProgram}
                    selectedDay={selectedDayNumber}
                    completedExercises={completedExercises}
                    totalExercises={totalExercises}
                  />

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

        <TabsContent value="gym" className="mt-6">
          {currentProgram && currentProgram.workout_type === "gym" ? (
            <div className="space-y-6">
              {/* Quick Actions */}
              <ExerciseQuickActions
                isWorkoutActive={workoutSession.isActive}
                onStartWorkout={handleStartWorkout}
                onPauseWorkout={workoutSession.pauseSession}
                onRestartWorkout={workoutSession.resetSession}
                onShareProgress={workoutSession.shareProgress}
                canStart={totalExercises > 0}
                isRestDay={isRestDay}
              />

              {/* Mobile Layout - Stack everything */}
              <div className="block xl:hidden space-y-6">
                <CompactWorkoutSummary
                  todaysWorkouts={todaysWorkouts}
                  currentProgram={currentProgram}
                  completedExercises={completedExercises}
                  totalExercises={totalExercises}
                  progressPercentage={progressPercentage}
                  workoutType="gym"
                  selectedDay={selectedDayNumber}
                  isRestDay={isRestDay}
                />

                <ExerciseProgressTracker
                  currentProgram={currentProgram}
                  selectedDay={selectedDayNumber}
                  completedExercises={completedExercises}
                  totalExercises={totalExercises}
                />

                <ExerciseMotivationCard
                  completedExercises={completedExercises}
                  totalExercises={totalExercises}
                  isRestDay={isRestDay}
                />

                <ExerciseListEnhanced 
                  exercises={todaysExercises}
                  isLoading={false}
                  onExerciseComplete={handleCompleteExercise}
                  onExerciseProgressUpdate={handleExerciseProgressUpdate}
                  isRestDay={isRestDay}
                />
              </div>

              {/* Desktop Layout - Grid with sidebar */}
              <div className="hidden xl:grid xl:grid-cols-5 gap-6">
                {/* Main Content */}
                <div className="xl:col-span-3 space-y-6">
                  <CompactWorkoutSummary
                    todaysWorkouts={todaysWorkouts}
                    currentProgram={currentProgram}
                    completedExercises={completedExercises}
                    totalExercises={totalExercises}
                    progressPercentage={progressPercentage}
                    workoutType="gym"
                    selectedDay={selectedDayNumber}
                    isRestDay={isRestDay}
                  />

                  <ExerciseListEnhanced 
                    exercises={todaysExercises}
                    isLoading={false}
                    onExerciseComplete={handleCompleteExercise}
                    onExerciseProgressUpdate={handleExerciseProgressUpdate}
                    isRestDay={isRestDay}
                  />
                </div>

                {/* Sidebar */}
                <div className="xl:col-span-2 space-y-6">
                  <ExerciseProgressTracker
                    currentProgram={currentProgram}
                    selectedDay={selectedDayNumber}
                    completedExercises={completedExercises}
                    totalExercises={totalExercises}
                  />

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
