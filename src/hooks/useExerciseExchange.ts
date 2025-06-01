import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useI18n } from "@/hooks/useI18n";

export const useExerciseExchange = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const [isGenerating, setIsGenerating] = useState(false);

  const exchangeExercise = useMutation({
    mutationFn: async ({ exerciseId, programId, dayNumber }: { exerciseId: string, programId: string, dayNumber: number }) => {
      if (!user) {
        throw new Error(t('auth.signInRequired') || 'Please sign in to exchange exercise');
      }

      setIsGenerating(true);

      const { data, error } = await supabase.functions.invoke('exchange-exercise', {
        body: {
          exerciseId,
          programId,
          dayNumber,
          userProfile: profile,
        }
      });

      setIsGenerating(false);

      if (error) {
        console.error('Error exchanging exercise:', error);
        throw new Error(t('exercise.exchangeFailed') || 'Failed to exchange exercise');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
      toast.success(t('exercise.exchangeSuccess') || 'Exercise exchanged successfully!');
    },
    onError: (error: any) => {
      console.error('Error exchanging exercise:', error);
      toast.error(error.message || t('exercise.exchangeFailed') || 'Failed to exchange exercise');
    },
  });

  return {
    exchangeExercise: exchangeExercise.mutate,
    isExchanging: exchangeExercise.isLoading || isGenerating,
    error: exchangeExercise.error,
  };
};
