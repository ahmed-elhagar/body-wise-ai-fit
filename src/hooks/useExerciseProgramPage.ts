
import { useState, useMemo } from 'react';
import { useExerciseProgramData } from './useExerciseProgramData';
import { useAIExercise } from './useAIExercise';
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

export type { ExerciseProgram } from './useExerciseProgramData';

export const useExerciseProgramPage = () => {
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

  // Use the updated hook with proper week and workout type filtering
  const { currentProgram, isLoading, error, refetch, completeExercise, updateExerciseProgress } = 
    useExerciseProgramData(currentWeekOffset, workoutType);
  const { generateExerciseProgram, isGenerating } = useAIExercise();

  const currentDate = new Date();
  const weekStartDate = addDays(startOfWeek(currentDate), currentWeekOffset * 7);

  // Get today's workouts based on selected day
  const todaysWorkouts = useMemo(() => {
    if (!currentProgram?.daily_workouts) return [];
    const dayWorkouts = currentProgram.daily_workouts.filter(
      workout => workout.day_number === selectedDayNumber
    );
    console.log('🎯 Today\'s workouts for day', selectedDayNumber, ':', dayWorkouts);
    return dayWorkouts;
  }, [currentProgram, selectedDayNumber]);

  // Get today's exercises
  const todaysExercises = useMemo(() => {
    if (!todaysWorkouts.length) return [];
    return todaysWorkouts.flatMap(workout => workout.exercises || []);
  }, [todaysWorkouts]);

  // Check if today is a rest day
  const isRestDay = useMemo(() => {
    return todaysWorkouts.length > 0 && todaysWorkouts[0]?.is_rest_day;
  }, [todaysWorkouts]);

  // Calculate progress
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

  const handleGenerateAIProgram = (preferences: ExercisePreferences) => {
    const weekStartDateString = format(weekStartDate, 'yyyy-MM-dd');
    
    console.log('🤖 Generating AI exercise program with preferences:', {
      ...preferences,
      weekOffset: currentWeekOffset,
      weekStartDate: weekStartDateString
    });
    
    // Pass week information to AI generation with exact week date
    const enhancedPreferences = {
      ...preferences,
      weekStartDate: weekStartDateString,
      weekOffset: currentWeekOffset
    };
    
    generateExerciseProgram(enhancedPreferences);
    setShowAIDialog(false);
  };

  const handleRegenerateProgram = () => {
    const weekStartDateString = format(weekStartDate, 'yyyy-MM-dd');
    
    const preferences = {
      ...aiPreferences,
      workoutType: workoutType,
      weekStartDate: weekStartDateString,
      weekOffset: currentWeekOffset
    };
    
    console.log('🔄 Regenerating program for:', {
      workoutType,
      weekStartDate: weekStartDateString,
      weekOffset: currentWeekOffset
    });
    
    handleGenerateAIProgram(preferences);
  };

  const handleWorkoutTypeChange = (type: "home" | "gym") => {
    console.log('🔄 Changing workout type to:', type);
    setWorkoutType(type);
    setAiPreferences(prev => ({
      ...prev,
      workoutType: type,
      equipment: type === "gym" 
        ? ["barbells", "dumbbells", "machines", "cables"]
        : ["bodyweight", "resistance_bands", "light_dumbbells"]
    }));
  };

  const handleExerciseComplete = async (exerciseId: string) => {
    try {
      await completeExercise(exerciseId);
    } catch (error) {
      console.error('Error completing exercise:', error);
    }
  };

  const handleExerciseProgressUpdate = async (exerciseId: string, sets: number, reps: string, notes?: string) => {
    try {
      await updateExerciseProgress(exerciseId, sets, reps, notes);
    } catch (error) {
      console.error('Error updating exercise progress:', error);
    }
  };

  return {
    // State
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
    
    // Computed
    currentDate,
    weekStartDate,
    
    // Handlers
    handleGenerateAIProgram,
    handleRegenerateProgram,
    handleWorkoutTypeChange,
    handleExerciseComplete,
    handleExerciseProgressUpdate,
    refetch
  };
};
