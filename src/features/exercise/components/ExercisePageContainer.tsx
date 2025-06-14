
import { format, addDays } from "date-fns";
import { useI18n } from "@/hooks/useI18n";
import { useOptimizedExerciseProgramPage } from "@/features/exercise/hooks/useOptimizedExerciseProgramPage";
import { useEnhancedAIExercise } from "@/hooks/useEnhancedAIExercise";
import { useAILoadingSteps } from "@/hooks/useAILoadingSteps";
import { useState } from "react";
import { ExercisePageLayout } from "./ExercisePageLayout";
import { ExerciseAnalyticsContainer } from "./ExerciseAnalyticsContainer";
import { useExerciseAISteps } from "../hooks/useExerciseAISteps";

export const ExercisePageContainer = () => {
  const { language } = useI18n();
  const [showAnalytics, setShowAnalytics] = useState(false);
  
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
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    isRestDay,
    error,
    currentDate,
    weekStartDate,
    handleExerciseComplete,
    handleExerciseProgressUpdate,
    refetch
  } = useOptimizedExerciseProgramPage();

  const { isGenerating, generateExerciseProgram, regenerateProgram } = useEnhancedAIExercise();
  const exerciseSteps = useExerciseAISteps(language);

  const { currentStepIndex, isComplete, progress } = useAILoadingSteps(
    exerciseSteps, 
    isGenerating,
    { stepDuration: 3500 }
  );

  const currentSelectedDate = addDays(weekStartDate, selectedDayNumber - 1);
  const isToday = format(currentSelectedDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');

  const handleGenerateProgram = async (preferences?: any) => {
    try {
      setShowAIDialog(false);
      
      const enhancedPreferences = {
        ...(preferences || aiPreferences),
        workoutType,
        weekStartDate: format(weekStartDate, 'yyyy-MM-dd'),
        weekOffset: currentWeekOffset
      };
      
      console.log('🎯 Starting AI program generation:', enhancedPreferences);
      await generateExerciseProgram(enhancedPreferences);
      refetch();
    } catch (error) {
      console.error('❌ Error generating exercise program:', error);
    }
  };

  const handleRegenerateProgram = async () => {
    try {
      const weekStartDateString = format(weekStartDate, 'yyyy-MM-dd');
      console.log('🔄 Starting program regeneration for week:', weekStartDateString);
      await regenerateProgram(weekStartDateString);
      refetch();
    } catch (error) {
      console.error('❌ Error regenerating exercise program:', error);
    }
  };

  if (showAnalytics) {
    return (
      <ExerciseAnalyticsContainer
        exercises={todaysExercises}
        onClose={() => setShowAnalytics(false)}
      />
    );
  }

  return (
    <ExercisePageLayout
      // Data props
      currentProgram={currentProgram}
      todaysExercises={todaysExercises}
      completedExercises={completedExercises}
      totalExercises={totalExercises}
      progressPercentage={progressPercentage}
      isRestDay={isRestDay}
      isToday={isToday}
      isLoading={isLoading}
      error={error}
      
      // Navigation props
      selectedDayNumber={selectedDayNumber}
      setSelectedDayNumber={setSelectedDayNumber}
      currentWeekOffset={currentWeekOffset}
      setCurrentWeekOffset={setCurrentWeekOffset}
      weekStartDate={weekStartDate}
      workoutType={workoutType}
      setWorkoutType={setWorkoutType}
      
      // AI props
      showAIDialog={showAIDialog}
      setShowAIDialog={setShowAIDialog}
      aiPreferences={aiPreferences}
      setAiPreferences={setAiPreferences}
      isGenerating={isGenerating}
      exerciseSteps={exerciseSteps}
      currentStepIndex={currentStepIndex}
      isComplete={isComplete}
      progress={progress}
      
      // Actions
      onShowAnalytics={() => setShowAnalytics(true)}
      onGenerateAIProgram={handleGenerateProgram}
      onRegenerateProgram={handleRegenerateProgram}
      onExerciseComplete={handleExerciseComplete}
      onExerciseProgressUpdate={handleExerciseProgressUpdate}
      refetch={refetch}
    />
  );
};
