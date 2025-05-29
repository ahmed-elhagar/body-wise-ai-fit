
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface UserProfile {
  id: string;
  fitness_goal?: string;
  [key: string]: any;
}

export const checkAndDecrementGenerations = async (userProfile: UserProfile) => {
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('ai_generations_remaining')
    .eq('id', userProfile.id)
    .single();
    
  if (profileError) {
    throw new Error('Failed to check AI generations remaining');
  }
  
  if (profileData.ai_generations_remaining <= 0) {
    throw new Error('You have reached your AI generation limit. Please contact admin to increase your limit.');
  }

  return profileData;
};

export const decrementUserGenerations = async (userProfile: UserProfile, profileData: any) => {
  const { error: decrementError } = await supabase
    .from('profiles')
    .update({
      ai_generations_remaining: profileData.ai_generations_remaining - 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', userProfile.id);
    
  if (decrementError) {
    console.error('Failed to decrement AI generations:', decrementError);
    throw new Error('Failed to update generation count');
  }

  return profileData.ai_generations_remaining - 1;
};
