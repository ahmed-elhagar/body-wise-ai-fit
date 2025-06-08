
import { ExerciseListEnhanced } from "@/features/exercise";
import { ExerciseProgressTracker } from "./ExerciseProgressTracker";
import { ExerciseQuickActions } from "./ExerciseQuickActions";
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

      {/* Quick Actions - Improved spacing and styling */}
      <div className="sticky top-4 z-10">
        <ExerciseQuickActions
          isWorkoutActive={workoutSession.isActive}
          isPaused={workoutSession.isPaused}
          totalTime={workoutSession.totalTime}
          onStartWorkout={handleStartWorkout}
          onPauseWorkout={workoutSession.pauseSession}
          onResumeWorkout={workoutSession.resumeSession}
          onRestartWorkout={workoutSession.resetSession}
          onShareProgress={workoutSession.shareProgress}
          canStart={totalExercises > 0}
          isRestDay={isRestDay}
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
