
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreditInfo {
  remaining: number;
  isPro: boolean;
  isLoading: boolean;
}

export const useCentralizedCredits = () => {
  const { user } = useAuth();
  const [creditInfo, setCreditInfo] = useState<CreditInfo>({
    remaining: 0,
    isPro: false,
    isLoading: true
  });

  // Fetch current credit status from database
  const fetchCredits = useCallback(async () => {
    if (!user?.id) {
      setCreditInfo({ remaining: 0, isPro: false, isLoading: false });
      return;
    }

    try {
      // Get user profile with role and credits
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('ai_generations_remaining, role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        setCreditInfo({ remaining: 0, isPro: false, isLoading: false });
        return;
      }

      const userRole = profile?.role;
      const isAdmin = userRole === 'admin';

      // Check for active subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle();

      const isProBySubscription = !!subscription;
      const isPro = isAdmin || isProBySubscription;

      const remaining = isPro ? -1 : (profile?.ai_generations_remaining || 0);

      setCreditInfo({
        remaining,
        isPro,
        isLoading: false
      });

      console.log('📊 Credits fetched:', { 
        remaining, 
        isPro, 
        isAdmin,
        isProBySubscription,
        userId: user.id 
      });
    } catch (error) {
      console.error('Error in fetchCredits:', error);
      setCreditInfo({ remaining: 0, isPro: false, isLoading: false });
    }
  }, [user?.id]);

  // Check and use credit - unified approach
  const checkAndUseCredit = useCallback(async (generationType: string): Promise<{ success: boolean; logId?: string }> => {
    if (!user?.id) {
      console.error('❌ No user ID for credit check');
      return { success: false };
    }

    try {
      console.log(`🔍 Checking credits for ${generationType}...`);
      
      const { data, error } = await supabase.functions.invoke('check_and_use_ai_generation', {
        body: {
          user_id: user.id,
          generation_type: generationType,
          prompt_data: { type: generationType }
        }
      });

      if (error) {
        console.error('❌ Credit check failed:', error);
        toast.error('Failed to check AI credits. Please try again.');
        return { success: false };
      }

      if (!data?.success) {
        console.log('🚫 Credit check denied:', data?.error);
        toast.error(data?.error || 'No AI credits remaining. Please upgrade your plan.');
        await fetchCredits(); // Refresh credits display
        return { success: false };
      }

      console.log('✅ Credit used successfully:', data);
      
      // Update local credit state immediately
      setCreditInfo(prev => ({
        ...prev,
        remaining: data.isPro ? -1 : Math.max(0, (data.remaining || 0))
      }));

      return { success: true, logId: data.log_id };
    } catch (error) {
      console.error('❌ Error in checkAndUseCredit:', error);
      toast.error('Failed to process AI credit');
      return { success: false };
    }
  }, [user?.id, fetchCredits]);

  // Complete generation
  const completeGeneration = useCallback(async (logId: string, success: boolean, responseData?: any) => {
    if (!logId) return;

    try {
      console.log(`✅ Completing generation: ${logId}, success: ${success}`);
      
      await supabase.functions.invoke('complete_ai_generation', {
        body: {
          log_id: logId,
          response_data: responseData,
          error_message: success ? null : 'Generation failed'
        }
      });

      // Refresh credits to ensure accuracy
      await fetchCredits();
    } catch (error) {
      console.error('❌ Error completing generation:', error);
    }
  }, [fetchCredits]);

  // Initialize credits on mount and user change
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return {
    ...creditInfo,
    fetchCredits,
    checkAndUseCredit,
    completeGeneration,
    hasCredits: creditInfo.isPro || creditInfo.remaining > 0
  };
};
