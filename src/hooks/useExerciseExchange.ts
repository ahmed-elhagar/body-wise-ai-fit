
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCreditSystem } from './useCreditSystem';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export const useExerciseExchange = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCreditSystem();

  // Get current week's exchange count
  const { data: weeklyExchangeCount = 0, isLoading: isLoadingCount } = useQuery({
    queryKey: ['weekly-exercise-exchanges', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('ai_generation_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('generation_type', 'exercise_program')
        .gte('created_at', startOfWeek.toISOString())
        .like('prompt_data->action', '%exercise_exchange%');

      if (error) throw error;
      return data?.length || 0;
    },
    enabled: !!user?.id,
  });

  const exchangeExercise = useMutation({
    mutationFn: async ({ 
      exerciseId, 
      reason, 
      preferences 
    }: { 
      exerciseId: string;
      reason: string;
      preferences?: {
        targetMuscleGroups?: string[];
        equipment?: string[];
        difficulty?: string;
      };
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Check weekly limit
      if (weeklyExchangeCount >= 2) {
        throw new Error('Weekly exchange limit reached (2 exchanges per week)');
      }

      // Get original exercise details
      const { data: originalExercise, error: exerciseError } = await supabase
        .from('exercises')
        .select('*, daily_workouts!inner(*, weekly_exercise_programs!inner(*))')
        .eq('id', exerciseId)
        .single();

      if (exerciseError) throw exerciseError;

      // Use credit system
      const creditResult = await checkAndUseCreditAsync({
        generationType: 'exercise_program',
        promptData: {
          action: 'exercise_exchange',
          exerciseId,
          reason,
          preferences,
          originalExercise: originalExercise.name
        }
      });

      try {
        // Call AI exchange service
        const { data, error } = await supabase.functions.invoke('exchange-exercise', {
          body: {
            exerciseId,
            reason,
            preferences,
            userLanguage: language,
            userId: user.id
          }
        });

        if (error) throw error;

        if (!data?.success) {
          throw new Error(data?.error || 'Failed to exchange exercise');
        }

        // Complete generation log
        await completeGenerationAsync({
          logId: creditResult.log_id!,
          responseData: {
            action: 'exercise_exchange',
            originalExercise: originalExercise.name,
            newExercise: data.newExercise?.name,
            reason
          }
        });

        return data;
      } catch (error) {
        // Mark generation as failed
        await completeGenerationAsync({
          logId: creditResult.log_id!,
          errorMessage: error instanceof Error ? error.message : 'Exchange failed'
        });
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate exercise queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['exercise-programs'] });
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-exercise-exchanges'] });
      
      toast.success('Exercise exchanged successfully!');
    },
    onError: (error) => {
      console.error('Exercise exchange error:', error);
      
      if (error.message.includes('limit reached')) {
        toast.error('Weekly exchange limit reached (2 exchanges per week)');
      } else {
        toast.error(error.message || 'Failed to exchange exercise');
      }
    }
  });

  return {
    exchangeExercise: exchangeExercise.mutate,
    exchangeExerciseAsync: exchangeExercise.mutateAsync,
    isExchanging: exchangeExercise.isPending,
    weeklyExchangeCount,
    remainingExchanges: Math.max(0, 2 - weeklyExchangeCount),
    isLoadingCount,
    canExchange: weeklyExchangeCount < 2
  };
};
