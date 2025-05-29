
import { ExerciseHeader } from "./ExerciseHeader";
import { WorkoutTypeToggle } from "./WorkoutTypeToggle";
import { ExerciseProgramActions } from "./ExerciseProgramActions";
import { WeeklyExerciseNavigation } from "./WeeklyExerciseNavigation";
import { ExerciseDaySelector } from "./ExerciseDaySelector";
import { TodaysWorkoutCard } from "./TodaysWorkoutCard";
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { WeeklyProgramOverview } from "./WeeklyProgramOverview";
import { ExerciseProgramSelector } from "./ExerciseProgramSelector";
import { AIExerciseDialog } from "./AIExerciseDialog";
import { ExerciseProgram, ExercisePreferences } from "@/hooks/useExerciseProgramPage";

interface ExerciseProgramPageContentProps {
  currentDate: Date;
  currentDay: string;
  onShowAIDialog: () => void;
  onRegenerateProgram: () => void;
  isGenerating: boolean;
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
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
  refetch: () => void;
}

export const ExerciseProgramPageContent = ({
  currentDate,
  currentDay,
  onShowAIDialog,
  onRegenerateProgram,
  isGenerating,
  workoutType,
  setWorkoutType,
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate,
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
  refetch
}: ExerciseProgramPageContentProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <ExerciseHeader 
          currentProgram={currentProgram}
          onGenerateProgram={onRegenerateProgram}
          isGenerating={isGenerating}
        />

        {currentProgram ? (
          <div className="space-y-6">
            <WorkoutTypeToggle 
              workoutType={workoutType}
              onWorkoutTypeChange={setWorkoutType}
            />

            <ExerciseProgramActions
              onShowAIDialog={onShowAIDialog}
              onRegenerateProgram={onRegenerateProgram}
              isGenerating={isGenerating}
              workoutType={workoutType}
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
            />

            <div className="grid lg:grid-cols-4 gap-6">
              <TodaysWorkoutCard
                todaysWorkouts={todaysWorkouts}
                currentProgram={currentProgram}
                completedExercises={completedExercises}
                totalExercises={totalExercises}
                progressPercentage={progressPercentage}
                workoutType={workoutType}
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

            <WeeklyProgramOverview
              currentProgram={currentProgram}
              selectedDay={selectedDayNumber}
              onDaySelect={setSelectedDayNumber}
              workoutType={workoutType}
            />
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
      </div>
    </div>
  );
};
