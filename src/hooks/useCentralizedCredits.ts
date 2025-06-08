
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
  };
};
