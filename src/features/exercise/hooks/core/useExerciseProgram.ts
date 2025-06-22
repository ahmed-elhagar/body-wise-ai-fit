import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, addDays } from 'date-fns';
import { Exercise, ExerciseProgram, DailyWorkout } from '../../types';

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

export const useExerciseProgram = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // State management
  const [selectedDayNumber, setSelectedDayNumber] = useState(() => {
    const today = new Date().getDay();
    return today === 0 ? 7 : today; // Convert Sunday (0) to 7
  });
  const [workoutType, setWorkoutType] = useState<"home" | "gym">("home");
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Calculate week dates
  const weekStartDate = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
    return addDays(weekStart, currentWeekOffset * 7);
  }, [currentWeekOffset]);

  const weekStartDateString = format(weekStartDate, 'yyyy-MM-dd');

  // Fetch user profile for credits and role
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log('🔍 Fetching user profile and subscription:', user.id);
      
      // Get user profile with role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('ai_generations_remaining, role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('❌ Error fetching profile:', profileError);
        return null;
      }

      // Get subscription status
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle();

      const result = {
        ...profileData,
        subscription_status: subscriptionData?.status || null,
        current_period_end: subscriptionData?.current_period_end || null
      };

      console.log('✅ Profile data fetched:', {
        role: result.role,
        ai_generations_remaining: result.ai_generations_remaining,
        subscription_status: result.subscription_status,
        isAdmin: result.role === 'admin',
        isPro: result.subscription_status === 'active' || result.role === 'admin'
      });
      
      return result;
    },
    enabled: !!user?.id,
  });

  // Fetch current exercise program with simplified query
  const { 
    data: currentProgram, 
    isLoading: programLoading, 
    error: programError 
  } = useQuery({
    queryKey: ['exercise-program', user?.id, weekStartDateString],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log('🔍 Fetching exercise program:', { 
        userId: user.id, 
        weekStartDateString,
        currentWeekOffset
      });
      
      // FIXED: Simplified query - removed restrictive workout_type filter
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
        .eq('week_start_date', weekStartDateString)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching exercise program:', error);
        throw error;
      }
      
      console.log('✅ Exercise program fetched:', {
        programFound: !!data,
        programId: data?.id,
        programName: data?.program_name,
        workoutType: data?.workout_type,
        dailyWorkoutsCount: data?.daily_workouts?.length || 0,
        weekStartDate: data?.week_start_date,
        totalExercises: data?.daily_workouts?.reduce((total: number, workout: any) => 
          total + (workout.exercises?.length || 0), 0) || 0
      });
      
      // If we found a program but it doesn't match current workout type, update our state
      if (data && data.workout_type && data.workout_type !== workoutType) {
        console.log('🔄 Updating workout type to match found program:', data.workout_type);
        setWorkoutType(data.workout_type as "home" | "gym");
      }
      
      return data;
    },
    enabled: !!user?.id,
    retry: 3,
    retryDelay: 1000,
  });

  // Calculate today's exercises and progress
  const { todaysExercises, completedExercises, totalExercises, progressPercentage, isRestDay } = useMemo(() => {
    console.log('📊 Calculating today\'s exercises:', { 
      currentProgram: !!currentProgram, 
      selectedDayNumber,
      dailyWorkoutsCount: currentProgram?.daily_workouts?.length || 0
    });
    
    // If no program exists, return empty state
    if (!currentProgram?.daily_workouts) {
      console.log('❌ No program or daily workouts found');
      return {
        todaysExercises: [],
        completedExercises: 0,
        totalExercises: 0,
        progressPercentage: 0,
        isRestDay: false
      };
    }

    const todaysWorkout = currentProgram.daily_workouts.find(
      (workout: DailyWorkout) => workout.day_number === selectedDayNumber
    );

    console.log('🎯 Today\'s workout search:', {
      selectedDayNumber,
      foundWorkout: !!todaysWorkout,
      workoutId: todaysWorkout?.id,
      exercisesCount: todaysWorkout?.exercises?.length || 0
    });

    if (!todaysWorkout) {
      // Check if it's a scheduled rest day
      const isWeekendRest = selectedDayNumber === 6 || selectedDayNumber === 7;
      console.log('🛌 No workout found for today, rest day:', isWeekendRest);
      return {
        todaysExercises: [],
        completedExercises: 0,
        totalExercises: 0,
        progressPercentage: 0,
        isRestDay: isWeekendRest
      };
    }

    // Check if it's a rest day (no exercises or completed workout)
    if (!todaysWorkout.exercises || todaysWorkout.exercises.length === 0) {
      console.log('🛌 Rest day - no exercises scheduled');
      return {
        todaysExercises: [],
        completedExercises: 0,
        totalExercises: 0,
        progressPercentage: 0,
        isRestDay: true
      };
    }

    const exercises = todaysWorkout.exercises || [];
    const completed = exercises.filter((ex: Exercise) => ex.completed).length;
    const total = exercises.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    console.log('✅ Today\'s workout calculated:', {
      exercisesCount: total,
      completedCount: completed,
      progressPercentage: percentage.toFixed(1) + '%'
    });

    return {
      todaysExercises: exercises,
      completedExercises: completed,
      totalExercises: total,
      progressPercentage: percentage,
      isRestDay: false
    };
  }, [currentProgram, selectedDayNumber]);

  // Generate AI program mutation with enhanced credit checking
  const generateProgramMutation = useMutation({
    mutationFn: async (preferences: ExercisePreferences) => {
      if (!user?.id) throw new Error('User not authenticated');

      // FIXED: Enhanced admin role recognition
      const remainingCredits = profile?.ai_generations_remaining || 0;
      const isAdmin = profile?.role === 'admin';
      const isPro = profile?.subscription_status === 'active' || isAdmin;
      
      console.log('💳 Credit check before generation:', {
        remainingCredits,
        isAdmin,
        isPro,
        role: profile?.role,
        subscriptionStatus: profile?.subscription_status
      });
      
      // Admin bypass for credit checking
      if (!isPro && !isAdmin && remainingCredits <= 0) {
        throw new Error('Insufficient AI generation credits. Please upgrade to Pro or wait for credits to refresh.');
      }

      console.log('🚀 Generating AI program with preferences:', preferences);

      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userId: user.id,
          goalType: preferences.goalType,
          workoutType: preferences.workoutType,
          fitnessLevel: preferences.fitnessLevel,
          availableTime: preferences.availableTime,
          preferredWorkouts: preferences.preferredWorkouts,
          targetMuscleGroups: preferences.targetMuscleGroups,
          equipment: preferences.equipment,
          duration: preferences.duration,
          workoutDays: preferences.workoutDays,
          difficulty: preferences.difficulty,
          weekStartDate: weekStartDateString
        }
      });

      if (error) {
        console.error('❌ AI generation error:', error);
        throw new Error(error.message || 'Failed to generate exercise program');
      }

      console.log('✅ AI program generated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  // Regenerate program mutation
  const regenerateProgramMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !currentProgram) throw new Error('No current program to regenerate');

      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userId: user.id,
          goalType: 'strength',
          workoutType: currentProgram.workout_type,
          fitnessLevel: currentProgram.difficulty_level,
          availableTime: '45',
          workoutDays: '5',
          weekStartDate: weekStartDateString,
          regenerate: true
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to regenerate exercise program');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  // Callback functions
  const onGenerateAIProgram = useCallback(async (preferences: ExercisePreferences) => {
    try {
      await generateProgramMutation.mutateAsync(preferences);
    } catch (error) {
      console.error('❌ Failed to generate AI program:', error);
      throw error;
    }
  }, [generateProgramMutation]);

  const onRegenerateProgram = useCallback(async () => {
    try {
      await regenerateProgramMutation.mutateAsync();
    } catch (error) {
      console.error('❌ Failed to regenerate program:', error);
      throw error;
    }
  }, [regenerateProgramMutation]);

  return {
    // Program data
    currentProgram,
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    isRestDay,
    
    // User data with fixed admin recognition
    profile,
    creditsRemaining: profile?.ai_generations_remaining || 0,
    isPro: profile?.subscription_status === 'active' || profile?.role === 'admin',
    isAdmin: profile?.role === 'admin',
    
    // Loading and error states
    isLoading: programLoading || generateProgramMutation.isPending || regenerateProgramMutation.isPending,
    error: programError?.message || generateProgramMutation.error?.message || regenerateProgramMutation.error?.message,
    
    // Navigation state
    selectedDayNumber,
    setSelectedDayNumber,
    currentWeekOffset,
    setCurrentWeekOffset,
    weekStartDate,
    
    // Workout type
    workoutType,
    setWorkoutType,
    
    // Actions
    onGenerateAIProgram,
    onRegenerateProgram,
    
    // Mutation states
    isGenerating: generateProgramMutation.isPending,
    isRegenerating: regenerateProgramMutation.isPending,
    
    // Helper flags
    hasProgram: !!currentProgram,
    isAIGenerated: true // Default to true since all generated programs are AI-powered
  };
};