
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

    console.log('Processing chat request:', { 
      message, 
      userProfile: userProfile ? { 
        id: userProfile.id, 
        age: userProfile.age, 
        gender: userProfile.gender,
        fitness_goal: userProfile.fitness_goal 
      } : null 
    });

    // Create system message with user context
    const systemMessage = `You are FitGenie, an AI fitness and nutrition coach. You have access to the user's profile:
        - Age: ${userProfile?.age || 'Unknown'}, Gender: ${userProfile?.gender || 'Unknown'}
        - Height: ${userProfile?.height || 'Unknown'}cm, Weight: ${userProfile?.weight || 'Unknown'}kg
        - Fitness Goal: ${userProfile?.fitness_goal || 'general health'}
        - Activity Level: ${userProfile?.activity_level || 'moderate'}
        - Body Shape: ${userProfile?.body_shape || 'average'}
        - Nationality: ${userProfile?.nationality || 'International'}
        - Health Conditions: ${userProfile?.health_conditions?.join(', ') || 'None'}
        - Allergies: ${userProfile?.allergies?.join(', ') || 'None'}
        
        Provide personalized, evidence-based advice on fitness, nutrition, and wellness. Be encouraging, motivational, and practical. Keep responses concise but helpful. Consider cultural preferences when giving nutrition advice.`;

    // Build messages array
    const messages = [
      { role: 'system', content: systemMessage },
      ...(chatHistory || []),
      { role: 'user', content: message }
    ];

    console.log('Sending messages to OpenAI:', messages);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please try again in a few minutes.');
      } else if (response.status === 401) {
        throw new Error('OpenAI API key is invalid. Please check your API key configuration.');
      } else {
        throw new Error(`OpenAI API error: ${response.status}`);
      }
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response from OpenAI API');
    }

    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      usage: data.usage 
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
