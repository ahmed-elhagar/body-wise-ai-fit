
import { useExerciseProgramPage } from "@/hooks/useExerciseProgramPage";
import { ExerciseProgramLoadingStates } from "@/components/exercise/ExerciseProgramLoadingStates";
import { ExerciseProgramErrorState } from "@/components/exercise/ExerciseProgramErrorState";
import { ExerciseProgramPageContent } from "@/components/exercise/ExerciseProgramPageContent";

const Exercise = () => {
  const {
    // State
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
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
    weekStartDate,
    todaysWorkouts,
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    error,
    
    // Computed
    currentDate,
    currentDay,
    
    // Handlers
    handleGenerateAIProgram,
    handleRegenerateProgram,
    refetch
  } = useExerciseProgramPage();

  console.log('🎯 Exercise Page - Debug State:', {
    currentWeekOffset,
    hasCurrentProgram: !!currentProgram,
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
    <ExerciseProgramPageContent
      currentDate={currentDate}
      currentDay={currentDay}
      onShowAIDialog={() => setShowAIDialog(true)}
      onRegenerateProgram={handleRegenerateProgram}
      isGenerating={isGenerating}
      workoutType={workoutType}
      setWorkoutType={setWorkoutType}
      currentWeekOffset={currentWeekOffset}
      setCurrentWeekOffset={setCurrentWeekOffset}
      weekStartDate={weekStartDate}
      selectedDayNumber={selectedDayNumber}
      setSelectedDayNumber={setSelectedDayNumber}
      currentProgram={currentProgram}
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
      refetch={refetch}
    />
  );
};

export default Exercise;
