
import { useState, useMemo, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useExerciseProgramData } from './useExerciseProgramData';
import { useAIExerciseProgram } from './useAIExerciseProgram';
import { addDays, startOfWeek, format } from 'date-fns';

export interface ExercisePreferences {
  workoutType: "home" | "gym";
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  fitnessGoals: string[];
  availableEquipment: string[];
  timePerWorkout: number;
  workoutsPerWeek: number;
  focusAreas: string[];
}

export const useOptimizedExerciseProgramPage = () => {
  const { t } = useLanguage();
  const [selectedDayNumber, setSelectedDayNumber] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return dayOfWeek === 0 ? 7 : dayOfWeek;
  });
  
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [workoutType, setWorkoutType] = useState<"home" | "gym">("home");
  const [showAIDialog, setShowAIDialog] = useState(false);
  
  const [aiPreferences, setAiPreferences] = useState<ExercisePreferences>({
    workoutType: "home",
    difficultyLevel: "beginner",
    fitnessGoals: [],
    availableEquipment: [],
    timePerWorkout: 30,
    workoutsPerWeek: 3,
    focusAreas: []
  });

  // Enhanced date calculations
  const currentDate = useMemo(() => new Date(), []);
  const weekStartDate = useMemo(() => {
    return addDays(startOfWeek(currentDate), currentWeekOffset * 7);
  }, [currentDate, currentWeekOffset]);

  // Core data hooks
  const { 
    currentProgram, 
    isLoading, 
    error, 
    refetch,
    completeExercise,
    updateExerciseProgress
  } = useExerciseProgramData(currentWeekOffset, workoutType);

  const { generateProgram, isGenerating } = useAIExerciseProgram();

  // Enhanced calculations
  const { todaysWorkouts, todaysExercises, completedExercises, totalExercises, progressPercentage, isRestDay } = useMemo(() => {
    if (!currentProgram?.daily_workouts) {
      return {
        todaysWorkouts: [],
        todaysExercises: [],
        completedExercises: 0,
        totalExercises: 0,
        progressPercentage: 0,
        isRestDay: false
      };
    }

    const todaysWorkouts = currentProgram.daily_workouts.filter(
      workout => workout.day_number === selectedDayNumber
    );

    const todaysExercises = todaysWorkouts.flatMap(workout => workout.exercises || []);
    const completedCount = todaysExercises.filter(ex => ex.completed).length;
    const totalCount = todaysExercises.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const isRest = todaysWorkouts.length === 0 || todaysWorkouts.every(w => w.workout_name?.toLowerCase().includes('rest'));

    return {
      todaysWorkouts,
      todaysExercises,
      completedExercises: completedCount,
      totalExercises: totalCount,
      progressPercentage: progress,
      isRestDay: isRest
    };
  }, [currentProgram, selectedDayNumber]);

  // Enhanced handlers
  const handleGenerateAIProgram = useCallback(async (preferences: ExercisePreferences) => {
    try {
      console.log('🚀 Generating AI exercise program with preferences:', preferences);
      const result = await generateProgram(preferences, { weekOffset: currentWeekOffset });
      
      if (result?.success) {
        setShowAIDialog(false);
        await refetch();
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Failed to generate exercise program:', error);
      return false;
    }
  }, [generateProgram, currentWeekOffset, refetch]);

  const handleRegenerateProgram = useCallback(async () => {
    return await handleGenerateAIProgram(aiPreferences);
  }, [handleGenerateAIProgram, aiPreferences]);

  const handleExerciseComplete = useCallback(async (exerciseId: string) => {
    try {
      await completeExercise(exerciseId);
      console.log('✅ Exercise completed:', exerciseId);
    } catch (error) {
      console.error('❌ Failed to complete exercise:', error);
    }
  }, [completeExercise]);

  const handleExerciseProgressUpdate = useCallback(async (
    exerciseId: string, 
    sets: number, 
    reps: string, 
    notes?: string
  ) => {
    try {
      await updateExerciseProgress(exerciseId, sets, reps, notes);
      console.log('📊 Exercise progress updated:', { exerciseId, sets, reps });
    } catch (error) {
      console.error('❌ Failed to update exercise progress:', error);
    }
  }, [updateExerciseProgress]);

  return {
    // State
    selectedDayNumber,
    setSelectedDayNumber,
    currentWeekOffset,
    setCurrentWeekOffset,
    workoutType,
    setWorkoutType,
    showAIDialog,
    setShowAIDialog,
    aiPreferences,
    setAiPreferences,
    
    // Data
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
    
    // Actions
    handleGenerateAIProgram,
    handleRegenerateProgram,
    handleExerciseComplete,
    handleExerciseProgressUpdate,
    refetch
  };
};
