
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, userId } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Analyzing food image for user:', userId);

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
            content: `You are a professional nutritionist and food recognition expert. Analyze food images with high accuracy and provide detailed nutritional breakdowns.

IMPORTANT: 
- Be very precise with portion size estimates
- Consider cooking methods and preparation styles
- Account for hidden ingredients (oils, sauces, seasonings)
- Provide realistic calorie and macro estimates
- Always respond with valid JSON only, no markdown formatting`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this food image in detail. Identify each food item, estimate portions accurately, and provide comprehensive nutritional information. 

Return this exact JSON structure:
{
  "foodItems": [
    {
      "name": "specific food item name",
      "quantity": "estimated portion with unit",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "fiber": number,
      "sugar": number,
      "confidence": number (0-1)
    }
  ],
  "totalNutrition": {
    "calories": total_number,
    "protein": total_number,
    "carbs": total_number,
    "fat": total_number,
    "fiber": total_number,
    "sugar": total_number
  },
  "overallConfidence": number (0-1),
  "recommendations": "specific dietary advice based on this meal",
  "mealType": "breakfast/lunch/dinner/snack",
  "cuisineType": "cuisine identification"
}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Remove markdown formatting if present
    content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
    
    const analysis = JSON.parse(content);

    // Store each food item in the database for future reference
    if (analysis.foodItems && userId) {
      for (const foodItem of analysis.foodItems) {
        try {
          await supabase
            .from('food_database')
            .upsert({
              name: foodItem.name.toLowerCase(),
              calories_per_unit: foodItem.calories,
              protein_per_unit: foodItem.protein,
              carbs_per_unit: foodItem.carbs,
              fat_per_unit: foodItem.fat,
              fiber_per_unit: foodItem.fiber || 0,
              sugar_per_unit: foodItem.sugar || 0,
              unit_type: 'serving',
              source: 'ai_analysis',
              confidence_score: foodItem.confidence || analysis.overallConfidence || 0.8,
              cuisine_type: analysis.cuisineType || 'general',
              last_analyzed: new Date().toISOString()
            }, { 
              onConflict: 'name',
              ignoreDuplicates: false 
            });
        } catch (dbError) {
          console.error('Error storing food item:', foodItem.name, dbError);
        }
      }
    }

    return new Response(JSON.stringify({ 
      analysis: {
        ...analysis,
        imageData: imageBase64 // Include image for display
      }
    }), {
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
