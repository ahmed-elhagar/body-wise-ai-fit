
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOptimizedExerciseProgramPage } from "@/hooks/useOptimizedExerciseProgramPage";
import { ModernExerciseHeader } from "./ModernExerciseHeader";
import { EnhancedDayNavigation } from "./EnhancedDayNavigation";
import { CompactProgressSidebar } from "./CompactProgressSidebar";
import { EnhancedExerciseListContainer } from "./EnhancedExerciseListContainer";
import { EmptyExerciseState } from "./EmptyExerciseState";
import { AIExerciseDialog } from "./AIExerciseDialog";
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

  if (!currentProgram) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header */}
        <ModernExerciseHeader
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

        {/* Enhanced Day Navigation */}
        <div className="px-6 mb-8">
          <EnhancedDayNavigation
            weekStartDate={weekStartDate}
            selectedDayNumber={selectedDayNumber}
            onDayChange={setSelectedDayNumber}
            currentProgram={currentProgram}
            workoutType={workoutType}
          />
        </div>

        {/* Main Content Grid - Reduced to 2 columns */}
        <div className="px-6 pb-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Progress Sidebar - Smaller */}
            <div className="xl:col-span-1">
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

            {/* Exercise Content - Larger */}
            <div className="xl:col-span-2">
              <EnhancedExerciseListContainer
                exercises={todaysExercises}
                onExerciseComplete={handleExerciseComplete}
                onExerciseProgressUpdate={handleExerciseProgressUpdate}
                isRestDay={isRestDay}
                isLoading={false}
              />
            </div>
          </div>
        </div>

        {/* AI Dialog */}
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
