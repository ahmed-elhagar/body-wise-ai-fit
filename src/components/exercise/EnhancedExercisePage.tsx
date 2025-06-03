
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOptimizedExerciseProgramPage } from "@/hooks/useOptimizedExerciseProgramPage";
import { ModernExerciseHeader } from "./ModernExerciseHeader";
import { EnhancedDayNavigation } from "./EnhancedDayNavigation";
import { EnhancedExerciseListContainer } from "./EnhancedExerciseListContainer";
import { EmptyExerciseState } from "./EmptyExerciseState";
import { AIExerciseDialog } from "./AIExerciseDialog";
import { CompactProgressSidebar } from "./CompactProgressSidebar";
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

  if (isLoading) {
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-6">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {t('exercise.errorTitle') || 'Exercise Loading Error'}
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {t('exercise.errorMessage') || 'Unable to load your exercise program. Please try again or check your connection.'}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => refetch()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t('exercise.retry') || 'Try Again'}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto">
        {/* Header - Always show */}
        <div className="px-3 py-3">
          <ModernExerciseHeader
            currentProgram={currentProgram}
            onShowAIDialog={() => setShowAIDialog(true)}
            onRegenerateProgram={handleRegenerateProgram}
            isGenerating={isGenerating}
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

        {/* Main Content */}
        <div className="px-3 pb-4">
          {!currentProgram ? (
            /* Empty State within the layout */
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
              <div className="xl:col-span-3">
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

              {/* Empty sidebar placeholder */}
              <div className="hidden xl:block xl:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-700 mb-2">Progress Tracking</h4>
                    <p className="text-sm text-gray-500">
                      Your workout progress and achievements will appear here once you start your program.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Program Content */
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
              {/* Main Exercise Content - Takes up 3/4 on desktop, full width on mobile */}
              <div className="xl:col-span-3">
                <EnhancedExerciseListContainer
                  exercises={todaysExercises}
                  onExerciseComplete={handleExerciseComplete}
                  onExerciseProgressUpdate={handleExerciseProgressUpdate}
                  isRestDay={isRestDay}
                  isLoading={false}
                  completedExercises={completedExercises}
                  totalExercises={totalExercises}
                  progressPercentage={progressPercentage}
                  isToday={isToday}
                  currentProgram={currentProgram}
                  selectedDayNumber={selectedDayNumber}
                />
              </div>

              {/* Compact Progress Sidebar - Shows on desktop only */}
              <div className="hidden xl:block xl:col-span-1">
                <CompactProgressSidebar
                  completedExercises={completedExercises}
                  totalExercises={totalExercises}
                  progressPercentage={progressPercentage}
                  isToday={isToday}
                  isRestDay={isRestDay}
                  currentProgram={currentProgram}
                  selectedDayNumber={selectedDayNumber}
                />
              </div>
            </div>
          )}
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

export default EnhancedExercisePage;
