
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { exerciseId, userId, action, progressData, timestamp } = await req.json();

    console.log('📊 Tracking exercise performance:', {
      userId: userId?.substring(0, 8) + '...',
      exerciseId: exerciseId?.substring(0, 8) + '...',
      action,
      timestamp
    });

    // Validate required fields
    if (!exerciseId || !userId || !action) {
      throw new Error('Missing required fields: exerciseId, userId, action');
    }

    // Update exercise progress in database
    if (action === 'progress_updated' && progressData) {
      const { error: exerciseError } = await supabase
        .from('exercises')
        .update({
          actual_sets: progressData.sets_completed,
          actual_reps: progressData.reps_completed,
          notes: progressData.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', exerciseId);

      if (exerciseError) {
        console.error('Error updating exercise:', exerciseError);
        throw exerciseError;
      }
    }

    // Update exercise completion status
    if (action === 'completed') {
      const { error: completeError } = await supabase
        .from('exercises')
        .update({
          completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', exerciseId);

      if (completeError) {
        console.error('Error completing exercise:', completeError);
        throw completeError;
      }

      // Update user's last workout date for streak tracking
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }
    }

    console.log('✅ Exercise performance tracked successfully');

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Performance tracked successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error tracking exercise performance:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
