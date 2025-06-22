
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from 'sonner';

export interface CheckAndUseCreditsResponse {
  success: boolean;
  logId?: string;
  remaining?: number;
  error?: string;
}

export const useCentralizedCredits = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: credits = 0, isLoading } = useQuery({
    queryKey: ['user-credits', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      const { data, error } = await supabase
        .from('profiles')
        .select('ai_generations_remaining')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching credits:', error);
        return 0;
      }

      return data.ai_generations_remaining || 0;
    },
    enabled: !!user?.id,
  });

  const checkAndUseCredits = useMutation({
    mutationFn: async (generationType: string): Promise<CheckAndUseCreditsResponse> => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('check-and-use-ai-generation', {
        body: {
          userId: user.id,
          generationType,
          promptData: {}
        }
      });

      if (error) throw error;
      return data as CheckAndUseCreditsResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
    },
    onError: (error) => {
      toast.error(`Credit check failed: ${error.message}`);
    }
  });

  const completeGeneration = useMutation({
    mutationFn: async (params: {
      logId: string;
      responseData?: any;
      errorMessage?: string;
    }) => {
      const { error } = await supabase.functions.invoke('complete-ai-generation', {
        body: params
      });

      if (error) throw error;
      return { success: true };
    }
  });

  // Legacy API for backward compatibility
  const checkAndUseCredit = async (generationType: string): Promise<CheckAndUseCreditsResponse> => {
    return checkAndUseCredits.mutateAsync(generationType);
  };

  return {
    credits,
    isLoading,
    checkAndUseCredits: checkAndUseCredits.mutateAsync,
    checkAndUseCredit, // Legacy API
    completeGeneration: completeGeneration.mutateAsync
  };
};
