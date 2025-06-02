
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export const enhancedRateLimiting = {
  async checkRateLimit(userId: string) {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔒 Checking rate limit for user:', userId);

    // Get user profile with remaining credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('ai_generations_remaining')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('❌ Error fetching user profile:', profileError);
      throw new Error('Failed to check user credits');
    }

    // Check if user is pro (has subscription)
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gte('current_period_end', new Date().toISOString())
      .single();

    const isPro = !subError && subscription;
    const remainingCredits = profile?.ai_generations_remaining || 0;

    console.log('💳 Rate limit check result:', {
      isPro: !!isPro,
      remainingCredits,
      allowed: isPro || remainingCredits > 0
    });

    return {
      allowed: isPro || remainingCredits > 0,
      remaining: remainingCredits,
      isPro: !!isPro
    };
  },

  async useCredit(userId: string, generationType: string, metadata: any = {}) {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('💸 Using credit for user:', userId, 'type:', generationType);

    // Create generation log entry with 'pending' status (which should be allowed)
    const { data: logEntry, error: logError } = await supabase
      .from('ai_generation_logs')
      .insert({
        user_id: userId,
        generation_type: generationType,
        status: 'pending', // Changed from 'started' to 'pending'
        prompt_data: metadata,
        credits_used: 1
      })
      .select('id')
      .single();

    if (logError) {
      console.error('❌ Error creating generation log:', logError);
      throw new Error('Failed to create generation log');
    }

    // Check if user is pro to determine if we should decrement credits
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gte('current_period_end', new Date().toISOString())
      .single();

    const isPro = !!subscription;

    // Only decrement credits for non-pro users
    if (!isPro) {
      const { error: creditError } = await supabase
        .from('profiles')
        .update({
          ai_generations_remaining: supabase.sql`GREATEST(ai_generations_remaining - 1, 0)`
        })
        .eq('id', userId);

      if (creditError) {
        console.error('❌ Error updating credits:', creditError);
        throw new Error('Failed to update user credits');
      }
    }

    console.log('✅ Credit used successfully, log ID:', logEntry.id);
    return logEntry.id;
  },

  async completeGeneration(logId: string, success: boolean, resultData?: any, errorMessage?: string) {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🏁 Completing generation log:', logId, 'success:', success);

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
  }
};
