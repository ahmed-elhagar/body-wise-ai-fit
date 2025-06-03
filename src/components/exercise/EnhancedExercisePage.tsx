
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

const EnhancedExercisePage = () => {
  const { t } = useLanguage();
  
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

  const currentSelectedDate = addDays(weekStartDate, selectedDayNumber - 1);
  const isToday = format(currentSelectedDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');

  // Show full page loading ONLY on initial load when there's no program data at all
  if (isLoading && !currentProgram) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <EnhancedPageLoading
          isLoading={true}
          type="exercise"
          title="Loading Your Exercise Program"
          description="Preparing your personalized workout plan with progress tracking and exercise details"
          timeout={12000}
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

      {/* Main Content - Only show loading overlay when changing weeks, not initial load */}
      <ExercisePageContent
        isLoading={isLoading && !!currentProgram}
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
