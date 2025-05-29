
import { ExerciseListEnhanced } from "./ExerciseListEnhanced";
import { ExerciseProgressTracker } from "./ExerciseProgressTracker";
import { ExerciseMotivationCard } from "./ExerciseMotivationCard";
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
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string) => void;
  isRestDay?: boolean;
}

export const WorkoutContentLayout = ({
  todaysExercises,
  completedExercises,
  totalExercises,
  progressPercentage,
  currentProgram,
  selectedDayNumber,
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay
}: WorkoutContentLayoutProps) => {
  const { t } = useLanguage();
  const workoutSession = useWorkoutSession();

  const handleStartWorkout = () => {
    workoutSession.startSession();
  };

  const handleCompleteExercise = (exerciseId: string) => {
    workoutSession.completeExercise(exerciseId);
    onExerciseComplete(exerciseId);
  };

  return (
    <div className="space-y-4">
      {/* Quick Actions - Sticky at top */}
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

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Exercise List - Takes most space */}
        <div className="lg:col-span-3">
          <ExerciseListEnhanced 
            exercises={todaysExercises}
            isLoading={false}
            onExerciseComplete={handleCompleteExercise}
            onExerciseProgressUpdate={onExerciseProgressUpdate}
            isRestDay={isRestDay}
          />
        </div>

        {/* Sidebar with Progress and Motivation */}
        <div className="lg:col-span-1 space-y-4">
          {/* Progress Summary */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-gray-800">
                {t('exercise.todaysProgress')}
              </h3>
              <div className="text-2xl font-bold text-blue-600">
                {completedExercises}/{totalExercises}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="text-sm text-gray-600">
                {Math.round(progressPercentage)}% {t('exercise.completed').toLowerCase()}
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <ExerciseProgressTracker
            currentProgram={currentProgram}
            selectedDay={selectedDayNumber}
            completedExercises={completedExercises}
            totalExercises={totalExercises}
          />

          {/* Motivation Card */}
          <ExerciseMotivationCard
            completedExercises={completedExercises}
            totalExercises={totalExercises}
            isRestDay={isRestDay}
          />
        </div>
      </div>
    </div>
  );
};
