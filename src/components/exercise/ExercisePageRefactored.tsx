import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOptimizedExerciseProgramPage } from "@/hooks/useOptimizedExerciseProgramPage";
import { createMockExercise } from "@/types/exercise";
import ExerciseHeader from "./ExerciseHeader";
import DayTabs from "../meal-plan/DayTabs";
import ProgressRing from "./ProgressRing";
import ExerciseList from "./ExerciseList";
import { EmptyExerciseState } from "./EmptyExerciseState";
import { AIExerciseDialog } from "./AIExerciseDialog";
import SimpleLoadingIndicator from "@/components/ui/simple-loading-indicator";

const ExercisePageRefactored = () => {
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
  } = useOptimizedExerciseProgramPage();

  const currentSelectedDate = addDays(weekStartDate, selectedDayNumber - 1);
  const isToday = format(currentSelectedDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');

  // Enhanced loading state with progress steps and timeout protection
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <SimpleLoadingIndicator
          message="Loading Your Exercise Program"
          description="Preparing your personalized workout plan with progress tracking and exercise details"
          size="lg"
        />
      </div>
    );
  }

  // Enhanced error state with better recovery options
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-red-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('exercise.errorTitle') || 'Exercise Loading Error'}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('exercise.errorMessage') || 'Unable to load your exercise program. Please try again or check your connection.'}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => refetch()}
                className="w-full bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-fitness-primary-600 hover:to-fitness-primary-700 transition-all duration-300"
              >
                {t('exercise.retry') || 'Try Again'}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced empty state with better design
  if (!currentProgram) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-6">
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Enhanced Header with better spacing and visual hierarchy */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <ExerciseHeader
            currentProgram={currentProgram}
            weekStartDate={weekStartDate}
            currentWeekOffset={currentWeekOffset}
            workoutType={workoutType}
            onWeekChange={setCurrentWeekOffset}
            onShowAIDialog={() => setShowAIDialog(true)}
            onRegenerateProgram={handleRegenerateProgram}
            onWorkoutTypeChange={setWorkoutType}
            isGenerating={isGenerating}
          />
        </div>

        {/* Enhanced Layout with better grid and spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Enhanced Progress Sidebar with better visual design */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <ProgressRing
                  completedExercises={completedExercises}
                  totalExercises={totalExercises}
                  progressPercentage={progressPercentage}
                  isToday={isToday}
                  isRestDay={isRestDay}
                />
              </div>
              
              {/* Enhanced Motivation Card */}
              <div className="bg-gradient-to-br from-fitness-primary-50 to-fitness-secondary-50 rounded-2xl border border-fitness-primary-200 p-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-fitness-primary-500 to-fitness-secondary-500 rounded-xl flex items-center justify-center mx-auto">
                    <span className="text-2xl">💪</span>
                  </div>
                  <h3 className="font-semibold text-fitness-primary-800">
                    {progressPercentage === 100 ? 'Completed!' : 
                     progressPercentage > 50 ? 'Almost There!' : 
                     progressPercentage > 0 ? 'Keep Going!' : 'Start Strong!'}
                  </h3>
                  <p className="text-sm text-fitness-primary-600">
                    {progressPercentage === 100 ? 'Great job finishing today\'s workout!' : 
                     'Every rep counts towards your goals'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Main Content with better spacing */}
          <div className="lg:col-span-4 space-y-6">
            {/* Enhanced Day Tabs with better active states */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <DayTabs
                weekStartDate={weekStartDate}
                selectedDayNumber={selectedDayNumber}
                onDayChange={setSelectedDayNumber}
              />
            </div>

            {/* Enhanced Exercise List Container */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <ExerciseList
                exercises={todaysExercises}
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
          preferences={aiPreferences}
          setPreferences={setAiPreferences}
          onGenerate={handleGenerateAIProgram}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};

export default ExercisePageRefactored;
