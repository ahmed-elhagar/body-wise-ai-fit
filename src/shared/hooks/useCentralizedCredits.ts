
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface CreditResult {
  success: boolean;
  remaining: number;
  error?: string;
  logId?: string;
}

export const useCentralizedCredits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState(5);
  const [isChecking, setIsChecking] = useState(false);

  const checkAndUseCredits = async (feature: string, promptData?: any): Promise<CreditResult> => {
    if (!user) {
      return {
        success: false,
        remaining: 0,
        error: 'User not authenticated'
      };
    }

    setIsChecking(true);
    
    try {
      const { data, error } = await supabase.rpc('check_and_use_ai_generation', {
        user_id_param: user.id,
        generation_type_param: feature,
        prompt_data_param: promptData || {}
      });

      if (error) throw error;

      setCredits(data.remaining);
      
      return {
        success: data.success,
        remaining: data.remaining,
        logId: data.log_id,
        error: data.success ? undefined : data.error
      };
    } catch (error) {
      console.error('Credit check failed:', error);
      return {
        success: false,
        remaining: 0,
        error: error instanceof Error ? error.message : 'Credit check failed'
      };
    } finally {
      setIsChecking(false);
    }
  };

  const completeGeneration = async (logId: string, success: boolean, data?: any): Promise<void> => {
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
    credits,
    checkAndUseCredits,
    completeGeneration,
    isChecking
  };
};
