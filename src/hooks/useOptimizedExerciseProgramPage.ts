
import { useState, useMemo, useCallback } from 'react';
import { useExerciseProgramData } from './useExerciseProgramData';
import { useRateLimitedAI } from './useRateLimitedAI';
import { addDays, format, startOfWeek } from 'date-fns';

export interface ExercisePreferences {
  workoutType: "home" | "gym";
  goalType: string;
  fitnessLevel: string;
  availableTime: string;
  preferredWorkouts: string[];
  targetMuscleGroups: string[];
  equipment: string[];
  duration: string;
  workoutDays: string;
  difficulty: string;
}

export const useOptimizedExerciseProgramPage = () => {
  console.log('🎯 [useOptimizedExerciseProgramPage] Hook initialized');
  
  const [selectedDayNumber, setSelectedDayNumber] = useState(new Date().getDay() || 7);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [workoutType, setWorkoutType] = useState<"home" | "gym">("home");
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPreferences, setAiPreferences] = useState<ExercisePreferences>({
    workoutType: "home",
    goalType: "general_fitness",
    fitnessLevel: "beginner",
    availableTime: "45",
    preferredWorkouts: ["bodyweight", "cardio"],
    targetMuscleGroups: ["full_body"],
    equipment: ["bodyweight", "resistance_bands", "light_dumbbells"],
    duration: "4",
    workoutDays: "4-5 days per week",
    difficulty: "beginner"
  });

  console.log('📊 [useOptimizedExerciseProgramPage] Current state:', {
    selectedDayNumber,
    currentWeekOffset,
    workoutType,
    showAIDialog
  });

  const { currentProgram, isLoading, error, refetch, completeExercise, updateExerciseProgress } = 
    useExerciseProgramData(currentWeekOffset, workoutType);
  
  const { executeAIAction, isLoading: isGenerating } = useRateLimitedAI();

  console.log('🔄 [useOptimizedExerciseProgramPage] Data status:', {
    hasProgram: !!currentProgram,
    isLoading,
    hasError: !!error,
    isGenerating
  });

  const currentDate = useMemo(() => new Date(), []);
  const weekStartDate = useMemo(() => {
    const date = addDays(startOfWeek(currentDate), currentWeekOffset * 7);
    console.log('📅 [useOptimizedExerciseProgramPage] Week start date calculated:', format(date, 'yyyy-MM-dd'));
    return date;
  }, [currentDate, currentWeekOffset]);

  const todaysWorkouts = useMemo(() => {
    if (!currentProgram?.daily_workouts) {
      console.log('🚫 [useOptimizedExerciseProgramPage] No daily workouts available');
      return [];
    }
    const workouts = currentProgram.daily_workouts.filter(
      workout => workout.day_number === selectedDayNumber
    );
    console.log('🏋️ [useOptimizedExerciseProgramPage] Today\'s workouts:', workouts.length);
    return workouts;
  }, [currentProgram, selectedDayNumber]);

  const todaysExercises = useMemo(() => {
    if (!todaysWorkouts.length) {
      console.log('🚫 [useOptimizedExerciseProgramPage] No exercises for today');
      return [];
    }
    const exercises = todaysWorkouts.flatMap(workout => workout.exercises || []);
    console.log('💪 [useOptimizedExerciseProgramPage] Today\'s exercises:', exercises.length);
    return exercises;
  }, [todaysWorkouts]);

  const isRestDay = useMemo(() => {
    const restDay = todaysWorkouts.length > 0 && todaysWorkouts[0]?.is_rest_day;
    console.log('😴 [useOptimizedExerciseProgramPage] Is rest day:', restDay);
    return restDay;
  }, [todaysWorkouts]);

  const { completedExercises, totalExercises, progressPercentage } = useMemo(() => {
    const completed = todaysExercises.filter(ex => ex.completed).length;
    const total = todaysExercises.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    console.log('📈 [useOptimizedExerciseProgramPage] Progress:', {
      completed,
      total,
      percentage: Math.round(percentage)
    });
    
    return {
      completedExercises: completed,
      totalExercises: total,
      progressPercentage: percentage
    };
  }, [todaysExercises]);

  const handleGenerateAIProgram = useCallback(async (preferences: ExercisePreferences) => {
    console.log('🎯 [useOptimizedExerciseProgramPage] Generate AI program called with:', preferences);
    
    const weekStartDateString = format(weekStartDate, 'yyyy-MM-dd');
    
    const enhancedPreferences = {
      ...preferences,
      weekStartDate: weekStartDateString,
      weekOffset: currentWeekOffset
    };
    
    console.log('🚀 [useOptimizedExerciseProgramPage] Executing AI action with enhanced preferences');
    await executeAIAction('generate-exercise-program', enhancedPreferences);
    setShowAIDialog(false);
    console.log('🔄 [useOptimizedExerciseProgramPage] Refetching data after generation');
    refetch();
  }, [weekStartDate, currentWeekOffset, executeAIAction, refetch]);

  const handleRegenerateProgram = useCallback(async () => {
    console.log('🔄 [useOptimizedExerciseProgramPage] Regenerate program called');
    
    const weekStartDateString = format(weekStartDate, 'yyyy-MM-dd');
    
    const preferences = {
      ...aiPreferences,
      workoutType: workoutType,
      weekStartDate: weekStartDateString,
      weekOffset: currentWeekOffset
    };
    
    console.log('🚀 [useOptimizedExerciseProgramPage] Regenerating with preferences:', preferences);
    await handleGenerateAIProgram(preferences);
  }, [weekStartDate, aiPreferences, workoutType, currentWeekOffset, handleGenerateAIProgram]);

  const handleWorkoutTypeChange = useCallback((type: "home" | "gym") => {
    console.log('🏠/🏋️ [useOptimizedExerciseProgramPage] Workout type changed to:', type);
    setWorkoutType(type);
    setAiPreferences(prev => ({
      ...prev,
      workoutType: type,
      equipment: type === "gym" 
        ? ["barbells", "dumbbells", "machines", "cables"]
        : ["bodyweight", "resistance_bands", "light_dumbbells"]
    }));
  }, []);

  const handleExerciseComplete = useCallback(async (exerciseId: string) => {
    console.log('✅ [useOptimizedExerciseProgramPage] Completing exercise:', exerciseId);
    try {
      await completeExercise(exerciseId);
      console.log('✅ [useOptimizedExerciseProgramPage] Exercise completed successfully');
    } catch (error) {
      console.error('❌ [useOptimizedExerciseProgramPage] Error completing exercise:', error);
    }
  }, [completeExercise]);

  const handleExerciseProgressUpdate = useCallback(async (
    exerciseId: string, 
    sets: number, 
    reps: string, 
    notes?: string
  ) => {
    console.log('📊 [useOptimizedExerciseProgramPage] Updating exercise progress:', {
      exerciseId,
      sets,
      reps,
      notes
    });
    try {
      await updateExerciseProgress(exerciseId, sets, reps, notes);
      console.log('✅ [useOptimizedExerciseProgramPage] Exercise progress updated successfully');
    } catch (error) {
      console.error('❌ [useOptimizedExerciseProgramPage] Error updating exercise progress:', error);
    }
  }, [updateExerciseProgress]);

  console.log('🎯 [useOptimizedExerciseProgramPage] Hook returning data');

  return {
    selectedDayNumber,
    setSelectedDayNumber,
    currentWeekOffset,
    setCurrentWeekOffset,
    workoutType,
    setWorkoutType: handleWorkoutTypeChange,
    showAIDialog,
    setShowAIDialog,
    aiPreferences,
    setAiPreferences,
    currentProgram,
    isLoading,
    isGenerating,
    todaysWorkouts,
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    isRestDay,
    error,
    currentDate,
    weekStartDate,
    handleGenerateAIProgram,
    handleRegenerateProgram,
    handleExerciseComplete,
    handleExerciseProgressUpdate,
    refetch
  };
};
