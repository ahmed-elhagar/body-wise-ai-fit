
import { Card } from "@/components/ui/card";
import { ExerciseErrorState } from "./ExerciseErrorState";
import { ExerciseHeader } from "./ExerciseHeader";
import { DaySelector } from "./DaySelector";
import { ExercisePageContent } from "./ExercisePageContent";
import { AIExerciseDialog } from "./AIExerciseDialog";
import { UnifiedAILoadingDialog } from "@/components/ai/UnifiedAILoadingDialog";

interface ExercisePageLayoutProps {
  // Data props
  currentProgram: any;
  todaysExercises: any[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  isRestDay: boolean;
  isToday: boolean;
  isLoading: boolean;
  error: any;
  
  // Navigation props
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  
  // AI props
  showAIDialog: boolean;
  setShowAIDialog: (show: boolean) => void;
  aiPreferences: any;
  setAiPreferences: (prefs: any) => void;
  isGenerating: boolean;
  exerciseSteps: any[];
  currentStepIndex: number;
  isComplete: boolean;
  progress: number;
  
  // Actions
  onShowAnalytics: () => void;
  onGenerateAIProgram: (preferences: any) => Promise<void>;
  onRegenerateProgram: () => Promise<void>;
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  refetch: () => void;
}

export const ExercisePageLayout = ({
  currentProgram,
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  isRestDay,
  isToday,
  isLoading,
  error,
  selectedDayNumber,
  setSelectedDayNumber,
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate,
  workoutType,
  setWorkoutType,
  showAIDialog,
  setShowAIDialog,
  aiPreferences,
  setAiPreferences,
  isGenerating,
  exerciseSteps,
  currentStepIndex,
  isComplete,
  progress,
  onShowAnalytics,
  onGenerateAIProgram,
  onRegenerateProgram,
  onExerciseComplete,
  onExerciseProgressUpdate,
  refetch
}: ExercisePageLayoutProps) => {
  if (error) {
    return (
      <ExerciseErrorState 
        onRetry={refetch}
        error={error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Header */}
        <ExerciseHeader
          currentProgram={currentProgram}
          weekStartDate={weekStartDate}
          currentWeekOffset={currentWeekOffset}
          workoutType={workoutType}
          onWeekChange={setCurrentWeekOffset}
          onShowAIDialog={() => setShowAIDialog(true)}
          onRegenerateProgram={onRegenerateProgram}
          onWorkoutTypeChange={setWorkoutType}
          isGenerating={isGenerating}
        />

        {/* Day Selector */}
        <DaySelector
          selectedDayNumber={selectedDayNumber}
          setSelectedDayNumber={setSelectedDayNumber}
          weekStartDate={weekStartDate}
          currentProgram={currentProgram}
        />

        {/* Main Content */}
        <ExercisePageContent
          isLoading={isLoading}
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
          onExerciseComplete={onExerciseComplete}
          onExerciseProgressUpdate={onExerciseProgressUpdate}
          onGenerateAIProgram={onGenerateAIProgram}
        />

        {/* AI Dialog */}
        <AIExerciseDialog
          open={showAIDialog}
          onOpenChange={setShowAIDialog}
          preferences={aiPreferences}
          onPreferencesChange={setAiPreferences}
          onGenerate={onGenerateAIProgram}
          isGenerating={isGenerating}
          workoutType={workoutType}
        />

        {/* AI Loading Dialog */}
        <UnifiedAILoadingDialog
          isOpen={isGenerating}
          title="Generating Exercise Program"
          description="Creating your personalized workout plan..."
          steps={exerciseSteps}
          currentStepIndex={currentStepIndex}
          isComplete={isComplete}
          progress={progress}
          onClose={() => {}}
        />
      </div>
    </div>
  );
};
