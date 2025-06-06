
import { useState, useEffect } from 'react';
import { useExerciseProgramData } from './useExerciseProgramData';
import { useAuth } from './useAuth';
import { format, startOfWeek, addDays } from 'date-fns';

export interface ExerciseProgram {
  id: string;
  program_name: string;
  difficulty_level: string;
  workout_type: "home" | "gym";
  current_week: number;
  week_start_date: string;
  created_at: string;
  daily_workouts?: DailyWorkout[];
  total_estimated_calories?: number;
  generation_prompt?: any;
}

export interface DailyWorkout {
  id: string;
  day_number: number;
  workout_name: string;
  exercises?: Exercise[];
  is_rest_day?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  completed: boolean;
}

export interface ExercisePreferences {
  workoutType: "home" | "gym";
  difficulty: string;
  duration: number;
  focusAreas: string[];
}

export const useExerciseProgramPage = () => {
  const { user } = useAuth();
  const { exercisePrograms, isLoading, error, refetch } = useExerciseProgramData();
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [workoutType, setWorkoutType] = useState<"home" | "gym">("home");
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPreferences, setAiPreferences] = useState<ExercisePreferences>({
    workoutType: "home",
    difficulty: "beginner",
    duration: 30,
    focusAreas: []
  });

  // Current date and week calculations
  const currentDate = new Date();
  const weekStartDate = addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), currentWeekOffset * 7);

  // Get current program (latest one)
  const currentProgram = exercisePrograms?.[0] || null;

  // Get today's workouts and exercises
  const todaysWorkouts = currentProgram?.daily_workouts?.filter(
    (workout: any) => workout.day_number === selectedDayNumber
  ) || [];

  const todaysExercises = todaysWorkouts.flatMap(
    (workout: any) => workout.exercises || []
  );

  // Check if it's a rest day
  const isRestDay = todaysWorkouts.length === 0 || todaysWorkouts[0]?.is_rest_day || false;

  // Calculate progress
  const completedExercises = todaysExercises.filter(
    (exercise: any) => exercise.completed
  ).length;
  const totalExercises = todaysExercises.length;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  // Exercise completion handlers
  const handleExerciseComplete = async (exerciseId: string, completed: boolean = true) => {
    console.log('Exercise completion:', { exerciseId, completed });
    // TODO: Implement exercise completion logic
  };

  const handleExerciseProgressUpdate = async (
    exerciseId: string, 
    sets: number, 
    reps: string, 
    notes?: string, 
    weight?: number
  ) => {
    console.log('Exercise progress update:', { exerciseId, sets, reps, notes, weight });
    // TODO: Implement progress update logic
  };

  return {
    // Program data
    currentProgram,
    todaysWorkouts,
    todaysExercises,
    
    // Navigation state
    selectedDayNumber,
    setSelectedDayNumber,
    currentWeekOffset,
    setCurrentWeekOffset,
    
    // Workout type
    workoutType,
    setWorkoutType,
    
    // AI Dialog state
    showAIDialog,
    setShowAIDialog,
    aiPreferences,
    setAiPreferences,
    
    // Progress tracking
    completedExercises,
    totalExercises,
    progressPercentage,
    isRestDay,
    
    // Date calculations
    currentDate,
    weekStartDate,
    
    // Loading and error states
    isLoading,
    error,
    refetch,
    
    // Handlers
    handleExerciseComplete,
    handleExerciseProgressUpdate,
  };
};
