
import { ExerciseListEnhanced } from "@/features/exercise";
import { ExerciseProgressTracker } from "./ExerciseProgressTracker";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWorkoutSession } from "@/hooks/useWorkoutSession";

interface WorkoutContentLayoutProps {
  todaysExercises: any[];
  completedExercises: number;
  totalExercises: number;
  progressPercentage: number;
  currentProgram: any;
  selectedDayNumber: number;
  currentWeekOffset: number;
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  isRestDay?: boolean;
}

export const WorkoutContentLayout = ({
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  currentProgram,
  selectedDayNumber,
  currentWeekOffset,
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay
}: WorkoutContentLayoutProps) => {
  const { t } = useLanguage();
  const workoutSession = useWorkoutSession();

  const handleStartWorkout = () => {
    workoutSession.startSession();
  };

  const handleCompleteExercise = async (exerciseId: string) => {
    workoutSession.completeExercise(exerciseId);
    await onExerciseComplete(exerciseId);
  };

  return (
    <div className="space-y-6">
      {/* Progress Tracker - Enhanced visual hierarchy */}
      <div className="bg-white rounded-2xl border border-health-border shadow-sm overflow-hidden">
        <ExerciseProgressTracker
          currentProgram={currentProgram}
          selectedDay={selectedDayNumber}
          currentWeekOffset={currentWeekOffset}
          completedExercises={completedExercises}
          totalExercises={totalExercises}
        />
      </div>

      {/* Main Exercise List - Full width layout as originally designed */}
      <div className="w-full">
        <ExerciseListEnhanced 
          exercises={todaysExercises}
          isLoading={false}
          onExerciseComplete={handleCompleteExercise}
          onExerciseProgressUpdate={onExerciseProgressUpdate}
          isRestDay={isRestDay}
        />
      </div>
    </div>
  );
};
