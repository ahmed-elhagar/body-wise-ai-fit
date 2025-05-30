import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

// Updated to match the actual database constraint
export type GenerationType = 'meal_plan' | 'exercise_program' | 'snack_generation' | 'recipe';

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

      // First check if user has enough credits
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('ai_generations_remaining')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error checking profile credits:', profileError);
        throw new Error('Failed to check AI generation credits');
      }

      if (!profile || profile.ai_generations_remaining <= 0) {
        throw new Error('AI generation limit reached. Please upgrade or wait for credits to reset.');
      }

      // Create generation log
      const { data: logEntry, error: logError } = await supabase
        .from('ai_generation_logs')
        .insert({
          user_id: user.id,
          generation_type: generationType,
          prompt_data: promptData || {},
          status: 'pending',
          credits_used: 1
        })
        .select()
        .single();

      if (logError) {
        console.error('Error creating generation log:', logError);
        throw new Error('Failed to create generation log');
      }

      // Decrement user credits
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          ai_generations_remaining: profile.ai_generations_remaining - 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating credits:', updateError);
        throw new Error('Failed to update generation count');
      }

      const result: CreditCheckResult = {
        success: true,
        log_id: logEntry.id,
        remaining: profile.ai_generations_remaining - 1
      };

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
      const updateData: any = {
        status: errorMessage ? 'failed' : 'completed'
      };
      
      if (responseData) {
        updateData.response_data = responseData;
      }
      
      if (errorMessage) {
        updateData.error_message = errorMessage;
      }

      const { error } = await supabase
        .from('ai_generation_logs')
        .update(updateData)
        .eq('id', logId);

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
    checkAndUseCreditAsync: checkAndUseCredit.mutateAsync,
    isCheckingCredit: checkAndUseCredit.isPending,
    completeGeneration: completeGeneration.mutate,
    completeGenerationAsync: completeGeneration.mutateAsync,
    isCompletingGeneration: completeGeneration.isPending,
  };
};
