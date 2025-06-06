
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useRole } from './useRole';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreditInfo {
  remaining: number;
  isPro: boolean;
  isLoading: boolean;
}

export const useCentralizedCredits = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useRole();
  const [creditInfo, setCreditInfo] = useState<CreditInfo>({
    remaining: 0,
    isPro: false,
    isLoading: true
  });

  // Fetch current credit status from database
  const fetchCredits = useCallback(async () => {
    if (!user?.id || roleLoading) {
      setCreditInfo({ remaining: 0, isPro: false, isLoading: roleLoading });
      return;
    }

    try {
      // Admin users have unlimited credits
      if (isAdmin) {
        setCreditInfo({
          remaining: -1, // -1 indicates unlimited
          isPro: true, // Treat admin as pro
          isLoading: false
        });
        console.log('📊 Admin user detected - unlimited credits');
        return;
      }

      // Check if user is Pro
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle();

      const isPro = !!subscription;

      // Get current remaining credits
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('ai_generations_remaining')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching credits:', error);
        setCreditInfo({ remaining: 0, isPro: false, isLoading: false });
        return;
      }

      const remaining = isPro ? -1 : (profile?.ai_generations_remaining || 0);

      setCreditInfo({
        remaining,
        isPro,
        isLoading: false
      });

      console.log('📊 Credits fetched:', { remaining, isPro, isAdmin, userId: user.id });
    } catch (error) {
      console.error('Error in fetchCredits:', error);
      setCreditInfo({ remaining: 0, isPro: false, isLoading: false });
    }
  }, [user?.id, isAdmin, roleLoading]);

  // Check and use credit - this will be called before any AI generation
  const checkAndUseCredit = useCallback(async (generationType: string): Promise<{ success: boolean; logId?: string }> => {
    if (!user?.id) {
      console.error('❌ No user ID for credit check');
      return { success: false };
    }

    // Admin users always have unlimited credits
    if (isAdmin) {
      console.log('✅ Admin user - bypassing credit check');
      try {
        // Still log the generation for admin users for tracking purposes
        const { data, error } = await supabase.functions.invoke('check_and_use_ai_generation', {
          body: {
            user_id: user.id,
            generation_type: generationType,
            prompt_data: { type: generationType },
            is_admin: true // Flag to indicate admin user
          }
        });

        if (error) {
          console.error('❌ Admin credit logging failed:', error);
          // Don't block admin users even if logging fails
          return { success: true };
        }

        return { success: true, logId: data?.log_id };
      } catch (error) {
        console.error('❌ Admin credit logging error:', error);
        // Don't block admin users even if logging fails
        return { success: true };
      }
    }

    try {
      console.log(`🔍 Checking credits for ${generationType}...`);
      
      // Call the centralized edge function for credit checking and usage
      const { data, error } = await supabase.functions.invoke('check_and_use_ai_generation', {
        body: {
          user_id: user.id,
          generation_type: generationType,
          prompt_data: { type: generationType }
        }
      });

      if (error) {
        console.error('❌ Credit check failed:', error);
        toast.error('Failed to check AI credits');
        return { success: false };
      }

      if (!data?.success) {
        console.log('🚫 No credits remaining');
        toast.error('No AI credits remaining. Please upgrade your plan or wait for credits to reset.');
        await fetchCredits(); // Refresh credits
        return { success: false };
      }

      console.log('✅ Credit used successfully:', data);
      
      // Update local credit state immediately
      setCreditInfo(prev => ({
        ...prev,
        remaining: prev.isPro ? -1 : Math.max(0, prev.remaining - 1)
      }));

      return { success: true, logId: data.log_id };
    } catch (error) {
      console.error('❌ Error in checkAndUseCredit:', error);
      toast.error('Failed to process AI credit');
      return { success: false };
    }
  }, [user?.id, isAdmin, fetchCredits]);

  // Complete generation - to be called after successful AI generation
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

      // Refresh credits to ensure accuracy (but not for admin users)
      if (!isAdmin) {
        await fetchCredits();
      }
    } catch (error) {
      console.error('❌ Error completing generation:', error);
    }
  }, [fetchCredits, isAdmin]);

  // Initialize credits on mount and user change
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return {
    ...creditInfo,
    fetchCredits,
    checkAndUseCredit,
    completeGeneration,
    hasCredits: isAdmin || creditInfo.isPro || creditInfo.remaining > 0
  };
};
