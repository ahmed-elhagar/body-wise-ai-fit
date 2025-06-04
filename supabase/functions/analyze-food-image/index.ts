
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { AIService } from "../_shared/aiService.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to convert ArrayBuffer to base64 safely
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192; // Smaller chunk size
  let result = '';
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    // Convert chunk to string character by character to avoid apply limits
    let chunkString = '';
    for (let j = 0; j < chunk.length; j++) {
      chunkString += String.fromCharCode(chunk[j]);
    }
    result += chunkString;
  }
  
  return btoa(result);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== FOOD IMAGE ANALYSIS START ===');
    
    // Parse FormData from request
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    const userId = formData.get('userId') as string;

    if (!imageFile || !userId) {
      console.error('Missing image file or userId');
      throw new Error('Missing image file or userId');
    }

    console.log('User ID:', userId);
    console.log('Image file:', imageFile.name, 'Size:', imageFile.size);

    // Convert image file to base64 using safe method
    console.log('Converting image to base64...');
    const imageArrayBuffer = await imageFile.arrayBuffer();
    const base64Data = arrayBufferToBase64(imageArrayBuffer);
    const imageBase64 = `data:${imageFile.type};base64,${base64Data}`;
    console.log('Base64 conversion completed, length:', base64Data.length);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Enhanced prompt to match our unified database structure
    const prompt = `Analyze this food image and return ONLY a JSON object with this exact structure:

{
  "foodItems": [
    {
      "name": "exact food name",
      "category": "protein|vegetables|fruits|grains|dairy|nuts|beverages|snacks|general",
      "cuisine": "cuisine type",
      "calories": number_per_100g,
      "protein": number_per_100g,
      "carbs": number_per_100g,
      "fat": number_per_100g,
      "fiber": number_per_100g,
      "sugar": number_per_100g,
      "quantity": "estimated serving description"
    }
  ],
  "overallConfidence": 0.8,
  "cuisineType": "general",
  "suggestions": "brief analysis tips"
}

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON, no explanations
2. All nutrition values must be per 100g
3. Use exact category names from the list above
4. Include 1-5 food items maximum
5. Make realistic nutrition estimates
6. Confidence should be 0.1-1.0`;

    console.log('🤖 Using multi-provider AI service for food analysis...');

    // Use the enhanced AI service with multiple providers
    const aiService = new AIService(openAIApiKey, anthropicApiKey, googleApiKey);
    const response = await aiService.generate('food_analysis', {
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: imageBase64 }
            }
          ]
        }
      ],
      maxTokens: 1000,
      temperature: 0.1,
    });

    console.log('✅ AI response received');

    // Parse the analysis
    let analysis;
    try {
      const content = response.content.trim();
      console.log('Raw AI content:', content.substring(0, 500));
      
      // Clean up JSON response
      let cleanedContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      // Find JSON boundaries
      const firstBrace = cleanedContent.indexOf('{');
      const lastBrace = cleanedContent.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanedContent = cleanedContent.substring(firstBrace, lastBrace + 1);
      }
      
      analysis = JSON.parse(cleanedContent);
      console.log('✅ Parsed analysis:', analysis);
      
    } catch (parseError) {
      console.error('Failed to parse analysis:', parseError);
      throw new Error('Failed to parse AI analysis response');
    }

    // Store analyzed food items in the unified database
    if (analysis.foodItems && Array.isArray(analysis.foodItems)) {
      for (const foodItem of analysis.foodItems) {
        try {
          const { data: existingFood } = await supabase
            .from('food_items')
            .select('id')
            .eq('name', foodItem.name)
            .single();

          if (!existingFood) {
            await supabase
              .from('food_items')
              .insert({
                name: foodItem.name || 'Unknown Food',
                category: foodItem.category || 'general',
                cuisine_type: foodItem.cuisine || analysis.cuisineType || 'general',
                calories_per_100g: Number(foodItem.calories) || 0,
                protein_per_100g: Number(foodItem.protein) || 0,
                carbs_per_100g: Number(foodItem.carbs) || 0,
                fat_per_100g: Number(foodItem.fat) || 0,
                fiber_per_100g: Number(foodItem.fiber) || 0,
                sugar_per_100g: Number(foodItem.sugar) || 0,
                serving_size_g: 100,
                serving_description: foodItem.quantity || '100g serving',
                confidence_score: Number(analysis.overallConfidence) || 0.8,
                source: 'ai_scan',
                verified: false,
                created_by_user_id: userId,
                ai_generation_data: {
                  analysisDate: new Date().toISOString(),
                  confidence: analysis.overallConfidence,
                  cuisine: analysis.cuisineType
                }
              });
            console.log('✅ Stored food item:', foodItem.name);
          }
        } catch (dbError) {
          console.error('Error storing food item:', dbError);
          // Continue with other items even if one fails
        }
      }
    }

    console.log('✅ FOOD IMAGE ANALYSIS COMPLETE');

    return new Response(JSON.stringify({ 
      success: true,
      analysis: analysis
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== FOOD ANALYSIS FAILED ===');
    console.error('Error details:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Failed to analyze food image'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
