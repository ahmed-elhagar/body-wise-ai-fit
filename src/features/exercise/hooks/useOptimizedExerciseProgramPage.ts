
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { startOfWeek, addWeeks } from 'date-fns';

export const useOptimizedExerciseProgramPage = () => {
  const { user } = useAuth();
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [workoutType, setWorkoutType] = useState<"home" | "gym">("home");
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPreferences, setAiPreferences] = useState({});

  const currentDate = new Date();
  const weekStartDate = addWeeks(startOfWeek(currentDate, { weekStartsOn: 1 }), currentWeekOffset);

  const { data: currentProgram, isLoading, error, refetch } = useQuery({
    queryKey: ['exercise-program', user?.id, currentWeekOffset],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('weekly_exercise_programs')
        .select(`
          *,
          daily_workouts (
            *,
            exercises (*)
          )
        `)
        .eq('user_id', user.id)
        .eq('week_start_date', weekStartDate.toISOString().split('T')[0])
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const todaysExercises = currentProgram?.daily_workouts
    ?.find((workout: any) => workout.day_number === selectedDayNumber)
    ?.exercises || [];

  const completedExercises = todaysExercises.filter((ex: any) => ex.is_completed).length;
  const totalExercises = todaysExercises.length;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
  const isRestDay = currentProgram?.daily_workouts
    ?.find((workout: any) => workout.day_number === selectedDayNumber)
    ?.is_rest_day || false;

  const handleExerciseComplete = async (exerciseId: string) => {
    console.log('Exercise completed:', exerciseId);
    refetch();
  };

  const handleExerciseProgressUpdate = async (
    exerciseId: string,
    sets: number,
    reps: string,
    notes?: string,
    weight?: number
  ) => {
    console.log('Exercise progress updated:', { exerciseId, sets, reps, notes, weight });
    refetch();
  };

  return {
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
    currentProgram,
    isLoading,
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    isRestDay,
    error,
    currentDate,
    weekStartDate,
    handleExerciseComplete,
    handleExerciseProgressUpdate,
    refetch
  };
};
