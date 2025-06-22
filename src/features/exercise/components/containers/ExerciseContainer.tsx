
import React, { useState, useEffect } from 'react';
import { useExerciseProgram } from '../../hooks/core/useExerciseProgram';
import { useWorkoutSession } from '../../hooks/core/useWorkoutSession';
import { ExerciseLayout } from '../ExerciseLayout';
import { useProfile } from '@/features/ai/hooks/useProfile';
import { useCentralizedCredits } from '@/shared/hooks/useCentralizedCredits';
import type { ExerciseProgram, Exercise } from '../../types';

interface ExerciseContainerProps {
  className?: string;
}

export const ExerciseContainer: React.FC<ExerciseContainerProps> = ({ className }) => {
  const { profile, isLoading: profileLoading } = useProfile();
  const { credits } = useCentralizedCredits();
  
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [workoutType, setWorkoutType] = useState<"home" | "gym">("home");
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const {
    currentProgram,
    todaysExercises,
    isLoading: programLoading,
    error: programError,
    refetch: refetchProgram
  } = useExerciseProgram(selectedDayNumber, currentWeekOffset);

  const {
    completeExercise,
    updateExerciseProgress,
    isUpdating
  } = useWorkoutSession();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleDaySelect = (dayNumber: number) => {
    setSelectedDayNumber(dayNumber);
  };

  const handleWeekOffsetChange = (offset: number) => {
    setCurrentWeekOffset(offset);
  };

  const handleWorkoutTypeChange = (type: "home" | "gym") => {
    setWorkoutType(type);
  };

  const handleExerciseComplete = async (exerciseId: string) => {
    try {
      await completeExercise(exerciseId);
      await refetchProgram();
    } catch (error) {
      console.error('Failed to complete exercise:', error);
    }
  };

  const handleExerciseProgressUpdate = async (
    exerciseId: string,
    sets: number,
    reps: string,
    notes?: string,
    weight?: number
  ) => {
    try {
      await updateExerciseProgress(exerciseId, {
        sets,
        reps,
        notes,
        weight
      });
      await refetchProgram();
    } catch (error) {
      console.error('Failed to update exercise progress:', error);
    }
  };

  const handleStartWorkout = () => {
    setIsTimerRunning(true);
  };

  const handlePauseWorkout = () => {
    setIsTimerRunning(false);
  };

  const handleShowAIModal = () => {
    // Handle AI modal display
    console.log('Show AI modal');
  };

  const handleRegenerateProgram = async () => {
    try {
      await refetchProgram();
    } catch (error) {
      console.error('Failed to regenerate program:', error);
    }
  };

  // Calculate progress metrics
  const completedExercises = todaysExercises.filter(ex => ex.completed).length;
  const totalExercises = todaysExercises.length;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  // Check if today is a rest day
  const isRestDay = todaysExercises.length === 0;

  // Calculate week start date
  const weekStartDate = new Date();
  weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay() + (currentWeekOffset * 7));

  // Add daily_workouts_count to program if missing
  const enhancedProgram: ExerciseProgram | undefined = currentProgram ? {
    ...currentProgram,
    daily_workouts_count: currentProgram.daily_workouts?.length || 0
  } : undefined;

  const isPro = profile?.role === 'pro' || false;

  return (
    <div className={className}>
      <ExerciseLayout
        isLoading={programLoading || profileLoading}
        currentProgram={enhancedProgram}
        todaysExercises={todaysExercises}
        completedExercises={completedExercises}
        totalExercises={totalExercises}
        progressPercentage={progressPercentage}
        isRestDay={isRestDay}
        selectedDayNumber={selectedDayNumber}
        currentWeekOffset={currentWeekOffset}
        weekStartDate={weekStartDate}
        workoutType={workoutType}
        workoutTimer={workoutTimer}
        isTimerRunning={isTimerRunning}
        creditsRemaining={credits}
        isPro={isPro}
        profile={profile}
        hasProgram={!!currentProgram}
        isGenerating={false}
        onDaySelect={handleDaySelect}
        onWeekOffsetChange={handleWeekOffsetChange}
        onWorkoutTypeChange={handleWorkoutTypeChange}
        onExerciseComplete={handleExerciseComplete}
        onExerciseProgressUpdate={handleExerciseProgressUpdate}
        onStartWorkout={handleStartWorkout}
        onPauseWorkout={handlePauseWorkout}
        onShowAIModal={handleShowAIModal}
        onRegenerateProgram={handleRegenerateProgram}
      />
    </div>
  );
};
