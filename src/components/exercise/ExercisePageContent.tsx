
import { useLanguage } from "@/contexts/LanguageContext";
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { EmptyExerciseState } from "./EmptyExerciseState";
import { AIExerciseDialog } from "./AIExerciseDialog";
import { TodaysWorkoutProgressCard } from "./TodaysWorkoutProgressCard";
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
  todaysWorkouts?: any[];
  currentSelectedDate?: Date;
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
  onExerciseProgressUpdate,
  todaysWorkouts = [],
  currentSelectedDate = new Date()
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
