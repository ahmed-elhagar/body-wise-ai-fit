
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log("Processing chat request:", { message, userProfile });
    
    // Build conversation history for context
    const messages = [
      { 
        role: 'system', 
        content: `You are FitGenie, an AI fitness and nutrition coach. You have access to the user's profile:
        - Age: ${userProfile?.age || 'Unknown'}, Gender: ${userProfile?.gender || 'Unknown'}
        - Height: ${userProfile?.height || 'Unknown'}cm, Weight: ${userProfile?.weight || 'Unknown'}kg
        - Fitness Goal: ${userProfile?.fitness_goal || 'Unknown'}
        - Activity Level: ${userProfile?.activity_level || 'Unknown'}
        - Body Shape: ${userProfile?.body_shape || 'Unknown'}
        - Health Conditions: ${userProfile?.health_conditions?.join(', ') || 'None'}
        - Allergies: ${userProfile?.allergies?.join(', ') || 'None'}
        
        Provide personalized, evidence-based advice on fitness, nutrition, and wellness. Be encouraging, motivational, and practical. Keep responses concise but helpful.`
      }
    ];
    
    // Add message history if available
    if (chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0) {
      const formattedHistory = chatHistory.slice(-10).map(chat => {
        if (chat.message_type === 'user') {
          return { role: 'user', content: chat.message || '' };
        } else {
          return { role: 'assistant', content: chat.response || '' };
        }
      });
      messages.push(...formattedHistory);
    }
    
    // Add current user message
    messages.push({ role: 'user', content: message });

    console.log("Sending messages to OpenAI:", JSON.stringify(messages));

    // Use a smaller model to avoid quota limits
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Use a smaller model that's less likely to hit rate limits
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received response from OpenAI:", data);
    
    // Properly check for the existence of data before accessing properties
    if (!data || !data.choices || data.choices.length === 0 || !data.choices[0].message) {
      throw new Error('Invalid response structure from OpenAI');
    }
    
    const assistantResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: assistantResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fitness chat:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.toString() 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
