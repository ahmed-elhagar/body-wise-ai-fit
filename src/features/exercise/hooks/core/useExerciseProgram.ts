
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useProfile } from '@/features/ai/hooks/useProfile';
import { useCentralizedCredits } from '@/shared/hooks/useCentralizedCredits';
import { ExerciseProgram } from '../../types';
import { format, startOfWeek, addDays } from 'date-fns';
import { useState, useEffect } from 'react';

export interface ExercisePreferences {
  age?: number;
  gender?: string;
  fitnessLevel?: string;
  weight?: number;
  height?: number;
  activityLevel?: string;
  goals?: string[];
  language?: string;
  workoutType?: string;
  goalType?: string;
  availableTime?: string;
  preferredWorkouts?: string[];
  targetMuscleGroups?: string[];
  equipment?: string[];
  duration?: string;
  workoutDays?: string;
  difficulty?: string;
  weekStartDate?: string;
}

export const useExerciseProgram = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { credits } = useCentralizedCredits();
  const queryClient = useQueryClient();

  // State management
  const [selectedDayNumber, setSelectedDayNumber] = useState(new Date().getDay() || 7);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [workoutType, setWorkoutType] = useState<"home" | "gym">("home");

  // Calculate week start date based on offset
  const weekStartDate = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), currentWeekOffset * 7);

  // Fetch current exercise program with proper week filtering and workout type
  const { data: currentProgram, isLoading, error } = useQuery({
    queryKey: ['exercise-program', user?.id, format(weekStartDate, 'yyyy-MM-dd'), workoutType],
    queryFn: async () => {
      if (!user?.id) return null;

      const weekStartStr = format(weekStartDate, 'yyyy-MM-dd');
      const weekEndStr = format(addDays(weekStartDate, 6), 'yyyy-MM-dd');

      console.log('Fetching exercise program:', {
        userId: user.id,
        weekStartStr,
        weekType: workoutType
      });

      const { data, error } = await supabase
        .from('weekly_exercise_programs')
        .select(`
          *,
          daily_workouts:daily_workouts(
            *,
            exercises:exercises(*)
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .eq('workout_type', workoutType)
        .gte('week_start_date', weekStartStr)
        .lte('week_start_date', weekEndStr)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching exercise program:', error);
        throw error;
      }

      console.log('Exercise program fetched:', data);
      return data as ExerciseProgram | null;
    },
    enabled: !!user?.id,
  });

  // Update workout type effect - refetch when type changes
  useEffect(() => {
    if (user?.id) {
      queryClient.invalidateQueries({ 
        queryKey: ['exercise-program', user.id, format(weekStartDate, 'yyyy-MM-dd'), workoutType] 
      });
    }
  }, [workoutType, user?.id, weekStartDate, queryClient]);

  // Generate AI Exercise Program
  const generateProgram = useMutation({
    mutationFn: async (preferences: ExercisePreferences) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Generating exercise program with preferences:', {
        workoutType,
        ...preferences
      });

      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userData: {
            userId: user.id,
            age: preferences.age || profile?.age || 30,
            gender: preferences.gender || profile?.gender || 'male',
            fitnessLevel: preferences.fitnessLevel || 'beginner',
            weight: preferences.weight || profile?.weight || 70,
            height: preferences.height || profile?.height || 170,
            activityLevel: preferences.activityLevel || profile?.activity_level || 'moderate',
            goals: preferences.goals || ['general_fitness'],
            language: preferences.language || 'en'
          },
          preferences: {
            workoutType: preferences.workoutType || workoutType,
            goalType: preferences.goalType || 'general_fitness',
            fitnessLevel: preferences.fitnessLevel || 'beginner',
            availableTime: preferences.availableTime || '30-45 minutes',
            preferredWorkouts: preferences.preferredWorkouts || ['strength', 'cardio'],
            targetMuscleGroups: preferences.targetMuscleGroups || ['full_body'],
            equipment: preferences.equipment || workoutType === 'gym' ? ['dumbbells', 'barbell', 'machines'] : ['bodyweight'],
            duration: preferences.duration || '4 weeks',
            workoutDays: preferences.workoutDays || '3-4 days',
            difficulty: preferences.difficulty || 'beginner',
            weekStartDate: format(weekStartDate, 'yyyy-MM-dd')
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
      toast.success('Exercise program generated successfully!');
    },
    onError: (error) => {
      console.error('Error generating program:', error);
      toast.error('Failed to generate exercise program');
    },
  });

  // Update exercise completion
  const updateExerciseCompletion = useMutation({
    mutationFn: async ({ exerciseId, completed }: { exerciseId: string; completed: boolean }) => {
      const { error } = await supabase
        .from('exercises')
        .update({ completed, updated_at: new Date().toISOString() })
        .eq('id', exerciseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
      toast.success('Exercise updated!');
    },
    onError: (error) => {
      toast.error(`Failed to update exercise: ${error.message}`);
    }
  });

  // Track exercise performance
  const trackPerformance = useMutation({
    mutationFn: async ({ 
      exerciseId, 
      sets, 
      reps, 
      weight, 
      notes 
    }: { 
      exerciseId: string; 
      sets: number; 
      reps: string; 
      weight?: number; 
      notes?: string; 
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('track-exercise-performance', {
        body: {
          exerciseId,
          userId: user.id,
          action: 'progress_updated',
          progressData: {
            sets_completed: sets,
            reps_completed: reps,
            weight_used: weight,
            notes
          },
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
      toast.success('Progress tracked successfully!');
    },
    onError: (error) => {
      console.error('Error tracking performance:', error);
      toast.error('Failed to track performance');
    },
  });

  // Exchange exercise
  const exchangeExercise = useMutation({
    mutationFn: async ({ exerciseId, reason }: { exerciseId: string; reason: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('exchange-exercise', {
        body: {
          exerciseId,
          userId: user.id,
          reason
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
      toast.success('Exercise exchanged successfully!');
    },
    onError: (error) => {
      console.error('Error exchanging exercise:', error);
      toast.error('Failed to exchange exercise');
    },
  });

  // Calculate today's exercises - get current day or selected day exercises
  const todaysExercises = currentProgram?.daily_workouts?.find(
    workout => workout.day_number === selectedDayNumber
  )?.exercises || [];

  const completedExercises = todaysExercises.filter(ex => ex.completed).length;
  const totalExercises = todaysExercises.length;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  // Calculate additional properties
  const isRestDay = todaysExercises.length === 0;
  const hasProgram = !!currentProgram;
  const isPro = profile?.role === 'pro' || false;
  const creditsRemaining = credits;

  // Handler functions
  const onGenerateAIProgram = async (preferences: ExercisePreferences) => {
    return generateProgram.mutateAsync(preferences);
  };

  const onRegenerateProgram = async () => {
    if (!currentProgram) return;
    
    const preferences: ExercisePreferences = {
      workoutType: currentProgram.workout_type as "home" | "gym",
      fitnessLevel: currentProgram.difficulty_level,
      language: 'en'
    };
    
    return generateProgram.mutateAsync(preferences);
  };

  const onExerciseComplete = (exerciseId: string) => {
    updateExerciseCompletion.mutate({ exerciseId, completed: true });
  };

  const onExerciseProgressUpdate = async (
    exerciseId: string, 
    sets: number, 
    reps: string, 
    weight?: number, 
    notes?: string
  ) => {
    return trackPerformance.mutateAsync({ exerciseId, sets, reps, weight, notes });
  };

  const onExerciseExchange = (exerciseId: string, reason: string) => {
    exchangeExercise.mutate({ exerciseId, reason });
  };

  return {
    // Core data
    currentProgram,
    isLoading,
    error: error?.message,
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    
    // State
    selectedDayNumber,
    setSelectedDayNumber,
    currentWeekOffset,
    setCurrentWeekOffset,
    workoutType,
    setWorkoutType,
    weekStartDate,
    isRestDay,
    hasProgram,
    
    // User info
    isPro,
    profile,
    creditsRemaining,
    
    // Mutations and handlers
    isGenerating: generateProgram.isPending,
    onGenerateAIProgram,
    onRegenerateProgram,
    onExerciseComplete,
    onExerciseProgressUpdate,
    onExerciseExchange
  };
};
