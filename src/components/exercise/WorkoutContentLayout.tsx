
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
  currentWeekOffset: number;
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

  const handleCompleteExercise = (exerciseId: string) => {
    workoutSession.completeExercise(exerciseId);
    onExerciseComplete(exerciseId);
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

      {/* Main Content Layout - Enhanced grid and spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

        {/* Sidebar with enhanced design */}
        <div className="lg:col-span-1 space-y-6">
          {/* Progress Summary Card - Redesigned for better visual appeal */}
          <div className="bg-white rounded-2xl p-6 border border-health-border shadow-sm">
            <div className="text-center space-y-4">
              {/* Circular Progress Indicator */}
              <div className="relative w-20 h-20 mx-auto">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-health-soft stroke-current"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-health-primary stroke-current transition-all duration-500 ease-out"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${progressPercentage}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-health-primary">
                    {totalExercises > 0 ? Math.round(progressPercentage) : 0}%
                  </span>
                </div>
              </div>
              
              {/* Progress Details */}
              <div>
                <h3 className="font-semibold text-health-text-primary mb-2 text-lg">
                  {t('exercise.todaysProgress')}
                </h3>
                <div className="text-sm text-health-text-secondary">
                  <span className="font-medium text-health-primary">{completedExercises}</span>
                  <span className="mx-1">/</span>
                  <span>{totalExercises}</span>
                  <span className="ml-1">{t('exercise.exercises')}</span>
                </div>
              </div>
              
              {/* Progress Status */}
              <div className="bg-health-soft rounded-xl px-4 py-2">
                <div className="text-xs font-medium text-health-primary">
                  {progressPercentage === 100 ? '🎉 Completed!' : 
                   progressPercentage > 50 ? '💪 Almost there!' : 
                   progressPercentage > 0 ? '🔥 Keep going!' : '🎯 Ready to start!'}
                </div>
              </div>
            </div>
          </div>

          {/* Motivation Card - Enhanced design */}
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
