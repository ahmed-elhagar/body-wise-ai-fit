
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id, generation_type, prompt_data = {} } = await req.json();

    if (!user_id || !generation_type) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required parameters: user_id and generation_type' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔍 Checking AI generation credits for:', { user_id, generation_type });

    // Get user profile and check role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('ai_generations_remaining, role')
      .eq('id', user_id)
      .single();

    if (profileError) {
      console.error('❌ Error fetching user profile:', profileError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch user profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userRole = profile?.role;
    const isAdmin = userRole === 'admin';

    // Check for active subscription (Pro status)
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', user_id)
      .eq('status', 'active')
      .gte('current_period_end', new Date().toISOString())
      .maybeSingle();

    const isProBySubscription = !!subscription;
    const isPro = isAdmin || isProBySubscription;

    console.log('💳 User status:', {
      userRole,
      isAdmin,
      isProBySubscription,
      isPro,
      remainingCredits: profile?.ai_generations_remaining || 0
    });

    // Pro/admin users have unlimited access
    if (isPro) {
      // Create log entry for tracking
      const { data: logEntry, error: logError } = await supabase
        .from('ai_generation_logs')
        .insert({
          user_id,
          generation_type,
          prompt_data,
          status: 'pending',
          credits_used: 0 // Pro users don't use credits
        })
        .select('id')
        .single();

      if (logError) {
        console.error('❌ Error creating log entry:', logError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create log entry' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          log_id: logEntry.id,
          remaining: -1, // Unlimited
          isPro: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check credits for free users
    const remainingCredits = profile?.ai_generations_remaining || 0;
    if (remainingCredits <= 0) {
      console.log('🚫 No credits remaining for user');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No AI credits remaining',
          remaining: 0,
          isPro: false
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create log entry and decrement credits
    const { data: logEntry, error: logError } = await supabase
      .from('ai_generation_logs')
      .insert({
        user_id,
        generation_type,
        prompt_data,
        status: 'pending',
        credits_used: 1
      })
      .select('id')
      .single();

    if (logError) {
      console.error('❌ Error creating log entry:', logError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create log entry' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Decrement credits for free users
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        ai_generations_remaining: remainingCredits - 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id);

    if (updateError) {
      console.error('❌ Error updating credits:', updateError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to update credits' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Credit used successfully:', {
      logId: logEntry.id,
      newCredits: remainingCredits - 1
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        log_id: logEntry.id,
        remaining: remainingCredits - 1,
        isPro: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Check and use AI generation error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
