
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

export const useExerciseProgramPage = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
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

  const { currentProgram, isLoading, error, refetch } = useExerciseProgramData(currentWeekOffset);
  const { generateExerciseProgram, isGenerating } = useAIExercise();

  // Calculate week dates
  const weekStartDate = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    return addDays(weekStart, currentWeekOffset * 7);
  }, [currentWeekOffset]);

  const currentDate = new Date();
  const currentDay = format(currentDate, 'EEEE');

  // Get today's workouts
  const todaysWorkouts = useMemo(() => {
    if (!currentProgram?.daily_workouts) return [];
    return currentProgram.daily_workouts.filter(
      workout => workout.day_number === selectedDayNumber
    );
  }, [currentProgram, selectedDayNumber]);

  // Get today's exercises
  const todaysExercises = useMemo(() => {
    if (!todaysWorkouts.length) return [];
    return todaysWorkouts.flatMap(workout => workout.exercises || []);
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
    console.log('Generating AI exercise program with preferences:', preferences);
    generateExerciseProgram(preferences);
    setShowAIDialog(false);
  };

  const handleRegenerateProgram = () => {
    const preferences = {
      ...aiPreferences,
      workoutType: currentProgram?.workout_type || workoutType
    };
    handleGenerateAIProgram(preferences);
  };

  return {
    // State
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
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
    weekStartDate,
    todaysWorkouts,
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    error,
    
    // Computed
    currentDate,
    currentDay,
    
    // Handlers
    handleGenerateAIProgram,
    handleRegenerateProgram,
    refetch
  };
};
