
import { ExerciseEnhancedNavigation } from "./ExerciseEnhancedNavigation";
import { WorkoutTypeTabs } from "./WorkoutTypeTabs";
import { AIExerciseDialog } from "./AIExerciseDialog";
import { ExerciseProgram, ExercisePreferences } from "@/hooks/useExerciseProgramPage";

interface ExerciseProgramPageContentProps {
  currentDate: Date;
  weekStartDate: Date;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  currentProgram: ExerciseProgram | null;
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  todaysWorkouts: any[];
  todaysExercises: any[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  aiPreferences: ExercisePreferences;
  setAiPreferences: (prefs: ExercisePreferences) => void;
  handleGenerateAIProgram: (preferences: ExercisePreferences) => void;
  handleRegenerateProgram: () => void;
  handleExerciseComplete: (exerciseId: string) => void;
  handleExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isGenerating: boolean;
  refetch: () => void;
  isRestDay?: boolean;
}

export const ExerciseProgramPageContent = ({
  currentDate,
  weekStartDate,
  selectedDayNumber,
  setSelectedDayNumber,
  currentWeekOffset,
  setCurrentWeekOffset,
  currentProgram,
  workoutType,
  setWorkoutType,
  todaysWorkouts,
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  showAIDialog,
  setShowAIDialog,
  aiPreferences,
  setAiPreferences,
  handleGenerateAIProgram,
  handleRegenerateProgram,
  handleExerciseComplete,
  handleExerciseProgressUpdate,
  isGenerating,
  refetch,
  isRestDay
}: ExerciseProgramPageContentProps) => {
  // Check if current week has data for the selected workout type
  const hasDataForCurrentWeek = currentProgram && currentProgram.workout_type === workoutType;

  const handleGenerateForCurrentWeek = () => {
    const preferences = {
      ...aiPreferences,
      workoutType: workoutType
    };
    handleGenerateAIProgram(preferences);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Enhanced Navigation - Week and Day Selection */}
      <ExerciseEnhancedNavigation
        currentWeekOffset={currentWeekOffset}
        setCurrentWeekOffset={setCurrentWeekOffset}
        weekStartDate={weekStartDate}
        selectedDayNumber={selectedDayNumber}
        setSelectedDayNumber={setSelectedDayNumber}
        currentProgram={currentProgram}
        workoutType={workoutType}
        hasDataForCurrentWeek={!!hasDataForCurrentWeek}
        onGenerateForWeek={handleGenerateForCurrentWeek}
      />

      {/* Workout Type Tabs with Content */}
      <WorkoutTypeTabs
        workoutType={workoutType}
        setWorkoutType={setWorkoutType}
        currentProgram={currentProgram}
        todaysExercises={todaysExercises}
        completedExercises={completedExercises}
        totalExercises={totalExercises}
        progressPercentage={progressPercentage}
        selectedDayNumber={selectedDayNumber}
        currentWeekOffset={currentWeekOffset}
        onExerciseComplete={handleExerciseComplete}
        onExerciseProgressUpdate={handleExerciseProgressUpdate}
        onGenerateAIProgram={handleGenerateAIProgram}
        isGenerating={isGenerating}
        isRestDay={isRestDay}
      />

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
  );
};
