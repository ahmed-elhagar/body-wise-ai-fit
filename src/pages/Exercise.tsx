
import ProtectedRoute from "@/components/ProtectedRoute";
import { ExerciseProgramPageContent } from "@/components/exercise/ExerciseProgramPageContent";
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
      <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen">
        <ExerciseProgramPageContent
          currentDate={currentDate}
          weekStartDate={weekStartDate}
          selectedDayNumber={selectedDayNumber}
          setSelectedDayNumber={setSelectedDayNumber}
          currentWeekOffset={currentWeekOffset}
          setCurrentWeekOffset={setCurrentWeekOffset}
          currentProgram={currentProgram}
          workoutType={workoutType}
          setWorkoutType={setWorkoutType}
          todaysWorkouts={todaysWorkouts}
          todaysExercises={todaysExercises}
          completedExercises={completedExercises}
          totalExercises={totalExercises}
          progressPercentage={progressPercentage}
          showAIDialog={showAIDialog}
          setShowAIDialog={setShowAIDialog}
          aiPreferences={aiPreferences}
          setAiPreferences={setAiPreferences}
          handleGenerateAIProgram={handleGenerateAIProgram}
          handleRegenerateProgram={handleRegenerateProgram}
          handleExerciseComplete={handleExerciseComplete}
          handleExerciseProgressUpdate={handleExerciseProgressUpdate}
          isGenerating={isGenerating}
          refetch={refetch}
          isRestDay={isRestDay}
        />
      </div>
    </ProtectedRoute>
  );
};

export default Exercise;
