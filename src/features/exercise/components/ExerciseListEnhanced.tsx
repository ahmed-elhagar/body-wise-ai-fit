
import { Loader2 } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { Exercise } from "../types";
import { RestDayCard } from "./RestDayCard";
import { ExerciseErrorHandler } from "./ExerciseErrorHandler";
import { ExerciseEmptyState } from "./ExerciseEmptyState";
import { ExerciseSessionView } from "./ExerciseSessionView";
import { ExerciseListView } from "./ExerciseListView";
import { ExerciseListHeader } from "./ExerciseListHeader";
import { useState, useCallback, useMemo } from "react";

interface ExerciseListEnhancedProps {
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

export const ExerciseListEnhanced = ({
  exercises,
  isLoading,
  onExerciseComplete,
  onExerciseProgressUpdate,
  isRestDay = false,
  currentProgram,
  selectedDayNumber = 1,
  error,
  onRetry
}: ExerciseListEnhancedProps) => {
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState<'session' | 'list'>('session');
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
    console.log('🎯 ExerciseListEnhanced - Exercise completed:', exerciseId);
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
    console.log('📊 ExerciseListEnhanced - Progress updated:', { exerciseId, sets, reps, notes, weight });
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
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-fitness-primary-500 to-fitness-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <h3 className="text-lg font-semibold text-fitness-primary-800 mb-2">Loading Exercises</h3>
          <p className="text-fitness-primary-600">Preparing your workout...</p>
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
        onGenerateProgram={() => console.log('Generate program')}
        workoutType={currentProgram?.workout_type || "home"}
        dailyWorkoutId={dailyWorkoutId}
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
    </div>
  );
};
