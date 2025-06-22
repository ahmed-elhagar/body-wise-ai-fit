import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from '@/shared/hooks/use-toast';

interface ExchangePreferences {
  equipment?: string[];
  targetMuscleGroups?: string[];
  difficulty?: string;
}

export const useExerciseExchange = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isExchanging, setIsExchanging] = useState(false);

  const exchangeExerciseMutation = useMutation({
    mutationFn: async ({ 
      exerciseId, 
      reason, 
      preferences 
    }: { 
      exerciseId: string; 
      reason: string; 
      preferences?: ExchangePreferences;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Exchanging exercise:', { exerciseId, reason, preferences });

      const { data, error } = await supabase.functions.invoke('exchange-exercise', {
        body: {
          exerciseId,
          reason,
          preferences,
          userLanguage: 'en', // TODO: Get from user preferences
          userId: user.id
        }
      });

      if (error) {
        console.error('Exercise exchange error:', error);
        throw new Error(error.message || 'Failed to exchange exercise');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to exchange exercise');
      }

      console.log('Exercise exchanged successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate exercise program queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
      
      toast({
        title: "Exercise Exchanged",
        description: `Successfully replaced "${data.originalExercise}" with "${data.newExercise.name}"`,
      });
    },
    onError: (error: Error) => {
      console.error('Failed to exchange exercise:', error);
      toast({
        title: "Exchange Failed",
        description: error.message || "Failed to exchange exercise. Please try again.",
        variant: "destructive",
      });
    }
  });

  const exchangeExercise = async (
    exerciseId: string, 
    reason: string, 
    preferences?: ExchangePreferences
  ) => {
    setIsExchanging(true);
    try {
      await exchangeExerciseMutation.mutateAsync({ exerciseId, reason, preferences });
    } finally {
      setIsExchanging(false);
    }
  };

  return {
    exchangeExercise,
    isExchanging: isExchanging || exchangeExerciseMutation.isPending,
    error: exchangeExerciseMutation.error?.message
  };
}; 