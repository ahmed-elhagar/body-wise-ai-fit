
import ProtectedRoute from "@/components/ProtectedRoute";
import ExerciseHeader from "@/components/exercise/ExerciseHeader";
import ExerciseDaySelector from "@/components/exercise/ExerciseDaySelector";
import ExerciseList from "@/components/exercise/ExerciseList";
import EmptyExerciseState from "@/components/exercise/EmptyExerciseState";
import AIExerciseDialog from "@/components/exercise/AIExerciseDialog";
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
            workoutType={workoutType}
            onWorkoutTypeChange={setWorkoutType}
            onGenerateProgram={() => setShowAIDialog(true)}
            onRegenerateProgram={handleRegenerateProgram}
            isGenerating={isGenerating}
            completedExercises={completedExercises}
            totalExercises={totalExercises}
            progressPercentage={progressPercentage}
          />

          <ExerciseDaySelector
            selectedDay={selectedDayNumber}
            onDaySelect={setSelectedDayNumber}
            currentWeekOffset={currentWeekOffset}
            onWeekOffsetChange={setCurrentWeekOffset}
            weekStartDate={weekStartDate}
          />

          {isLoading ? (
            <div className="text-center py-8">Loading exercises...</div>
          ) : !currentProgram ? (
            <EmptyExerciseState onGenerateProgram={() => setShowAIDialog(true)} />
          ) : (
            <ExerciseList
              exercises={todaysExercises}
              isRestDay={isRestDay}
              onExerciseComplete={handleExerciseComplete}
              onExerciseProgressUpdate={handleExerciseProgressUpdate}
            />
          )}

          <AIExerciseDialog
            open={showAIDialog}
            onOpenChange={setShowAIDialog}
            preferences={aiPreferences}
            onPreferencesChange={setAiPreferences}
            onGenerate={handleGenerateAIProgram}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Exercise;
