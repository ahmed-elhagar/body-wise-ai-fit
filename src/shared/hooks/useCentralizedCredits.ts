
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

      // Check if user is Pro (unlimited generations)
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle();

      const isPro = !!subscription;

      if (isPro) {
        return { success: true, remaining: -1 };
      }

      // Check user's remaining credits
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('ai_generations_remaining')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw new Error('Failed to check user credits');
      }

      const remaining = profile.ai_generations_remaining || 0;

      if (remaining <= 0) {
        return { success: false, remaining: 0, error: 'Insufficient credits' };
      }

      // Decrement credits
      const { error: updateError } = await supabase
        .from('profiles')  
        .update({ 
          ai_generations_remaining: remaining - 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        throw new Error('Failed to update credits');
      }

      return { success: true, remaining: remaining - 1 };
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
      // This is a placeholder - implement if needed for logging
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
