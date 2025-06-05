
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Exercise } from "@/types/exercise";
import { ExerciseProgressCard } from "./ExerciseProgressCard";
import { WorkoutSessionManager } from "./WorkoutSessionManager";
import { RestDayCard } from "./RestDayCard";
import { ExerciseErrorHandler } from "./ExerciseErrorHandler";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Timer, List } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { CustomExerciseDialog } from "./CustomExerciseDialog";

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
  const { t } = useLanguage();
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
    console.log('🎯 ExerciseListEnhanced - Exercise completed:', exerciseId);
    await onExerciseComplete(exerciseId);
  }, [onExerciseComplete]);

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

  const handleSessionComplete = useCallback(() => {
    console.log('🏆 Workout session completed!');
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
          <p className="text-gray-600">{t('Loading exercises...')}</p>
        </div>
      </div>
    );
  }

  if (isRestDay) {
    return <RestDayCard />;
  }

  if (!exercises || exercises.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Timer className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('No exercises for today')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('Add some exercises to get started with your workout')}
          </p>
          
          {dailyWorkoutId && (
            <Button
              onClick={() => setShowCustomExerciseDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t('Add Custom Exercise')}
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t('Today\'s Workout')}</h2>
          <p className="text-sm text-gray-600">
            {completedCount}/{totalCount} {t('exercises completed')}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {dailyWorkoutId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomExerciseDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t('Add Exercise')}
            </Button>
          )}
          
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'session' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('session')}
              className="text-xs h-8"
            >
              <Timer className="w-3 h-3 mr-1" />
              {t('Session')}
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="text-xs h-8"
            >
              <List className="w-3 h-3 mr-1" />
              {t('List')}
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'session' && (
        <div className="space-y-4">
          <WorkoutSessionManager
            exercises={exercises}
            onExerciseComplete={() => {}}
            onExerciseProgressUpdate={() => {}}
            onSessionComplete={handleSessionComplete}
          />
          
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <ExerciseProgressCard
                key={exercise.id}
                exercise={exercise}
                onComplete={handleExerciseComplete}
                onProgressUpdate={handleExerciseProgressUpdate}
                isActive={activeExerciseId === exercise.id}
                onSetActive={() => setActiveExerciseId(
                  activeExerciseId === exercise.id ? null : exercise.id
                )}
              />
            ))}
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="space-y-3">
          {exercises.map((exercise, index) => (
            <Card key={exercise.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    exercise.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                    <div className="text-sm text-gray-600">
                      {exercise.sets} {t('sets')} × {exercise.reps} {t('reps')}
                      {exercise.equipment && (
                        <span className="ml-2 text-blue-600">• {exercise.equipment}</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant={exercise.completed ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleExerciseComplete(exercise.id)}
                  className={exercise.completed ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {exercise.completed ? t('Completed') : t('Mark Complete')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
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
