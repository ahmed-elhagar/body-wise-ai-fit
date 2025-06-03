
import { useLanguage } from "@/contexts/LanguageContext";
import { WeeklyExerciseNavigation } from "./WeeklyExerciseNavigation";
import { ExerciseDaySelector } from "./ExerciseDaySelector";
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { EmptyExerciseState } from "./EmptyExerciseState";
import { AIExerciseDialog } from "./AIExerciseDialog";
import { ExercisePageHeader } from "./ExercisePageHeader";
import { WorkoutTypeSelector } from "./WorkoutTypeSelector";
import { TodaysWorkoutProgressCard } from "./TodaysWorkoutProgressCard";
import { format, addDays } from "date-fns";
import { EnhancedWorkoutTypeToggle } from "./EnhancedWorkoutTypeToggle";
import PageLoadingOverlay from "@/components/ui/page-loading-overlay";

interface ExercisePageContentProps {
  isLoading: boolean;
  currentProgram: any;
  todaysExercises: any[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isRestDay: boolean;
  isToday: boolean;
  selectedDayNumber: number;
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  aiPreferences: any;
  setAiPreferences: (prefs: any) => void;
  isGenerating: boolean;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
}

export const ExercisePageContent = ({
  isLoading,
  currentProgram,
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  isRestDay,
  isToday,
  selectedDayNumber,
  workoutType,
  setWorkoutType,
  showAIDialog,
  setShowAIDialog,
  aiPreferences,
  setAiPreferences,
  isGenerating,
  onExerciseComplete,
  onExerciseProgressUpdate
}: ExercisePageContentProps) => {
  const { t } = useLanguage();

  // Show empty state if no program exists
  if (!currentProgram) {
    return (
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
    );
  }

  return (
    <div className="relative">
      {/* Loading overlay for week navigation - same pattern as meals */}
      <PageLoadingOverlay
        isLoading={isLoading}
        type="exercise"
        message="Loading Week Data"
        description="Fetching your exercise program for the selected week..."
        blur={true}
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <ExercisePageHeader
          currentProgram={currentProgram}
          workoutType={workoutType}
          onShowAIDialog={() => setShowAIDialog(true)}
          onRegenerateProgram={() => {}} // This will be handled by parent
          isGenerating={isGenerating}
        />

        {/* Enhanced Workout Type Toggle */}
        <EnhancedWorkoutTypeToggle
          workoutType={workoutType}
          onWorkoutTypeChange={setWorkoutType}
        />

        {/* Weekly Navigation */}
        <WeeklyExerciseNavigation
          currentWeekOffset={0} // This will be passed from parent
          setCurrentWeekOffset={() => {}} // This will be handled by parent
          weekStartDate={new Date()} // This will be passed from parent
        />

        {/* Day Selector */}
        <ExerciseDaySelector
          selectedDayNumber={selectedDayNumber}
          setSelectedDayNumber={() => {}} // This will be handled by parent
          currentProgram={currentProgram}
          workoutType={workoutType}
        />

        {/* Progress Overview Card */}
        {!isRestDay && totalExercises > 0 && (
          <TodaysWorkoutProgressCard
            todaysWorkouts={[]} // This will be passed from parent
            completedExercises={completedExercises}
            totalExercises={totalExercises}
            progressPercentage={progressPercentage}
            currentSelectedDate={new Date()} // This will be passed from parent
            isToday={isToday}
          />
        )}

        {/* Exercise List */}
        <ExerciseListEnhanced
          exercises={todaysExercises}
          isLoading={false}
          onExerciseComplete={onExerciseComplete}
          onExerciseProgressUpdate={onExerciseProgressUpdate}
          isRestDay={isRestDay}
        />

        {/* AI Dialog */}
        <AIExerciseDialog
          open={showAIDialog}
          onOpenChange={setShowAIDialog}
          preferences={aiPreferences}
          setPreferences={setAiPreferences}
          onGenerate={() => {}} // This will be handled by parent
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};
