
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useExerciseProgramPage } from "@/hooks/useExerciseProgramPage";
import { EnhancedDayNavigation } from "./EnhancedDayNavigation";
import { AIExerciseDialog } from "./AIExerciseDialog";
import { ExercisePageLayout } from "./ExercisePageLayout";
import { ExercisePageContent } from "./ExercisePageContent";
import { ExerciseErrorState } from "./ExerciseErrorState";
import { useEnhancedAIExercise } from "@/hooks/useEnhancedAIExercise";
import EnhancedPageLoading from "@/components/ui/enhanced-page-loading";
import { EnhancedExerciseHeaderWithAnalytics } from "./EnhancedExerciseHeaderWithAnalytics";
import { ExerciseAnalyticsContainer } from "./ExerciseAnalyticsContainer";
import { useState } from "react";

const EnhancedExercisePage = () => {
  const { t } = useLanguage();
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
  } = useExerciseProgramPage();

  const { isGenerating, generateExerciseProgram, regenerateProgram } = useEnhancedAIExercise();

  const currentSelectedDate = addDays(weekStartDate, selectedDayNumber - 1);
  const isToday = format(currentSelectedDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');

  // Show analytics view if enabled
  if (showAnalytics) {
    return (
      <ExerciseAnalyticsContainer
        exercises={todaysExercises}
        onClose={() => setShowAnalytics(false)}
      />
    );
  }

  // Show full page loading ONLY on initial load when there's no program data AND we're loading
  // OR during AI generation
  const showFullPageLoading = (isLoading && !currentProgram && currentWeekOffset === 0) || isGenerating;

  if (showFullPageLoading) {
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
      
      console.log('🎯 Starting AI program generation:', enhancedPreferences);
      await generateExerciseProgram(enhancedPreferences);
      setShowAIDialog(false);
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

  return (
    <ExercisePageLayout>
      {/* Enhanced Header with Analytics - Always show and never block */}
      <div className="px-3 py-3">
        <EnhancedExerciseHeaderWithAnalytics
          currentProgram={currentProgram}
          onShowAnalytics={() => setShowAnalytics(true)}
          onShowAIDialog={() => setShowAIDialog(true)}
          onRegenerateProgram={handleRegenerateProgram}
          isGenerating={isGenerating}
          workoutType={workoutType}
        />
      </div>

      {/* Enhanced Day Navigation - Always show and never block */}
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

      {/* Main Content - Show targeted loading only for content area */}
      <ExercisePageContent
        isLoading={isLoading && !!currentProgram && !isGenerating}
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
