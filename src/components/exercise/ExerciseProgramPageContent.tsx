
import { ExerciseHeader } from "./ExerciseHeader";
import { ExerciseDaySelector } from "./ExerciseDaySelector";
import { TodaysWorkoutCard } from "./TodaysWorkoutCard";
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { ExerciseProgramSelector } from "./ExerciseProgramSelector";
import { AIExerciseDialog } from "./AIExerciseDialog";
import { ExerciseProgram, ExercisePreferences } from "@/hooks/useExerciseProgramPage";

interface ExerciseProgramPageContentProps {
  currentDate: Date;
  currentDay: string;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentProgram: ExerciseProgram | null;
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
  isGenerating: boolean;
  refetch: () => void;
}

export const ExerciseProgramPageContent = ({
  currentDate,
  currentDay,
  selectedDayNumber,
  setSelectedDayNumber,
  currentProgram,
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
  isGenerating,
  refetch
}: ExerciseProgramPageContentProps) => {
  return (
    <>
      <ExerciseHeader 
        currentProgram={currentProgram}
        onGenerateProgram={handleRegenerateProgram}
        isGenerating={isGenerating}
        onShowAIDialog={() => setShowAIDialog(true)}
      />

      {currentProgram ? (
        <div className="space-y-6">
          <ExerciseDaySelector
            selectedDayNumber={selectedDayNumber}
            setSelectedDayNumber={setSelectedDayNumber}
            currentProgram={currentProgram}
          />

          <div className="grid lg:grid-cols-4 gap-6">
            <TodaysWorkoutCard
              todaysWorkouts={todaysWorkouts}
              currentProgram={currentProgram}
              completedExercises={completedExercises}
              totalExercises={totalExercises}
              progressPercentage={progressPercentage}
              workoutType={currentProgram.workout_type}
              selectedDay={selectedDayNumber}
            />

            <ExerciseListEnhanced 
              exercises={todaysExercises}
              isLoading={false}
              onExerciseComplete={(exerciseId) => {
                console.log('Exercise completed:', exerciseId);
                refetch();
              }}
            />
          </div>
        </div>
      ) : (
        <ExerciseProgramSelector 
          onGenerateProgram={handleGenerateAIProgram}
          isGenerating={isGenerating}
        />
      )}

      <AIExerciseDialog
        open={showAIDialog}
        onOpenChange={setShowAIDialog}
        preferences={aiPreferences}
        setPreferences={setAiPreferences}
        onGenerate={handleGenerateAIProgram}
        isGenerating={isGenerating}
      />
    </>
  );
};
