
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { ExerciseProgramError, errorCodes } from './enhancedErrorHandling.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime?: Date;
  isPro: boolean;
}

export const enhancedRateLimiting = {
  
  // Check comprehensive rate limits for exercise programs
  async checkRateLimit(userId: string): Promise<RateLimitResult> {
    try {
      // Check if user is Pro (unlimited generations)
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle();

      const isPro = !!subscription;

      if (isPro) {
        return {
          allowed: true,
          remaining: -1, // Unlimited
          isPro: true
        };
      }

      // Check user's remaining credits
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('ai_generations_remaining')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw new ExerciseProgramError(
          'Failed to check user credits',
          errorCodes.DATABASE_ERROR,
          500
        );
      }

      const remaining = profile.ai_generations_remaining || 0;

      // Check daily generation limit for exercise programs
      const today = new Date().toISOString().split('T')[0];
      const { data: todayGenerations, error: logError } = await supabase
        .from('ai_generation_logs')
        .select('id')
        .eq('user_id', userId)
        .eq('generation_type', 'exercise_program')
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lte('created_at', `${today}T23:59:59.999Z`);

      if (logError) {
        console.error('Error checking daily logs:', logError);
        // Continue with credit check if logs fail
      }

      const dailyCount = todayGenerations?.length || 0;
      const dailyLimit = 5; // Max 5 exercise program generations per day for free users

      if (dailyCount >= dailyLimit) {
        const resetTime = new Date();
        resetTime.setDate(resetTime.getDate() + 1);
        resetTime.setHours(0, 0, 0, 0);

        return {
          allowed: false,
          remaining: 0,
          resetTime,
          isPro: false
        };
      }

      return {
        allowed: remaining > 0,
        remaining,
        isPro: false
      };

    } catch (error) {
      console.error('Rate limit check failed:', error);
      throw error;
    }
  },

  // Enhanced credit usage with exercise-specific logging
  async useCredit(userId: string, generationType: string, promptData: any): Promise<string> {
    try {
      // Create generation log first - use 'pending' status to match database constraint
      const { data: logEntry, error: logError } = await supabase
        .from('ai_generation_logs')
        .insert({
          user_id: userId,
          generation_type: generationType,
          prompt_data: promptData,
          status: 'pending', // ✅ Fixed: Use 'pending' instead of 'started'
          credits_used: 1
        })
        .select()
        .single();

      if (logError) {
        console.error('Failed to create generation log:', logError);
        throw new ExerciseProgramError(
          'Failed to create generation log',
          errorCodes.DATABASE_ERROR,
          500
        );
      }

      // Check if user is Pro (don't deduct credits)
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle();

      if (!subscription) {
        // Deduct credit for non-Pro users
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            ai_generations_remaining: supabase.rpc('decrement', { x: 1 }),
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (updateError) {
          throw new ExerciseProgramError(
            'Failed to update user credits',
            errorCodes.DATABASE_ERROR,
            500
          );
        }
      }

      return logEntry.id;

    } catch (error) {
      console.error('Credit usage failed:', error);
      throw error;
    }
  },

  // Complete generation log with exercise program specifics
  async completeGeneration(logId: string, success: boolean, responseData?: any, errorMessage?: string): Promise<void> {
    try {
      const updateData: any = {
        status: success ? 'completed' : 'failed'
      };

      if (responseData) {
        updateData.response_data = responseData;
      }

      if (errorMessage) {
        updateData.error_message = errorMessage;
      }

      const { error } = await supabase
        .from('ai_generation_logs')
        .update(updateData)
        .eq('id', logId);

      if (error) {
        console.error('Failed to complete generation log:', error);
      }

    } catch (error) {
      console.error('Complete generation failed:', error);
    }
  },

  // Check weekly exercise program generation limits
  async checkWeeklyProgramLimit(userId: string): Promise<boolean> {
    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const { data: recentPrograms, error } = await supabase
        .from('weekly_exercise_programs')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', oneWeekAgo.toISOString());

      if (error) {
        console.error('Error checking weekly limit:', error);
        return true; // Allow if check fails
      }

      const weeklyLimit = 10; // Max 10 programs per week
      return (recentPrograms?.length || 0) < weeklyLimit;
    } catch (error) {
      console.error('Weekly limit check failed:', error);
      return true;
    }
  }
};
