
import { useLanguage } from "@/contexts/LanguageContext";
import { WeeklyExerciseNavigation } from "./WeeklyExerciseNavigation";
import { ExerciseDaySelector } from "./ExerciseDaySelector";
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { EmptyExerciseState } from "./EmptyExerciseState";
import { AIExerciseDialog } from "./AIExerciseDialog";
import { TodaysWorkoutProgressCard } from "./TodaysWorkoutProgressCard";
import { format, addDays } from "date-fns";
import { EnhancedWorkoutTypeToggle } from "./EnhancedWorkoutTypeToggle";

interface ExerciseProgramPageContentProps {
  currentDate: Date;
  weekStartDate: Date;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  currentProgram: any;
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  todaysWorkouts: any[];
  todaysExercises: any[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  aiPreferences: any;
  setAiPreferences: (prefs: any) => void;
  handleGenerateAIProgram: (prefs: any) => void;
  handleRegenerateProgram: () => void;
  handleExerciseComplete: (exerciseId: string) => Promise<void>;
  handleExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  isGenerating: boolean;
  refetch: () => void;
  isRestDay: boolean;
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
  const { t } = useLanguage();

  const currentSelectedDate = addDays(weekStartDate, selectedDayNumber - 1);
  const isToday = format(currentSelectedDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');

  console.log('🎯 ExerciseProgramPageContent - Debug Info:', {
    hasCurrentProgram: !!currentProgram,
    workoutType,
    selectedDayNumber,
    todaysWorkoutsCount: todaysWorkouts?.length || 0,
    todaysExercisesCount: todaysExercises?.length || 0,
    isRestDay,
    progressPercentage,
    isToday
  });

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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Enhanced Workout Type Toggle */}
      <EnhancedWorkoutTypeToggle
        workoutType={workoutType}
        onWorkoutTypeChange={setWorkoutType}
      />

      {/* Weekly Navigation */}
      <WeeklyExerciseNavigation
        currentWeekOffset={currentWeekOffset}
        setCurrentWeekOffset={setCurrentWeekOffset}
        weekStartDate={weekStartDate}
      />

      {/* Day Selector */}
      <ExerciseDaySelector
        selectedDayNumber={selectedDayNumber}
        setSelectedDayNumber={setSelectedDayNumber}
        currentProgram={currentProgram}
        workoutType={workoutType}
      />

      {/* Progress Overview Card */}
      {!isRestDay && totalExercises > 0 && (
        <TodaysWorkoutProgressCard
          todaysWorkouts={todaysWorkouts}
          completedExercises={completedExercises}
          totalExercises={totalExercises}
          progressPercentage={progressPercentage}
          currentSelectedDate={currentSelectedDate}
          isToday={isToday}
        />
      )}

      {/* Exercise List */}
      <ExerciseListEnhanced
        exercises={todaysExercises}
        isLoading={false}
        onExerciseComplete={handleExerciseComplete}
        onExerciseProgressUpdate={handleExerciseProgressUpdate}
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
