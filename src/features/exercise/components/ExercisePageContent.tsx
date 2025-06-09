
import { Card } from "@/components/ui/card";
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { RestDayCard } from "./RestDayCard";
import { ExerciseEmptyState } from "./ExerciseEmptyState";
import { CompactProgressSection } from "./CompactProgressSection";
import { useLanguage } from "@/contexts/LanguageContext";
import SimpleLoadingIndicator from "@/components/ui/simple-loading-indicator";

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
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  onGenerateAIProgram: (preferences: any) => Promise<void>;
}

export const ExercisePageContent = ({
  isLoading,
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  isRestDay,
  selectedDayNumber,
  onExerciseComplete,
  onExerciseProgressUpdate
}: ExercisePageContentProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="p-6">
        <SimpleLoadingIndicator
          message="Loading Today's Workout"
          description="Preparing your exercise session..."
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Compact Progress Section */}
      <CompactProgressSection
        completedExercises={completedExercises}
        totalExercises={totalExercises}
        progressPercentage={progressPercentage}
        isRestDay={isRestDay}
        selectedDayNumber={selectedDayNumber}
      />

      {/* Main Content */}
      {isRestDay ? (
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
          isRestDay={isRestDay}
          selectedDayNumber={selectedDayNumber}
        />
      )}
    </div>
  );
};
