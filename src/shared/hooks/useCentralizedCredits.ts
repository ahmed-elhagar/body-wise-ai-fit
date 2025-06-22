
import { useState, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CreditCheckResult {
  success: boolean;
  logId?: string;
  error?: string;
  remaining?: number;
}

export const useCentralizedCredits = () => {
  const { user } = useAuth();
  const [isCheckingCredits, setIsCheckingCredits] = useState(false);

  const checkAndUseCredit = useCallback(async (
    generationType: string,
    promptData: any = {}
  ): Promise<CreditCheckResult> => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    setIsCheckingCredits(true);
    
    try {
      const { data, error } = await supabase.rpc('check_and_use_ai_generation', {
        user_id_param: user.id,
        generation_type_param: generationType,
        prompt_data_param: promptData
      });

      if (error) {
        console.error('Credit check error:', error);
        return { success: false, error: error.message };
      }

      if (!data || !data.success) {
        return { 
          success: false, 
          error: data?.error || 'AI generation limit reached',
          remaining: data?.remaining || 0
        };
      }

      return {
        success: true,
        logId: data.log_id,
        remaining: data.remaining
      };
    } catch (error: any) {
      console.error('Credit check failed:', error);
      return { success: false, error: error.message };
    } finally {
      setIsCheckingCredits(false);
    }
  }, [user?.id]);

  const completeGeneration = useCallback(async (
    logId: string,
    success: boolean,
    responseData: any = {}
  ) => {
    if (!logId) return;

    try {
      const { error } = await supabase.rpc('complete_ai_generation', {
        log_id_param: logId,
        response_data_param: responseData,
        error_message_param: success ? null : 'Generation failed'
      });

      if (error) {
        console.error('Failed to complete generation log:', error);
      }
    } catch (error) {
      console.error('Complete generation error:', error);
    }
  }, []);

  const checkAndUseCredits = useCallback(async (
    generationType: string,
    promptData: any = {}
  ): Promise<{ success: boolean; logId?: string; error?: string }> => {
    const result = await checkAndUseCredit(generationType, promptData);
    return {
      success: result.success,
      logId: result.logId,
      error: result.error
    };
  }, [checkAndUseCredit]);

  return {
    checkAndUseCredit,
    checkAndUseCredits,
    completeGeneration,
    isCheckingCredits
  };
};
