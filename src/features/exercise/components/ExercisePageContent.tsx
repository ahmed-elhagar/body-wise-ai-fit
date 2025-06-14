
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { RestDayCard } from "./RestDayCard";
import { ExerciseEmptyState } from "./ExerciseEmptyState";
import { CompactProgressSection } from "./CompactProgressSection";
import { useLanguage } from "@/contexts/LanguageContext";
import SimpleLoadingIndicator from "@/components/ui/simple-loading-indicator";
import { Exercise, ExerciseProgram } from "@/features/exercise";

interface ExercisePageContentProps {
  isLoading: boolean;
  currentProgram: ExerciseProgram | null;
  todaysExercises: Exercise[];
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
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  onGenerateAIProgram: (preferences: any) => Promise<void>;
}

export const ExercisePageContent = ({
  isLoading,
  currentProgram,
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  isRestDay,
  selectedDayNumber,
  onExerciseComplete,
  onExerciseProgressUpdate
}: ExercisePageContentProps) => {
  if (isLoading) {
    return (
      <div className="p-6">
        <SimpleLoadingIndicator
          message="Loading Workout Data"
          description="Fetching your exercise plan..."
        />
      </div>
    );
  }

  const selectedDayWorkout = currentProgram?.daily_workouts?.find(
    (workout: any) => workout.day_number === selectedDayNumber
  );
  
  const isActualRestDay = selectedDayWorkout?.is_rest_day || false;

  console.log('🎯 ExercisePageContent Debug:', {
    currentProgram: !!currentProgram,
    selectedDayNumber,
    selectedDayWorkout,
    isActualRestDay,
    todaysExercisesLength: todaysExercises.length,
    isRestDay
  });

  return (
    <div className="p-6 space-y-6">
      {/* Compact Progress Section */}
      <CompactProgressSection
        completedExercises={completedExercises}
        totalExercises={totalExercises}
        progressPercentage={progressPercentage}
        isRestDay={isActualRestDay}
        selectedDayNumber={selectedDayNumber}
      />

      {/* Main Content */}
      {isActualRestDay ? (
        <RestDayCard />
      ) : todaysExercises.length === 0 ? (
        <ExerciseEmptyState
          onGenerateProgram={() => console.log('Generate program')}
          workoutType="home"
          dailyWorkoutId=""
        />
      ) : (
        <ExerciseListEnhanced
          exercises={todaysExercises}
          isLoading={false}
          onExerciseComplete={onExerciseComplete}
          onExerciseProgressUpdate={onExerciseProgressUpdate}
          isRestDay={isActualRestDay}
          selectedDayNumber={selectedDayNumber}
        />
      )}
    </div>
  );
};
