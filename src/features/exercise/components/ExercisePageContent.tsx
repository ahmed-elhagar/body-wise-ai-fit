
import { WorkoutContentLayout } from "./WorkoutContentLayout";

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
  currentProgram,
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  isRestDay,
  selectedDayNumber,
  onExerciseComplete,
  onExerciseProgressUpdate,
}: ExercisePageContentProps) => {
  if (!currentProgram) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Exercise Program Found
          </h3>
          <p className="text-gray-600">
            Create your first exercise program to get started with your fitness journey.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3">
      <WorkoutContentLayout
        todaysExercises={todaysExercises}
        completedExercises={completedExercises}
        totalExercises={totalExercises}
        progressPercentage={progressPercentage}
        currentProgram={currentProgram}
        selectedDayNumber={selectedDayNumber}
        currentWeekOffset={0}
        onExerciseComplete={onExerciseComplete}
        onExerciseProgressUpdate={onExerciseProgressUpdate}
        isRestDay={isRestDay}
      />
    </div>
  );
};
