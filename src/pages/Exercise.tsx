import MealPlanLayout from "@/components/MealPlanLayout";
import { useExerciseProgramPage } from "@/hooks/useExerciseProgramPage";
import { ExerciseProgramLoadingStates } from "@/components/exercise/ExerciseProgramLoadingStates";
import { ExerciseProgramErrorState } from "@/components/exercise/ExerciseProgramErrorState";
import { ExerciseProgramPageContent } from "@/components/exercise/ExerciseProgramPageContent";

const Exercise = () => {
  const {
    // State
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
    
    // Data
    currentProgram,
    isLoading,
    isGenerating,
    todaysWorkouts,
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    error,
    
    // Computed
    currentDate,
    weekStartDate,
    
    // Handlers
    handleGenerateAIProgram,
    handleRegenerateProgram,
    handleExerciseComplete,
    handleExerciseProgressUpdate,
    refetch
  } = useExerciseProgramPage();

  console.log('🎯 Exercise Page - Debug State:', {
    hasCurrentProgram: !!currentProgram,
    workoutType: currentProgram?.workout_type || workoutType,
    currentWeekOffset,
    selectedDayNumber,
    isLoading,
    isGenerating,
    todaysWorkoutsCount: todaysWorkouts?.length || 0,
    todaysExercisesCount: todaysExercises?.length || 0,
    error: error?.message
  });

  // Check if we should show loading states
  const shouldShowLoading = isLoading || isGenerating;
  
  if (shouldShowLoading) {
    return (
      <ExerciseProgramLoadingStates
        isGenerating={isGenerating}
        isLoading={isLoading}
      />
    );
  }

  // Show error state if there's an error
  if (error) {
    console.error('🚨 Exercise Page - Error detected:', error);
    return <ExerciseProgramErrorState onRetry={refetch} />;
  }

  return (
    <MealPlanLayout>
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
    </MealPlanLayout>
  );
};

export default Exercise;
