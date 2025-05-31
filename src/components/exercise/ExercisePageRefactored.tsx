
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useExerciseProgramPage } from "@/hooks/useExerciseProgramPage";
import ExerciseHeader from "./ExerciseHeader";
import DayTabs from "../meal-plan/DayTabs";
import ProgressRing from "./ProgressRing";
import ExerciseList from "./ExerciseList";
import { EmptyExerciseState } from "./EmptyExerciseState";
import { AIExerciseDialog } from "./AIExerciseDialog";

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
  } = useExerciseProgramPage();

  const currentSelectedDate = addDays(weekStartDate, selectedDayNumber - 1);
  const isToday = format(currentSelectedDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center text-red-600">
          Error loading exercise data. Please try again.
        </div>
      </div>
    );
  }

  if (!currentProgram) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <ProgressRing
              completedExercises={completedExercises}
              totalExercises={totalExercises}
              progressPercentage={progressPercentage}
              isToday={isToday}
              isRestDay={isRestDay}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Day Tabs */}
            <DayTabs
              weekStartDate={weekStartDate}
              selectedDayNumber={selectedDayNumber}
              onDayChange={setSelectedDayNumber}
            />

            {/* Exercise List */}
            <ExerciseList
              exercises={todaysExercises}
              onExerciseComplete={handleExerciseComplete}
              onExerciseProgressUpdate={handleExerciseProgressUpdate}
              isRestDay={isRestDay}
            />
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

export default ExercisePageRefactored;
