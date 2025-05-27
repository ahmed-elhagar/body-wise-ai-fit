
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
    const { imageBase64, imageUrl } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a nutrition expert. Analyze food images and provide detailed nutritional information. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this food image and provide detailed nutritional information. Return JSON with this structure:
                {
                  "foodItems": [
                    {
                      "name": "food item name",
                      "quantity": "estimated portion",
                      "calories": number,
                      "protein": number,
                      "carbs": number,
                      "fat": number,
                      "fiber": number,
                      "sugar": number
                    }
                  ],
                  "totalNutrition": {
                    "calories": number,
                    "protein": number,
                    "carbs": number,
                    "fat": number,
                    "fiber": number,
                    "sugar": number
                  },
                  "confidence": number (0-1),
                  "recommendations": "brief healthy eating tips"
                }`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64 || imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error analyzing food image:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
