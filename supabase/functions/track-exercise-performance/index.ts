
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

    // Log performance data for analytics
    const { error: logError } = await supabase
      .from('ai_generation_logs')
      .insert({
        user_id: userId,
        generation_type: 'exercise_performance',
        prompt_data: {
          exercise_id: exerciseId,
          action,
          progress_data: progressData,
          timestamp
        },
        status: 'completed',
        credits_used: 0 // No credit cost for tracking
      });

    if (logError) {
      console.error('Error logging performance:', logError);
      throw logError;
    }

    // Calculate performance metrics if progress data is provided
    let performanceMetrics = null;
    if (progressData && action === 'progress_updated') {
      // Get exercise details for comparison
      const { data: exercise, error: exerciseError } = await supabase
        .from('exercises')
        .select('name, sets, reps, difficulty')
        .eq('id', exerciseId)
        .single();

      if (!exerciseError && exercise) {
        const targetSets = exercise.sets || 3;
        const actualSets = progressData.sets_completed || 0;
        const completionRate = (actualSets / targetSets) * 100;

        performanceMetrics = {
          exercise_name: exercise.name,
          target_sets: targetSets,
          actual_sets: actualSets,
          completion_rate: completionRate,
          difficulty: exercise.difficulty,
          exceeded_target: actualSets > targetSets
        };

        console.log('📈 Performance metrics calculated:', performanceMetrics);
      }
    }

    // Update user's last workout date for streak tracking
    if (action === 'completed') {
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
      message: 'Performance tracked successfully',
      performanceMetrics
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
