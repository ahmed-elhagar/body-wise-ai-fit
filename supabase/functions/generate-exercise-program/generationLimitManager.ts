
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const checkGenerationLimit = async (supabase: any, userId: string) => {
  console.log('🔍 Checking AI generation limit...');
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('ai_generations_remaining')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.error('❌ Error fetching user profile:', profileError);
    throw new Error('Failed to check generation limit');
  }

  if (!profile || profile.ai_generations_remaining <= 0) {
    console.log('🚫 Generation limit reached for user');
    return { limitReached: true, remaining: profile?.ai_generations_remaining || 0 };
  }

  return { limitReached: false, remaining: profile.ai_generations_remaining };
};

export const createGenerationLog = async (
  supabase: any,
  userId: string,
  preferences: any,
  userLanguage: string
) => {
  console.log('📝 Creating generation log...');
  const { data: logEntry, error: logError } = await supabase
    .from('ai_generation_logs')
    .insert({
      user_id: userId,
      generation_type: 'exercise_program',
      prompt_data: {
        workoutType: preferences?.workoutType || 'home',
        goalType: preferences?.goalType,
        fitnessLevel: preferences?.fitnessLevel,
        userLanguage: userLanguage,
        weekStartDate: preferences?.weekStartDate
      },
      status: 'pending',
      credits_used: 1
    })
    .select()
    .single();

  if (logError) {
    console.error('❌ Error creating log entry:', logError);
    throw new Error('Failed to create generation log');
  }

  return logEntry;
};

export const decrementGenerationCount = async (supabase: any, userId: string, currentRemaining: number) => {
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ 
      ai_generations_remaining: currentRemaining - 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (updateError) {
    console.error('❌ Error updating generation count:', updateError);
    throw new Error('Failed to update generation count');
  }

  console.log('✅ Generation limit checked, remaining:', currentRemaining - 1);
};

export const updateGenerationLog = async (
  supabase: any,
  logId: string,
  status: 'completed' | 'failed',
  responseData?: any,
  errorMessage?: string
) => {
  const updateData: any = { status };
  
  if (responseData) {
    updateData.response_data = responseData;
  }
  
  if (errorMessage) {
    updateData.error_message = errorMessage;
  }

  await supabase
    .from('ai_generation_logs')
    .update(updateData)
    .eq('id', logId);
};
