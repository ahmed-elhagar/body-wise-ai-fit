
import React, { memo, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { WeeklyExerciseNavigation } from "./WeeklyExerciseNavigation";
import { ExerciseDaySelector } from "./ExerciseDaySelector";
import { OptimizedExerciseList } from "./OptimizedExerciseList";
import { EmptyExerciseState } from "./EmptyExerciseState";
import { AIExerciseDialog } from "./AIExerciseDialog";
import { ExercisePageHeader } from "./ExercisePageHeader";
import { TodaysWorkoutProgressCard } from "./TodaysWorkoutProgressCard";
import { format, addDays } from "date-fns";
import { EnhancedWorkoutTypeToggle } from "./EnhancedWorkoutTypeToggle";

interface OptimizedExerciseProgramPageContentProps {
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
  handleExerciseComplete: (exerciseId: string) => void;
  handleExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isGenerating: boolean;
  refetch: () => void;
  isRestDay: boolean;
}

export const OptimizedExerciseProgramPageContent = memo(({
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
}: OptimizedExerciseProgramPageContentProps) => {
  const { t } = useLanguage();

  const currentSelectedDate = useMemo(() => 
    addDays(weekStartDate, selectedDayNumber - 1), 
    [weekStartDate, selectedDayNumber]
  );
  
  const isToday = useMemo(() => 
    format(currentSelectedDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd'),
    [currentSelectedDate, currentDate]
  );

  const memoizedEmptyState = useMemo(() => (
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
  ), [workoutType, showAIDialog, aiPreferences, isGenerating, setShowAIDialog, setWorkoutType, setAiPreferences]);

  if (!currentProgram) {
    return memoizedEmptyState;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <ExercisePageHeader
        currentProgram={currentProgram}
        workoutType={workoutType}
        onShowAIDialog={() => setShowAIDialog(true)}
        onRegenerateProgram={handleRegenerateProgram}
        isGenerating={isGenerating}
      />

      <EnhancedWorkoutTypeToggle
        workoutType={workoutType}
        onWorkoutTypeChange={setWorkoutType}
      />

      <WeeklyExerciseNavigation
        currentWeekOffset={currentWeekOffset}
        setCurrentWeekOffset={setCurrentWeekOffset}
        weekStartDate={weekStartDate}
      />

      <ExerciseDaySelector
        selectedDayNumber={selectedDayNumber}
        setSelectedDayNumber={setSelectedDayNumber}
        currentProgram={currentProgram}
        workoutType={workoutType}
      />

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

      <OptimizedExerciseList
        exercises={todaysExercises}
        isLoading={false}
        onExerciseComplete={handleExerciseComplete}
        onExerciseProgressUpdate={handleExerciseProgressUpdate}
        isRestDay={isRestDay}
      />

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
});

OptimizedExerciseProgramPageContent.displayName = 'OptimizedExerciseProgramPageContent';
