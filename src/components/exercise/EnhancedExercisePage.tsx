import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOptimizedExerciseProgramPage } from "@/hooks/useOptimizedExerciseProgramPage";
import ExerciseHeader from "./ExerciseHeader";
import DayTabs from "../meal-plan/DayTabs";
import ProgressRing from "./ProgressRing";
import ExerciseList from "./ExerciseList";
import { EmptyExerciseState } from "./EmptyExerciseState";
import { AIExerciseDialog } from "./AIExerciseDialog";

// Simple loading component
const ExerciseLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

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

  // Loading state
  if (isLoading) {
    return <ExerciseLoader />;
  }

  // Error state
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Exercise Loading Error</h3>
            <p className="text-gray-600 mb-6">Unable to load your exercise program. Please try again.</p>
            <button
              onClick={() => refetch()}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
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
        {/* Header */}
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

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Progress Sidebar */}
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
              
              {/* Motivation Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto">
                    <span className="text-2xl">💪</span>
                  </div>
                  <h3 className="font-semibold text-blue-800">
                    {progressPercentage === 100 ? 'Completed!' : 
                     progressPercentage > 50 ? 'Almost There!' : 
                     progressPercentage > 0 ? 'Keep Going!' : 'Start Strong!'}
                  </h3>
                  <p className="text-sm text-blue-600">
                    {progressPercentage === 100 ? 'Great job finishing today\'s workout!' : 
                     'Every rep counts towards your goals'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-6">
            {/* Day Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <DayTabs
                weekStartDate={weekStartDate}
                selectedDayNumber={selectedDayNumber}
                onDayChange={setSelectedDayNumber}
              />
            </div>

            {/* Exercise List */}
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
