
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type GenerationType = 'meal_plan' | 'exercise_program' | 'ai_chat' | 'food_analysis' | 'snack_generation';

interface CreditCheckResult {
  success: boolean;
  log_id?: string;
  remaining?: number;
  error?: string;
}

export const useCreditSystem = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get current user credits
  const { data: userCredits, isLoading: isLoadingCredits } = useQuery({
    queryKey: ['user-credits', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('ai_generations_remaining')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching credits:', error);
        throw error;
      }
      
      return data?.ai_generations_remaining || 0;
    },
    enabled: !!user?.id,
  });

  // Check and use AI generation credit
  const checkAndUseCredit = useMutation({
    mutationFn: async ({ 
      generationType, 
      promptData 
    }: { 
      generationType: GenerationType;
      promptData?: any;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Checking credit for generation type:', generationType);

      const { data, error } = await supabase.rpc('check_and_use_ai_generation', {
        user_id_param: user.id,
        generation_type_param: generationType,
        prompt_data_param: promptData || {}
      });

      if (error) {
        console.error('Credit check error:', error);
        throw new Error('Failed to check AI generation credits');
      }

      const result = data as CreditCheckResult;
      if (!result?.success) {
        throw new Error(result?.error || 'AI generation limit reached');
      }

      console.log('Credit check successful:', result);
      return result;
    },
    onSuccess: () => {
      // Invalidate credits query to refresh the count
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
    },
    onError: (error) => {
      console.error('Credit check failed:', error);
      if (error.message.includes('limit reached')) {
        toast.error('AI generation limit reached. Please upgrade or wait for credits to reset.');
      } else {
        toast.error(`Credit check failed: ${error.message}`);
      }
    },
  });

  // Complete AI generation (success or failure)
  const completeGeneration = useMutation({
    mutationFn: async ({
      logId,
      responseData,
      errorMessage
    }: {
      logId: string;
      responseData?: any;
      errorMessage?: string;
    }) => {
      const { error } = await supabase.rpc('complete_ai_generation', {
        log_id_param: logId,
        response_data_param: responseData || {},
        error_message_param: errorMessage || null
      });

      if (error) {
        console.error('Error completing generation log:', error);
        throw error;
      }
    },
  });

  return {
    userCredits,
    isLoadingCredits,
    checkAndUseCredit: checkAndUseCredit.mutate,
    isCheckingCredit: checkAndUseCredit.isPending,
    completeGeneration: completeGeneration.mutate,
    isCompletingGeneration: completeGeneration.isPending,
  };
};
