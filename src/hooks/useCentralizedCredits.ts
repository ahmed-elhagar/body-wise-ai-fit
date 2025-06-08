
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCentralizedCredits = () => {
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const { user } = useAuth();

  const fetchCredits = async () => {
    if (!user?.id) return;
    
    try {
      // Get user profile data including AI generations remaining
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('ai_generations_remaining')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        return;
      }
      
      // Check if user has active subscription (Pro status)
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .single();
      
      if (subError && subError.code !== 'PGRST116') {
        console.error('Error fetching subscription:', subError);
      }
      
      const isProUser = !!subscription;
      const userCredits = profile?.ai_generations_remaining || 0;
      
      setCredits(userCredits);
      setIsPro(isProUser);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const checkAndDeductCredits = async (amount: number = 1): Promise<boolean> => {
    if (!user?.id) {
      toast.error('Please sign in to use AI features');
      return false;
    }

    try {
      setIsLoading(true);
      
      // Check current credits
      await fetchCredits();
      
      // Pro users have unlimited credits
      if (isPro) {
        return true;
      }
      
      if (credits < amount) {
        toast.error('Insufficient credits. Please upgrade your plan.');
        return false;
      }

      // Deduct credits from profile
      const { error } = await supabase
        .from('profiles')
        .update({ ai_generations_remaining: credits - amount })
        .eq('id', user.id);

      if (error) {
        console.error('Error deducting credits:', error);
        toast.error('Failed to process credits. Please try again.');
        return false;
      }

      setCredits(prev => prev - amount);
      return true;
    } catch (error) {
      console.error('Error processing credits:', error);
      toast.error('Failed to process credits. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Method for meal plan compatibility - simplified without RPC calls
  const checkAndUseCredit = async (generationType: string): Promise<{ success: boolean; logId?: string }> => {
    if (!user?.id) {
      toast.error('Please sign in to use AI features');
      return { success: false };
    }

    try {
      setIsLoading(true);
      
      // Check if user is Pro (unlimited credits)
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle();

      const isProUser = !!subscription;

      if (!isProUser) {
        // Check and deduct credits for non-Pro users
        const hasCredits = await checkAndDeductCredits(1);
        if (!hasCredits) {
          return { success: false };
        }
      }

      // Create generation log
      const { data: logEntry, error: logError } = await supabase
        .from('ai_generation_logs')
        .insert({
          user_id: user.id,
          generation_type: generationType,
          prompt_data: {},
          status: 'pending',
          credits_used: isProUser ? 0 : 1
        })
        .select()
        .single();

      if (logError) {
        console.error('Error creating log:', logError);
        return { success: false };
      }

      return { 
        success: true, 
        logId: logEntry.id 
      };
    } catch (error) {
      console.error('Error using credit:', error);
      toast.error('Failed to process credits. Please try again.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Method for completing generation logging
  const completeGeneration = async (logId: string, success: boolean, responseData?: any): Promise<void> => {
    try {
      const updateData: any = {
        status: success ? 'completed' : 'failed'
      };

      if (responseData) {
        updateData.response_data = responseData;
      }

      if (!success) {
        updateData.error_message = 'Generation failed';
      }

      await supabase
        .from('ai_generation_logs')
        .update(updateData)
        .eq('id', logId);
    } catch (error) {
      console.error('Error completing generation log:', error);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [user?.id]);

  // Computed properties for component compatibility
  const remaining = credits;
  const hasCredits = isPro || credits > 0;

  return {
    credits,
    remaining, // Alias for credits
    isLoading,
    isPro,
    hasCredits,
    fetchCredits,
    checkAndDeductCredits,
    checkAndUseCredit, // For meal plan compatibility
    completeGeneration, // For meal plan compatibility
  };
};
