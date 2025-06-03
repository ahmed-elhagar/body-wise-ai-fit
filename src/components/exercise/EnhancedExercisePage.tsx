
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOptimizedExerciseProgramPage } from "@/hooks/useOptimizedExerciseProgramPage";
import { EnhancedExerciseHeader } from "./EnhancedExerciseHeader";
import { EnhancedDayNavigation } from "./EnhancedDayNavigation";
import { AIExerciseDialog } from "./AIExerciseDialog";
import { ExercisePageLayout } from "./ExercisePageLayout";
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { EmptyExerciseState } from "./EmptyExerciseState";
import { ExerciseErrorState } from "./ExerciseErrorState";
import { TodaysWorkoutProgressCard } from "./TodaysWorkoutProgressCard";
import { useEnhancedAIExercise } from "@/hooks/useEnhancedAIExercise";
import EnhancedPageLoading from "@/components/ui/enhanced-page-loading";
import PageLoadingOverlay from "@/components/ui/page-loading-overlay";
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

  // Show empty state if no program exists
  if (!currentProgram) {
    return (
      <ExercisePageLayout>
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
  }

  return (
    <ExercisePageLayout>
      <div className="relative">
        {/* Loading overlay for week navigation - same pattern as meals */}
        <PageLoadingOverlay
          isLoading={isLoading && hasEverLoadedProgram && !isGenerating}
          type="exercise"
          message="Loading Week Data"
          description="Fetching your exercise program for the selected week..."
          blur={true}
        />

        <div className="max-w-7xl mx-auto space-y-6">
          {/* Enhanced Header */}
          <div className="px-3 py-3">
            <EnhancedExerciseHeader
              currentProgram={currentProgram}
              onShowAIDialog={() => setShowAIDialog(true)}
              onRegenerateProgram={handleRegenerateProgram}
              isGenerating={isGenerating}
              workoutType={workoutType}
            />
          </div>

          {/* Enhanced Day Navigation */}
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

          {/* Progress Overview Card */}
          {!isRestDay && totalExercises > 0 && (
            <div className="px-3">
              <TodaysWorkoutProgressCard
                todaysWorkouts={todaysWorkouts}
                completedExercises={completedExercises}
                totalExercises={totalExercises}
                progressPercentage={progressPercentage}
                currentSelectedDate={currentSelectedDate}
                isToday={isToday}
              />
            </div>
          )}

          {/* Exercise List */}
          <div className="px-3">
            <ExerciseListEnhanced
              exercises={todaysExercises}
              isLoading={false}
              onExerciseComplete={handleExerciseComplete}
              onExerciseProgressUpdate={handleExerciseProgressUpdate}
              isRestDay={isRestDay}
            />
          </div>
        </div>
      </div>

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
