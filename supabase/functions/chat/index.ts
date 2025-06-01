
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AIService } from "../_shared/aiService.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    console.log('🤖 Processing GENERAL AI CHAT request with', messages.length, 'messages');
    console.log('🔑 Available API keys:', { 
      openai: !!openAIApiKey, 
      anthropic: !!anthropicApiKey, 
      google: !!googleApiKey 
    });

    // Use the enhanced AI service with multiple providers for 'chat' feature
    const aiService = new AIService(openAIApiKey, anthropicApiKey, googleApiKey);
    const response = await aiService.generate('chat', {
      messages: messages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    console.log('✅ General AI Chat response generated successfully');

    return new Response(JSON.stringify({ 
      response: response.content,
      usage: response.usage,
      feature: 'chat' // For debugging
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in general chat function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      details: 'Check Edge Function logs for more details',
      feature: 'chat'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
