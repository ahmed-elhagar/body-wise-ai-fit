
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export const enhancedRateLimiting = {
  async checkRateLimit(userId: string) {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔒 Checking rate limit for user:', userId);

    try {
      // Get user profile with remaining credits
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('ai_generations_remaining, role')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('❌ Error fetching user profile:', profileError);
        throw new Error('Failed to check user credits');
      }

      const remainingCredits = profile?.ai_generations_remaining || 0;
      const userRole = profile?.role;

      // Check if user is pro/admin via profile role (highest priority)
      const isProByRole = userRole === 'pro' || userRole === 'admin';

      // Only check subscription if user is not already pro/admin by role
      let isProBySubscription = false;
      if (!isProByRole) {
        const { data: subscription, error: subError } = await supabase
          .from('subscriptions')
          .select('status, current_period_end')
          .eq('user_id', userId)
          .eq('status', 'active')
          .gte('current_period_end', new Date().toISOString())
          .maybeSingle();

        isProBySubscription = !subError && !!subscription;
      }

      // User is pro if they have pro/admin role OR active subscription
      const isPro = isProByRole || isProBySubscription;

      console.log('💳 Enhanced rate limit check result:', {
        userRole,
        isProByRole,
        isProBySubscription,
        isPro,
        remainingCredits,
        allowed: isPro || remainingCredits > 0
      });

      // Pro/admin users have unlimited access, normal users need credits
      return {
        allowed: isPro || remainingCredits > 0,
        remaining: isPro ? -1 : remainingCredits, // -1 indicates unlimited
        isPro
      };
    } catch (error) {
      console.error('❌ Rate limit check failed:', error);
      throw error;
    }
  },

  async useCredit(userId: string, generationType: string, metadata: any = {}) {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('💸 Using credit for user:', userId, 'type:', generationType);

    try {
      // Create generation log entry with 'pending' status
      const { data: logEntry, error: logError } = await supabase
        .from('ai_generation_logs')
        .insert({
          user_id: userId,
          generation_type: generationType,
          status: 'pending',
          prompt_data: metadata,
          credits_used: 1
        })
        .select('id')
        .single();

      if (logError) {
        console.error('❌ Error creating generation log:', logError);
        throw new Error('Failed to create generation log');
      }

      // Get user role to determine if we should decrement credits
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('ai_generations_remaining, role')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('❌ Error fetching user profile:', profileError);
        throw new Error('Failed to fetch user profile');
      }

      const userRole = profile?.role;
      const isProByRole = userRole === 'pro' || userRole === 'admin';

      // Check subscription only if not pro/admin by role
      let isProBySubscription = false;
      if (!isProByRole) {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', userId)
          .eq('status', 'active')
          .gte('current_period_end', new Date().toISOString())
          .maybeSingle();

        isProBySubscription = !!subscription;
      }

      const isPro = isProByRole || isProBySubscription;

      console.log('💰 Credit usage check:', {
        userRole,
        isProByRole,
        isProBySubscription,
        isPro,
        willDecrementCredits: !isPro
      });

      // Only decrement credits for non-pro users
      if (!isPro) {
        const currentCredits = profile?.ai_generations_remaining || 0;
        const newCredits = Math.max(currentCredits - 1, 0);

        const { error: creditError } = await supabase
          .from('profiles')
          .update({ ai_generations_remaining: newCredits })
          .eq('id', userId);

        if (creditError) {
          console.error('❌ Error updating credits:', creditError);
          throw new Error('Failed to update user credits');
        }

        console.log('💰 Credits updated:', { currentCredits, newCredits });
      } else {
        console.log('💰 Pro/admin user - no credit deduction needed');
      }

      console.log('✅ Credit used successfully, log ID:', logEntry.id);
      return logEntry.id;
    } catch (error) {
      console.error('❌ Error using credit:', error);
      throw error;
    }
  },

  async completeGeneration(logId: string, success: boolean, resultData?: any, errorMessage?: string) {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🏁 Completing generation log:', logId, 'success:', success);

    try {
      const { error } = await supabase
        .from('ai_generation_logs')
        .update({
          status: success ? 'completed' : 'failed',
          response_data: resultData || {},
          error_message: errorMessage
        })
        .eq('id', logId);

      if (error) {
        console.error('❌ Error completing generation log:', error);
      } else {
        console.log('✅ Generation log completed successfully');
      }
    } catch (error) {
      console.error('❌ Exception completing generation log:', error);
    }
  }
};
