
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useProfile } from '@/features/ai/hooks/useProfile';
import { useCentralizedCredits } from '@/shared/hooks/useCentralizedCredits';
import { ExerciseProgram } from '../../types';
import { format, startOfWeek, addDays } from 'date-fns';
import { useState } from 'react';

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
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [workoutType, setWorkoutType] = useState<"home" | "gym">("home");

  // Fetch current exercise program
  const { data: currentProgram, isLoading, error } = useQuery({
    queryKey: ['exercise-program', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

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
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching exercise program:', error);
        throw error;
      }

      return data as ExerciseProgram | null;
    },
    enabled: !!user?.id,
  });

  // Generate AI Exercise Program
  const generateProgram = useMutation({
    mutationFn: async (preferences: ExercisePreferences) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('generate-exercise-program', {
        body: {
          userData: {
            userId: user.id,
            age: preferences.age || 30,
            gender: preferences.gender || 'male',
            fitnessLevel: preferences.fitnessLevel || 'beginner',
            weight: preferences.weight || 70,
            height: preferences.height || 170,
            activityLevel: preferences.activityLevel || 'moderate',
            goals: preferences.goals || ['general_fitness'],
            language: preferences.language || 'en'
          },
          preferences: {
            workoutType: preferences.workoutType || 'home',
            goalType: preferences.goalType || 'general_fitness',
            fitnessLevel: preferences.fitnessLevel || 'beginner',
            availableTime: preferences.availableTime || '30-45 minutes',
            preferredWorkouts: preferences.preferredWorkouts || ['strength', 'cardio'],
            targetMuscleGroups: preferences.targetMuscleGroups || ['full_body'],
            equipment: preferences.equipment || ['bodyweight'],
            duration: preferences.duration || '4 weeks',
            workoutDays: preferences.workoutDays || '3-4 days',
            difficulty: preferences.difficulty || 'beginner',
            weekStartDate: format(startOfWeek(new Date()), 'yyyy-MM-dd')
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
    mutationFn: async (exerciseId: string, completed: boolean) => {
      const { error } = await supabase
        .from('exercises')
        .update({ completed })
        .eq('id', exerciseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
    },
  });

  // Track exercise performance
  const trackPerformance = useMutation({
    mutationFn: async (exerciseId: string, sets: number, reps: string, weight?: number, notes?: string) => {
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
      toast.success('Performance tracked successfully!');
    },
    onError: (error) => {
      console.error('Error tracking performance:', error);
      toast.error('Failed to track performance');
    },
  });

  // Get exercise recommendations
  const { data: recommendations } = useQuery({
    queryKey: ['exercise-recommendations', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase.functions.invoke('get-exercise-recommendations', {
        body: { userId: user.id }
      });

      if (error) {
        console.error('Error getting recommendations:', error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  // Exchange exercise
  const exchangeExercise = useMutation({
    mutationFn: async (exerciseId: string, reason: string) => {
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

  // Calculate today's exercises
  const todaysExercises = currentProgram?.daily_workouts?.find(
    workout => workout.day_number === new Date().getDay() || 1
  )?.exercises || [];

  const completedExercises = todaysExercises.filter(ex => ex.completed).length;
  const totalExercises = todaysExercises.length;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  // Calculate additional properties
  const isRestDay = todaysExercises.length === 0;
  const weekStartDate = new Date();
  weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay() + (currentWeekOffset * 7));
  
  const hasProgram = !!currentProgram;
  const isPro = profile?.role === 'pro' || false;
  const creditsRemaining = credits;

  // Handler functions
  const onGenerateAIProgram = async (preferences: ExercisePreferences) => {
    return generateProgram.mutate(preferences);
  };

  const onRegenerateProgram = async () => {
    if (!currentProgram) return;
    
    const preferences: ExercisePreferences = {
      workoutType: currentProgram.workout_type as "home" | "gym",
      fitnessLevel: currentProgram.difficulty_level,
      language: 'en'
    };
    
    return generateProgram.mutate(preferences);
  };

  const onExerciseComplete = (exerciseId: string) => {
    updateExerciseCompletion.mutate(exerciseId, true);
  };

  const onExerciseProgressUpdate = async (
    exerciseId: string, 
    sets: number, 
    reps: string, 
    notes?: string, 
    weight?: number
  ) => {
    return trackPerformance.mutate(exerciseId, sets, reps, weight, notes);
  };

  return {
    // Core data
    currentProgram,
    isLoading,
    error,
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    recommendations,
    
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
    generateProgram: generateProgram.mutate,
    isGenerating: generateProgram.isPending,
    updateExerciseCompletion: (exerciseId: string, completed: boolean) => 
      updateExerciseCompletion.mutate(exerciseId, completed),
    trackPerformance: (exerciseId: string, sets: number, reps: string, weight?: number, notes?: string) =>
      trackPerformance.mutate(exerciseId, sets, reps, weight, notes),
    exchangeExercise: (exerciseId: string, reason: string) =>
      exchangeExercise.mutate(exerciseId, reason),
    onGenerateAIProgram,
    onRegenerateProgram,
    onExerciseComplete,
    onExerciseProgressUpdate
  };
};
