
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
    const { message, messages, userProfile, chatHistory } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Ensure we have a proper message to process
    const userMessage = message || (messages && messages[messages.length - 1]?.content) || '';
    
    if (!userMessage.trim()) {
      throw new Error('No message provided');
    }

    console.log('Processing fitness chat request:', { 
      message: userMessage, 
      userProfile: userProfile ? { 
        id: userProfile.id, 
        age: userProfile.age, 
        gender: userProfile.gender,
        fitness_goal: userProfile.fitness_goal 
      } : null,
      historyLength: chatHistory?.length || 0
    });

    // Create comprehensive system message with user context
    const systemMessage = `You are FitGenie, an expert AI fitness and nutrition coach. You provide personalized, evidence-based advice with a friendly and motivational tone.

USER PROFILE:
- Age: ${userProfile?.age || 'Unknown'}, Gender: ${userProfile?.gender || 'Unknown'}
- Height: ${userProfile?.height || 'Unknown'}cm, Weight: ${userProfile?.weight || 'Unknown'}kg
- Fitness Goal: ${userProfile?.fitness_goal || 'general health'}
- Activity Level: ${userProfile?.activity_level || 'moderate'}
- Body Shape: ${userProfile?.body_shape || 'average'}
- Nationality: ${userProfile?.nationality || 'International'}
- Health Conditions: ${userProfile?.health_conditions?.join(', ') || 'None specified'}
- Allergies: ${userProfile?.allergies?.join(', ') || 'None specified'}

RESPONSE GUIDELINES:
1. Be conversational, supportive, and motivating
2. Provide actionable, specific advice
3. Use proper formatting with headers (##), bold text (**), and bullet points (-) for clarity
4. Consider cultural preferences for nutrition advice
5. Ask follow-up questions to better understand user needs
6. Reference previous conversation context when relevant
7. Break down complex information into digestible sections
8. Include practical tips and realistic expectations

Always format your responses with:
- Clear headings for different sections
- Bold text for key points
- Numbered or bulleted lists for steps/tips
- Encouraging and positive language`;

    // Build messages array with proper conversation history
    const finalMessages = messages || [
      { role: 'system', content: systemMessage },
      ...(chatHistory || []),
      { role: 'user', content: userMessage }
    ];

    console.log('🤖 Using multi-provider AI service for fitness chat...');

    // Use the enhanced AI service with multiple providers
    const aiService = new AIService(openAIApiKey, anthropicApiKey, googleApiKey);
    const response = await aiService.generate('fitness_chat', {
      messages: finalMessages,
      temperature: 0.7,
      maxTokens: 1500,
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
