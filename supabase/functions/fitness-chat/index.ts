import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AIService } from "../_shared/aiService.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userProfile, chatHistory } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing fitness chat request:', { 
      message, 
      userProfile: userProfile ? { 
        id: userProfile.id, 
        age: userProfile.age, 
        gender: userProfile.gender,
        fitness_goal: userProfile.fitness_goal 
      } : null,
      historyLength: chatHistory?.length || 0
    });

    // Use centralized prompt service
    console.log('🎯 Using centralized prompt service for fitness chat');
    
    // Import the service dynamically
    const { AIPromptService } = await import('../../../src/services/aiPromptService.ts');
    
    const userLanguage = userProfile?.preferred_language || 'en';
    const promptConfig = AIPromptService.getFitnessChatPrompt(userProfile, userLanguage);

    // Build messages array with proper conversation history
    const messages = [
      { role: 'system', content: promptConfig.systemMessage },
      ...(chatHistory || []),
      { role: 'user', content: message }
    ];

    console.log('🤖 Using multi-provider AI service for fitness chat with English-only prompts...');

    const aiService = new AIService(openAIApiKey, anthropicApiKey, googleApiKey);
    const response = await aiService.generate('fitness_chat', {
      messages: messages,
      temperature: promptConfig.temperature || 0.7,
      maxTokens: promptConfig.maxTokens || 1500,
    });

    return new Response(JSON.stringify({ 
      response: response.content,
      usage: response.usage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fitness chat:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to process chat request',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
