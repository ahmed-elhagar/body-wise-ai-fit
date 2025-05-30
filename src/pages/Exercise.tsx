
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { OptimizedExerciseProgramPageContent } from "@/components/exercise/OptimizedExerciseProgramPageContent";
import { useExerciseProgramPage } from "@/hooks/useExerciseProgramPage";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
        <Layout>
          <div className="p-4 md:p-6">
            <div className="text-center text-red-600">
              Error loading exercise data. Please try again.
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <ErrorBoundary>
          <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen">
            <div className="p-3 md:p-4 lg:p-6">
              <OptimizedExerciseProgramPageContent
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
          </div>
        </ErrorBoundary>
      </Layout>
    </ProtectedRoute>
  );
};

export default Exercise;
