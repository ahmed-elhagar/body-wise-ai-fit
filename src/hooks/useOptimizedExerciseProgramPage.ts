
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
  const [selectedDayNumber, setSelectedDayNumber] = useState(new Date().getDay() || 7);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [workoutType, setWorkoutType] = useState<"home" | "gym">("home");
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [isWeekChanging, setIsWeekChanging] = useState(false);
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

  const { currentProgram, isLoading: dataLoading, error, refetch, completeExercise, updateExerciseProgress } = 
    useExerciseProgramData(currentWeekOffset, workoutType);
  
  const { executeAIAction, isLoading: isGenerating } = useRateLimitedAI();

  // Combined loading state for better UX
  const isLoading = dataLoading || isWeekChanging;

  const currentDate = useMemo(() => new Date(), []);
  const weekStartDate = useMemo(() => 
    addDays(startOfWeek(currentDate), currentWeekOffset * 7), 
    [currentDate, currentWeekOffset]
  );

  const todaysWorkouts = useMemo(() => {
    if (!currentProgram?.daily_workouts) return [];
    return currentProgram.daily_workouts.filter(
      workout => workout.day_number === selectedDayNumber
    );
  }, [currentProgram, selectedDayNumber]);

  const todaysExercises = useMemo(() => {
    if (!todaysWorkouts.length) return [];
    return todaysWorkouts.flatMap(workout => workout.exercises || []);
  }, [todaysWorkouts]);

  const isRestDay = useMemo(() => {
    return todaysWorkouts.length > 0 && todaysWorkouts[0]?.is_rest_day;
  }, [todaysWorkouts]);

  const { completedExercises, totalExercises, progressPercentage } = useMemo(() => {
    const completed = todaysExercises.filter(ex => ex.completed).length;
    const total = todaysExercises.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      completedExercises: completed,
      totalExercises: total,
      progressPercentage: percentage
    };
  }, [todaysExercises]);

  const handleGenerateAIProgram = useCallback(async (preferences: ExercisePreferences) => {
    const weekStartDateString = format(weekStartDate, 'yyyy-MM-dd');
    
    const enhancedPreferences = {
      ...preferences,
      weekStartDate: weekStartDateString,
      weekOffset: currentWeekOffset
    };
    
    console.log('🎯 Generating AI program with preferences:', enhancedPreferences);
    
    await executeAIAction('generate-exercise-program', enhancedPreferences);
    setShowAIDialog(false);
    refetch();
  }, [weekStartDate, currentWeekOffset, executeAIAction, refetch]);

  const handleRegenerateProgram = useCallback(async () => {
    const weekStartDateString = format(weekStartDate, 'yyyy-MM-dd');
    
    const preferences = {
      ...aiPreferences,
      workoutType: workoutType,
      weekStartDate: weekStartDateString,
      weekOffset: currentWeekOffset
    };
    
    console.log('🔄 Regenerating program with preferences:', preferences);
    
    await handleGenerateAIProgram(preferences);
  }, [weekStartDate, aiPreferences, workoutType, currentWeekOffset, handleGenerateAIProgram]);

  const handleWorkoutTypeChange = useCallback((type: "home" | "gym") => {
    console.log('🏋️ Changing workout type to:', type);
    setWorkoutType(type);
    setAiPreferences(prev => ({
      ...prev,
      workoutType: type,
      equipment: type === "gym" 
        ? ["barbells", "dumbbells", "machines", "cables"]
        : ["bodyweight", "resistance_bands", "light_dumbbells"]
    }));
  }, []);

  const handleWeekChange = useCallback(async (newOffset: number) => {
    console.log('📅 Changing week offset from', currentWeekOffset, 'to', newOffset);
    setIsWeekChanging(true);
    setCurrentWeekOffset(newOffset);
    
    // Give time for the data to load
    setTimeout(() => {
      setIsWeekChanging(false);
    }, 500);
  }, [currentWeekOffset]);

  const handleExerciseComplete = useCallback(async (exerciseId: string) => {
    try {
      console.log('✅ Completing exercise:', exerciseId);
      await completeExercise(exerciseId);
    } catch (error) {
      console.error('❌ Error completing exercise:', error);
    }
  }, [completeExercise]);

  const handleExerciseProgressUpdate = useCallback(async (
    exerciseId: string, 
    sets: number, 
    reps: string, 
    notes?: string
  ) => {
    try {
      console.log('📊 Updating exercise progress:', { exerciseId, sets, reps, notes });
      await updateExerciseProgress(exerciseId, sets, reps, notes);
    } catch (error) {
      console.error('❌ Error updating exercise progress:', error);
    }
  }, [updateExerciseProgress]);

  return {
    selectedDayNumber,
    setSelectedDayNumber,
    currentWeekOffset,
    setCurrentWeekOffset: handleWeekChange,
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
