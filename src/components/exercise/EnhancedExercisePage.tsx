
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOptimizedExerciseProgramPage } from "@/hooks/useOptimizedExerciseProgramPage";
import { EnhancedExerciseHeader } from "./EnhancedExerciseHeader";
import { EnhancedDayNavigation } from "./EnhancedDayNavigation";
import { AIExerciseDialog } from "./AIExerciseDialog";
import { ExercisePageLayout } from "./ExercisePageLayout";
import { ExercisePageContent } from "./ExercisePageContent";
import { ExerciseErrorState } from "./ExerciseErrorState";
import { useEnhancedAIExercise } from "@/hooks/useEnhancedAIExercise";
import EnhancedPageLoading from "@/components/ui/enhanced-page-loading";
import { useState, useEffect } from "react";

const EnhancedExercisePage = () => {
  const { t } = useLanguage();
  const [hasEverLoadedProgram, setHasEverLoadedProgram] = useState(false);
  
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
    todaysWorkouts,
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

  // Track if we've ever loaded a program to distinguish initial load from week changes
  useEffect(() => {
    if (currentProgram && !hasEverLoadedProgram) {
      setHasEverLoadedProgram(true);
    }
  }, [currentProgram, hasEverLoadedProgram]);

  const currentSelectedDate = addDays(weekStartDate, selectedDayNumber - 1);
  const isToday = format(currentSelectedDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');

  // Show full page loading ONLY for:
  // 1. AI generation process
  // 2. True initial load (never loaded any program before AND currently loading)
  const shouldShowFullPageLoading = isGenerating || (isLoading && !hasEverLoadedProgram);

  if (shouldShowFullPageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <EnhancedPageLoading
          isLoading={true}
          type="exercise"
          title={isGenerating ? "Generating Your Exercise Program" : "Loading Your Exercise Program"}
          description={isGenerating ? "Creating your personalized workout plan with AI..." : "Preparing your personalized workout plan with progress tracking and exercise details"}
          timeout={isGenerating ? 30000 : 12000}
        />
      </div>
    );
  }

  if (error) {
    return <ExerciseErrorState onRetry={() => refetch()} />;
  }

  const handleGenerateAIProgram = async (preferences: any) => {
    try {
      const enhancedPreferences = {
        ...preferences,
        workoutType,
        weekStartDate: format(weekStartDate, 'yyyy-MM-dd'),
        weekOffset: currentWeekOffset
      };
      
      await generateExerciseProgram(enhancedPreferences);
      setShowAIDialog(false);
      refetch();
    } catch (error) {
      console.error('Error generating exercise program:', error);
    }
  };

  const handleRegenerateProgram = async () => {
    try {
      const weekStartDateString = format(weekStartDate, 'yyyy-MM-dd');
      await regenerateProgram(weekStartDateString);
      refetch();
    } catch (error) {
      console.error('Error regenerating exercise program:', error);
    }
  };

  return (
    <ExercisePageLayout>
      {/* Enhanced Header - Always show */}
      <div className="px-3 py-3">
        <EnhancedExerciseHeader
          currentProgram={currentProgram}
          onShowAIDialog={() => setShowAIDialog(true)}
          onRegenerateProgram={handleRegenerateProgram}
          isGenerating={isGenerating}
          workoutType={workoutType}
        />
      </div>

      {/* Enhanced Day Navigation - Always show */}
      <div className="px-3 mb-3">
        <EnhancedDayNavigation
          weekStartDate={weekStartDate}
          selectedDayNumber={selectedDayNumber}
          onDayChange={setSelectedDayNumber}
          currentProgram={currentProgram}
          workoutType={workoutType}
          currentWeekOffset={currentWeekOffset}
          onWeekChange={setCurrentWeekOffset}
          onWorkoutTypeChange={setWorkoutType}
        />
      </div>

      {/* Main Content - Show loading overlay only when changing weeks (has loaded before) */}
      <ExercisePageContent
        isLoading={isLoading && hasEverLoadedProgram && !isGenerating}
        currentProgram={currentProgram}
        todaysExercises={todaysExercises}
        completedExercises={completedExercises}
        totalExercises={totalExercises}
        progressPercentage={progressPercentage}
        isRestDay={isRestDay}
        isToday={isToday}
        selectedDayNumber={selectedDayNumber}
        workoutType={workoutType}
        setWorkoutType={setWorkoutType}
        showAIDialog={showAIDialog}
        setShowAIDialog={setShowAIDialog}
        aiPreferences={aiPreferences}
        setAiPreferences={setAiPreferences}
        isGenerating={isGenerating}
        onExerciseComplete={handleExerciseComplete}
        onExerciseProgressUpdate={handleExerciseProgressUpdate}
      />

      {/* Enhanced AI Dialog */}
      <AIExerciseDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        preferences={{ ...aiPreferences, workoutType }}
        setPreferences={setAiPreferences}
        onGenerate={handleGenerateAIProgram}
        isGenerating={isGenerating}
      />
    </ExercisePageLayout>
  );
};

export default EnhancedExercisePage;
