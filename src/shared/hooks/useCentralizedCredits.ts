
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth';

export interface CreditResult {
  success: boolean;
  logId?: string;
  remaining: number;
  error?: string;
}

export const useCentralizedCredits = () => {
  const { user } = useAuth();
  const [isChecking, setIsChecking] = useState(false);

  // Fetch user's current credits and subscription status
  const { data: profile, refetch } = useQuery({
    queryKey: ['user-credits', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      // Get user profile with credits
      const { data: profileData } = await supabase
        .from('profiles')
        .select('ai_generations_remaining, role')
        .eq('id', user.id)
        .single();

      // Check subscription status
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle();

      return {
        ...profileData,
        isPro: !!subscription || profileData?.role === 'admin'
      };
    },
    enabled: !!user?.id,
  });

  const checkAndUseCredits = async (feature: string, promptData: any = {}): Promise<CreditResult> => {
    if (!user?.id) {
      return { success: false, remaining: 0, error: 'User not authenticated' };
    }

    setIsChecking(true);
    try {
      const { data, error } = await supabase.rpc('check_and_use_ai_generation', {
        user_id_param: user.id,
        generation_type_param: feature,
        prompt_data_param: promptData
      });

      if (error) throw error;

      // Refetch credits after usage
      refetch();

      return {
        success: data.success,
        logId: data.log_id,
        remaining: data.remaining,
        error: data.error
      };
    } catch (error) {
      console.error('Credit check failed:', error);
      return {
        success: false,
        remaining: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setIsChecking(false);
    }
  };

  const completeGeneration = async (logId: string, success: boolean, data?: any) => {
    try {
      await supabase.rpc('complete_ai_generation', {
        log_id_param: logId,
        response_data_param: data || {},
        error_message_param: success ? null : 'Generation failed'
      });
    } catch (error) {
      console.error('Failed to complete generation log:', error);
    }
  };

  return {
    credits: profile?.ai_generations_remaining || 0,
    isPro: profile?.isPro || false,
    checkAndUseCredits,
    completeGeneration,
    isChecking,
    refetch
  };
};
