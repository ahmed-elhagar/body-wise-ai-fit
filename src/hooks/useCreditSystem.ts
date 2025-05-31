
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

export const useCreditSystem = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  // Get user's AI credits from profile
  const userCredits = profile?.ai_generations_remaining || 0;

  const useCredit = useMutation({
    mutationFn: async (generationType: string) => {
      const { data, error } = await supabase
        .rpc('check_and_use_ai_generation', {
          user_id_param: user?.id,
          generation_type_param: generationType,
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const logGeneration = useMutation({
    mutationFn: async (params: {
      generationType: string;
      promptData: any;
      responseData?: any;
      status: string;
      errorMessage?: string;
    }) => {
      const { error } = await supabase
        .from('ai_generation_logs')
        .insert({
          user_id: user?.id,
          generation_type: params.generationType,
          prompt_data: params.promptData,
          response_data: params.responseData,
          status: params.status,
          error_message: params.errorMessage,
        });

      if (error) throw error;
    },
  });

  // Async versions for better compatibility
  const checkAndUseCreditAsync = async (generationType: string) => {
    const { data, error } = await supabase
      .rpc('check_and_use_ai_generation', {
        user_id_param: user?.id,
        generation_type_param: generationType,
      });

    if (error) throw error;
    
    // Invalidate profile to update credits
    queryClient.invalidateQueries({ queryKey: ['profile'] });
    
    return data;
  };

  const completeGenerationAsync = async (params: {
    logId?: string;
    generationType: string;
    promptData: any;
    responseData?: any;
    status: string;
    errorMessage?: string;
  }) => {
    const { error } = await supabase
      .from('ai_generation_logs')
      .insert({
        user_id: user?.id,
        generation_type: params.generationType,
        prompt_data: params.promptData,
        response_data: params.responseData,
        status: params.status,
        error_message: params.errorMessage,
      });

    if (error) throw error;
  };

  return {
    userCredits,
    useCredit: useCredit.mutate,
    logGeneration: logGeneration.mutate,
    isUsingCredit: useCredit.isPending,
    // Add async versions
    checkAndUseCreditAsync,
    completeGenerationAsync,
  };
};
