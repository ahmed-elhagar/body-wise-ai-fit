
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOptimizedExerciseProgramPage } from "@/features/exercise/hooks/useOptimizedExerciseProgramPage";
import { 
  EnhancedDayNavigation,
  ExercisePageContent, 
  ExercisePageLayout,
  ExerciseErrorState,
  EnhancedExerciseHeaderWithAnalytics,
  ExerciseAnalyticsContainer,
  AIExerciseDialog
} from "@/features/exercise";
import { useEnhancedAIExercise } from "@/hooks/useEnhancedAIExercise";
import SimpleLoadingIndicator from "@/components/ui/simple-loading-indicator";
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
  } = useOptimizedExerciseProgramPage();

  const { isGenerating, generateExerciseProgram, regenerateProgram } = useEnhancedAIExercise();

  const currentSelectedDate = addDays(weekStartDate, selectedDayNumber - 1);
  const isToday = format(currentSelectedDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');

  if (showAnalytics) {
    return (
      <ExerciseAnalyticsContainer
        exercises={todaysExercises}
        onClose={() => setShowAnalytics(false)}
      />
    );
  }

  const showFullPageLoading = (isLoading && !currentProgram && currentWeekOffset === 0) || isGenerating;

  if (showFullPageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fitness-primary-50 via-fitness-accent-50/30 to-fitness-secondary-50/20">
        <SimpleLoadingIndicator
          message={isGenerating ? "Generating Your Exercise Program" : "Loading Your Exercise Program"}
          description={isGenerating ? "Creating your personalized workout plan with AI..." : "Preparing your personalized workout plan with progress tracking and exercise details"}
          size="lg"
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
    <div className="min-h-screen bg-gradient-to-br from-fitness-primary-50 via-fitness-accent-50/30 to-fitness-secondary-50/20">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-fitness-neutral-200/50 sticky top-0 z-40">
          <div className="px-4 py-4">
            <EnhancedExerciseHeaderWithAnalytics
              currentProgram={currentProgram}
              onShowAnalytics={() => setShowAnalytics(true)}
              onShowAIDialog={() => setShowAIDialog(true)}
              onRegenerateProgram={handleRegenerateProgram}
              isGenerating={isGenerating}
              workoutType={workoutType}
            />
          </div>
        </div>

        {/* Enhanced Navigation Section with Multi-layered Design */}
        <div className="px-4 py-6 relative">
          <div className="relative">
            {/* Outer glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
            
            {/* Middle shadow layer */}
            <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50">
              {/* Inner content with subtle border */}
              <div className="bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-sm rounded-xl m-1 border border-gray-200/30 shadow-inner">
                <div className="p-4">
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
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="px-4 py-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-fitness-neutral-200/50 overflow-hidden">
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
              onGenerateAIProgram={handleGenerateAIProgram}
            />
          </div>
        </div>

        <AIExerciseDialog
          open={showAIDialog}
          onOpenChange={setShowAIDialog}
          preferences={{ ...aiPreferences, workoutType }}
          setPreferences={setAiPreferences}
          onGenerate={handleGenerateAIProgram}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};

export default EnhancedExercisePage;
