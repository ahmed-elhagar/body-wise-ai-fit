
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCentralizedCredits = () => {
  const { user } = useAuth();
  const [remaining, setRemaining] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchCredits = async () => {
      try {
        // Check subscription status
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        const isProUser = !!subscription;
        setIsPro(isProUser);

        // Get credits from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('ai_generations_remaining')
          .eq('id', user.id)
          .single();

        const credits = profile?.ai_generations_remaining || 0;
        setRemaining(credits);

      } catch (error) {
        console.error('Error fetching credits:', error);
        setRemaining(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredits();
  }, [user?.id]);

  const hasCredits = remaining > 0 || isPro;

  const consumeCredit = async () => {
    if (!user?.id || isPro) return true;

    if (remaining <= 0) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ai_generations_remaining: remaining - 1 })
        .eq('id', user.id);

      if (error) throw error;

      setRemaining(prev => prev - 1);
      return true;
    } catch (error) {
      console.error('Error consuming credit:', error);
      return false;
    }
  };

  const checkAndUseCredit = async (featureType: string) => {
    if (!user?.id) {
      console.error('No user ID available for credit check');
      return { success: false, logId: undefined };
    }

    // Pro users don't need to consume credits
    if (isPro) {
      console.log('✅ Pro user - no credit needed');
      return { success: true, logId: undefined };
    }

    // Check if user has credits
    if (remaining <= 0) {
      console.error('❌ No credits remaining');
      return { success: false, logId: undefined };
    }

    try {
      // Create AI generation log entry
      const { data: logData, error: logError } = await supabase
        .from('ai_generation_logs')
        .insert({
          user_id: user.id,
          generation_type: featureType,
          status: 'pending',
          credits_used: 1,
          prompt_data: {}
        })
        .select()
        .single();

      if (logError) {
        console.error('❌ Failed to create generation log:', logError);
        throw logError;
      }

      // Consume the credit
      const success = await consumeCredit();
      if (!success) {
        // Update log as failed if credit consumption failed
        await supabase
          .from('ai_generation_logs')
          .update({ status: 'failed', error_message: 'Credit consumption failed' })
          .eq('id', logData.id);
        
        return { success: false, logId: logData.id };
      }

      console.log('✅ Credit consumed successfully');
      return { success: true, logId: logData.id };
    } catch (error) {
      console.error('❌ Credit check and use failed:', error);
      return { success: false, logId: undefined };
    }
  };

  const completeGeneration = async (logId: string, success: boolean, responseData?: any) => {
    if (!logId) return;

    try {
      await supabase
        .from('ai_generation_logs')
        .update({
          status: success ? 'completed' : 'failed',
          response_data: responseData,
          completed_at: new Date().toISOString()
        })
        .eq('id', logId);

      console.log(`✅ Generation log ${logId} marked as ${success ? 'completed' : 'failed'}`);
    } catch (error) {
      console.error('❌ Failed to complete generation log:', error);
    }
  };

  return {
    remaining,
    isPro,
    hasCredits,
    isLoading,
    consumeCredit,
    checkAndUseCredit,
    completeGeneration
  };
};
