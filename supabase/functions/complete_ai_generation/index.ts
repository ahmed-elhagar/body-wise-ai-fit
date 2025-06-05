
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

    const { log_id, response_data = {}, error_message = null } = await req.json();

    if (!log_id) {
      return new Response(
        JSON.stringify({ error: 'Missing log_id parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🏁 Completing generation log:', log_id);

    const updateData: any = {
      status: error_message ? 'failed' : 'completed'
    };

    if (response_data && Object.keys(response_data).length > 0) {
      updateData.response_data = response_data;
    }

    if (error_message) {
      updateData.error_message = error_message;
    }

    const { error } = await supabase
      .from('ai_generation_logs')
      .update(updateData)
      .eq('id', log_id);

    if (error) {
      console.error('❌ Error completing generation log:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to complete generation log' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Generation log completed successfully');

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Complete AI generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
