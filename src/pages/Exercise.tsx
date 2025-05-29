
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
    currentDay,
    
    // Handlers
    handleGenerateAIProgram,
    handleRegenerateProgram,
    refetch
  } = useExerciseProgramPage();

  console.log('🎯 Exercise Page - Debug State:', {
    hasCurrentProgram: !!currentProgram,
    workoutType: currentProgram?.workout_type || workoutType,
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
        currentDay={currentDay}
        selectedDayNumber={selectedDayNumber}
        setSelectedDayNumber={setSelectedDayNumber}
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
        isGenerating={isGenerating}
        refetch={refetch}
      />
    </MealPlanLayout>
  );
};

export default Exercise;
