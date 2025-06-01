import React, { useState, useEffect } from 'react';
import { useI18n } from "@/hooks/useI18n";
import { useSearchParams } from 'react-router-dom';
import { format, startOfWeek } from 'date-fns';
import { ExerciseProgramLoadingStates } from './ExerciseProgramLoadingStates';
import ExerciseProgramDaySelector from './ExerciseProgramDaySelector';
import { ExerciseListEnhanced } from './ExerciseListEnhanced';
import { ExerciseProgramActions } from './ExerciseProgramActions';
import { ExerciseProgramEmptyState } from './ExerciseProgramEmptyState';
import { ExerciseProgramErrorState } from './ExerciseProgramErrorState';
import { WorkoutTypeSelector } from './WorkoutTypeSelector';
import { useExerciseProgram } from '@/hooks/useExerciseProgram';
import { ExerciseProgressDialog } from './ExerciseProgressDialog';
import { WeeklyProgramOverview } from './WeeklyProgramOverview';
import { WorkoutSummaryCard } from './WorkoutSummaryCard';
import { ExerciseProgressTracker } from './ExerciseProgressTracker';

const ExercisePageRefactored = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useI18n();

  const initialWorkoutType = (searchParams.get('type') === 'gym' || searchParams.get('type') === 'home') ? searchParams.get('type') as "home" | "gym" : "home";
  const initialSelectedDay = searchParams.get('day') ? parseInt(searchParams.get('day') || '1', 10) : 6;
  const initialWeekStart = searchParams.get('weekStart') ? new Date(searchParams.get('weekStart') as string) : startOfWeek(new Date(), { weekStartsOn: 6 });

  const [workoutType, setWorkoutType] = useState<"home" | "gym">(initialWorkoutType);
  const [selectedDay, setSelectedDay] = useState<number>(initialSelectedDay);
  const [weekStartDate, setWeekStartDate] = useState<Date>(initialWeekStart);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [exerciseProgressOpen, setExerciseProgressOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('type', workoutType);
    params.set('day', selectedDay.toString());
    params.set('weekStart', format(weekStartDate, 'yyyy-MM-dd'));
    setSearchParams(params);
  }, [workoutType, selectedDay, weekStartDate, setSearchParams]);

  const {
    currentProgram,
    currentWorkout,
    exercises,
    isLoading,
    isGenerating,
    error,
    generateExerciseProgram,
    regenerateExerciseProgram,
    updateExerciseCompletion,
    updateExerciseProgress
  } = useExerciseProgram(workoutType, selectedDay, weekStartDate);

  const handleShowAIDialog = () => setIsAIDialogOpen(true);
  const handleCloseAIDialog = () => setIsAIDialogOpen(false);

  const handleRegenerateProgram = () => {
    regenerateExerciseProgram();
  };

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
  };

  const handlePreviousWeek = () => {
    setWeekStartDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setWeekStartDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  const handleCurrentWeek = () => {
    setWeekStartDate(startOfWeek(new Date(), { weekStartsOn: 6 }));
  };

  const handleExerciseComplete = async (exerciseId: string) => {
    await updateExerciseCompletion(exerciseId);
  };

  const handleExerciseProgressUpdate = (exerciseId: string, sets: number, reps: string, notes?: string) => {
    updateExerciseProgress(exerciseId, sets, reps, notes);
    setExerciseProgressOpen(false);
  };

  const handleOpenExerciseProgress = (exercise: any) => {
    setSelectedExercise(exercise);
    setExerciseProgressOpen(true);
  };

  const completedExercises = exercises.filter(ex => ex.completed).length;
  const totalExercises = exercises.length;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
  const isRestDay = exercises.length === 0;

  if (error) {
    return <ExerciseProgramErrorState onRetry={regenerateExerciseProgram} />;
  }

  return (
    <div className="p-6">
      <ExerciseProgramLoadingStates isLoading={isLoading} isGenerating={isGenerating} />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {t('exercise.title')}
            </h1>
            <p className="text-gray-600">
              {t('exercise.workoutFor')} {format(new Date(), 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex gap-2">
            <WorkoutTypeSelector workoutType={workoutType} setWorkoutType={setWorkoutType} />
          </div>
        </div>

        {/* Week Navigation */}
        <WeeklyProgramOverview
          currentProgram={currentProgram}
          selectedDay={selectedDay}
          onDaySelect={handleDaySelect}
          workoutType={workoutType}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stats Card */}
          <div className="lg:col-span-1 space-y-4">
            <ExerciseProgressTracker
              currentProgram={currentProgram}
              selectedDay={selectedDay}
              currentWeekOffset={0}
              completedExercises={completedExercises}
              totalExercises={totalExercises}
            />
            <WorkoutSummaryCard
              currentWorkout={currentWorkout}
              currentProgram={currentProgram}
              completedExercises={completedExercises}
              totalExercises={totalExercises}
              progressPercentage={progressPercentage}
              workoutType={workoutType}
            />
          </div>

          {/* Exercise List */}
          {currentProgram ? (
            <ExerciseListEnhanced
              exercises={exercises}
              isLoading={isLoading}
              onExerciseComplete={(exerciseId) => {
                handleExerciseComplete(exerciseId);
              }}
              onExerciseProgressUpdate={handleExerciseProgressUpdate}
              isRestDay={isRestDay}
            />
          ) : (
            <ExerciseProgramEmptyState
              workoutType={workoutType}
              onGenerateClick={handleShowAIDialog}
            />
          )}
        </div>
      </div>

      {selectedExercise && (
        <ExerciseProgressDialog
          open={exerciseProgressOpen}
          onOpenChange={setExerciseProgressOpen}
          exercise={selectedExercise}
          onSave={handleExerciseProgressUpdate}
        />
      )}
    </div>
  );
};

export default ExercisePageRefactored;
