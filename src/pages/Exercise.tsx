
import ProtectedRoute from "@/components/ProtectedRoute";
import { ExerciseHeader } from "@/components/exercise/ExerciseHeader";
import { ExerciseDaySelector } from "@/components/exercise/ExerciseDaySelector";
import { ExerciseList } from "@/components/exercise/ExerciseList";
import { EmptyExerciseState } from "@/components/exercise/EmptyExerciseState";
import { AIExerciseDialog } from "@/components/exercise/AIExerciseDialog";
import { useExerciseProgramPage } from "@/hooks/useExerciseProgramPage";

const Exercise = () => {
  const {
    selectedDayNumber,
    setSelectedDayNumber,
    currentWeekOffset,
    setCurrentWeekOffset,
    workoutType,
    setWorkoutType,
    showAIDialog,
    setShowAIDialog,
    aiPreferences,
    setAiPreferences,
    currentProgram,
    isLoading,
    isGenerating,
    todaysWorkouts,
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    isRestDay,
    error,
    currentDate,
    weekStartDate,
    handleGenerateAIProgram,
    handleRegenerateProgram,
    handleExerciseComplete,
    handleExerciseProgressUpdate,
    refetch
  } = useExerciseProgramPage();

  if (error) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <div className="text-center text-red-600">
            Error loading exercise data. Please try again.
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <ExerciseHeader
            currentProgram={currentProgram}
            onGenerateProgram={() => setShowAIDialog(true)}
            onShowAIDialog={() => setShowAIDialog(true)}
            isGenerating={isGenerating}
          />

          <ExerciseDaySelector
            selectedDayNumber={selectedDayNumber}
            setSelectedDayNumber={setSelectedDayNumber}
            currentProgram={currentProgram}
            workoutType={workoutType}
          />

          {isLoading ? (
            <div className="text-center py-8">Loading exercises...</div>
          ) : !currentProgram ? (
            <EmptyExerciseState 
              onGenerateProgram={() => setShowAIDialog(true)}
              workoutType={workoutType}
              setWorkoutType={setWorkoutType}
              showAIDialog={showAIDialog}
              setShowAIDialog={setShowAIDialog}
              aiPreferences={aiPreferences}
              setAiPreferences={setAiPreferences}
              isGenerating={isGenerating}
            />
          ) : (
            <ExerciseList
              exercises={todaysExercises}
              workoutsLoading={isLoading}
            />
          )}

          <AIExerciseDialog
            open={showAIDialog}
            onOpenChange={setShowAIDialog}
            preferences={aiPreferences}
            setPreferences={setAiPreferences}
            onGenerate={handleGenerateAIProgram}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Exercise;
