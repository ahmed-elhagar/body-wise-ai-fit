
import { Loader2 } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { Exercise } from "@/types/exercise";
import { RestDayCard } from "../../../components/exercise/RestDayCard";
import { ExerciseErrorHandler } from "../../../components/exercise/ExerciseErrorHandler";
import { CustomExerciseDialog } from "../../../components/exercise/CustomExerciseDialog";
import { ExerciseListHeader } from "../../../components/exercise/ExerciseListHeader";
import { ExerciseSessionView } from "../../../components/exercise/ExerciseSessionView";
import { ExerciseListView } from "../../../components/exercise/ExerciseListView";
import { ExerciseEmptyState } from "../../../components/exercise/ExerciseEmptyState";
import { useState, useCallback, useMemo } from "react";

interface ExerciseListProps {
  exercises: Exercise[];
  isLoading: boolean;
  onExerciseComplete: (exerciseId: string) => Promise<void>;
  onExerciseProgressUpdate: (exerciseId: string, sets: number, reps: string, notes?: string, weight?: number) => Promise<void>;
  isRestDay?: boolean;
  currentProgram?: any;
  selectedDayNumber?: number;
  error?: Error | null;
  onRetry?: () => void;
}

export const ExerciseList = ({
  exercises,
  isLoading,
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay = false,
  currentProgram,
  selectedDayNumber = 1,
  error,
  onRetry
}: ExerciseListProps) => {
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState<'session' | 'list'>('session');
  const [showCustomExerciseDialog, setShowCustomExerciseDialog] = useState(false);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);

  const dailyWorkoutId = currentProgram?.daily_workouts?.find(
    (workout: any) => workout.day_number === selectedDayNumber
  )?.id;

  const { completedCount, totalCount } = useMemo(() => {
    const completed = exercises.filter(ex => ex.completed).length;
    const total = exercises.length;
    return { completedCount: completed, totalCount: total };
  }, [exercises]);

  const handleExerciseComplete = useCallback(async (exerciseId: string) => {
    console.log('🎯 ExerciseList - Exercise completed:', exerciseId);
    await onExerciseComplete(exerciseId);
    
    if (activeExerciseId === exerciseId) {
      setActiveExerciseId(null);
    }
  }, [onExerciseComplete, activeExerciseId]);

  const handleExerciseProgressUpdate = useCallback(async (
    exerciseId: string, 
    sets: number, 
    reps: string, 
    notes?: string, 
    weight?: number
  ) => {
    console.log('📊 ExerciseList - Progress updated:', { exerciseId, sets, reps, notes, weight });
    await onExerciseProgressUpdate(exerciseId, sets, reps, notes, weight);
  }, [onExerciseProgressUpdate]);

  const handleSetActive = useCallback((exerciseId: string) => {
    setActiveExerciseId(current => current === exerciseId ? null : exerciseId);
  }, []);

  const handleSessionComplete = useCallback(() => {
    console.log('🏆 Workout session completed!');
    setActiveExerciseId(null);
  }, []);

  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    }
  }, [onRetry]);

  if (error) {
    return (
      <ExerciseErrorHandler
        error={error}
        onRetry={handleRetry}
        context="exercise list"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading exercises...</p>
        </div>
      </div>
    );
  }

  if (isRestDay) {
    return <RestDayCard />;
  }

  if (!exercises || exercises.length === 0) {
    return (
      <ExerciseEmptyState
        dailyWorkoutId={dailyWorkoutId}
        onAddCustomExercise={() => setShowCustomExerciseDialog(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ExerciseListHeader
        completedCount={completedCount}
        totalCount={totalCount}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        dailyWorkoutId={dailyWorkoutId}
        onAddCustomExercise={() => setShowCustomExerciseDialog(true)}
      />

      {viewMode === 'session' ? (
        <ExerciseSessionView
          exercises={exercises}
          activeExerciseId={activeExerciseId}
          onExerciseComplete={handleExerciseComplete}
          onExerciseProgressUpdate={handleExerciseProgressUpdate}
          onSessionComplete={handleSessionComplete}
          onSetActive={handleSetActive}
          onDeactivate={() => setActiveExerciseId(null)}
        />
      ) : (
        <ExerciseListView
          exercises={exercises}
          onExerciseComplete={handleExerciseComplete}
        />
      )}

      <CustomExerciseDialog
        open={showCustomExerciseDialog}
        onOpenChange={setShowCustomExerciseDialog}
        dailyWorkoutId={dailyWorkoutId}
        onExerciseCreated={() => {
          window.location.reload();
        }}
      />
    </div>
  );
};

export default ExerciseList;
