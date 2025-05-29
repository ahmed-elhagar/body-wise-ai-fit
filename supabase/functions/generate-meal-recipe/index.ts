
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mealId, userId } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('=== MEAL RECIPE GENERATION START ===');
    console.log('Meal ID:', mealId);
    console.log('User ID:', userId);

    // Get the meal from database
    const { data: meal, error: mealError } = await supabase
      .from('daily_meals')
      .select('*')
      .eq('id', mealId)
      .single();

    if (mealError || !meal) {
      throw new Error('Meal not found');
    }

    // Check if recipe already exists
    if (meal.recipe_fetched && meal.ingredients?.length > 0 && meal.instructions?.length > 0) {
      console.log('✅ Recipe already exists for meal:', meal.name);
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Recipe already available',
        meal: meal
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check user's recipe generation limit (max 10 per day)
    const today = new Date().toISOString().split('T')[0];
    const { data: todayLogs, error: logError } = await supabase
      .from('ai_generation_logs')
      .select('id')
      .eq('user_id', userId)
      .eq('generation_type', 'recipe')
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lte('created_at', `${today}T23:59:59.999Z`);

    if (logError) {
      console.error('Error checking generation logs:', logError);
    }

    const todayRecipeCount = todayLogs?.length || 0;
    if (todayRecipeCount >= 10) {
      throw new Error('Daily recipe generation limit reached (10 per day)');
    }

    console.log(`Generating detailed recipe for: ${meal.name} (${todayRecipeCount + 1}/10 today)`);

    // Generate detailed recipe with AI
    const prompt = `You are a professional chef. Generate a detailed recipe for "${meal.name}" with exactly ${meal.calories} calories and ${meal.servings} serving(s).

MEAL INFO:
- Name: ${meal.name}
- Calories: ${meal.calories}
- Protein: ${meal.protein}g
- Carbs: ${meal.carbs}g  
- Fat: ${meal.fat}g
- Prep Time: ${meal.prep_time} minutes
- Cook Time: ${meal.cook_time} minutes
- Servings: ${meal.servings}
- Cuisine: ${meal.cuisine || 'international'}

Generate ONLY valid JSON with detailed ingredients, instructions, and image generation prompt:

{
  "ingredients": [
    {
      "name": "ingredient name",
      "quantity": "100",
      "unit": "g",
      "calories": 50,
      "protein": 5,
      "carbs": 10,
      "fat": 2
    }
  ],
  "instructions": [
    "Step 1: Detailed preparation instruction",
    "Step 2: Cooking instruction with timing",
    "Step 3: Final plating and serving"
  ],
  "imagePrompt": "Professional food photography of ${meal.name}, beautifully plated, natural lighting, appetizing presentation",
  "youtubeSearchTerm": "${meal.name} recipe cooking tutorial",
  "tips": "Chef tips for best results",
  "nutritionBenefits": "Health benefits of this meal"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional chef. Generate detailed recipes in JSON format only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    // Parse recipe data
    let recipeData;
    try {
      const content = data.choices[0].message.content.trim();
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      recipeData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse recipe response:', parseError);
      throw new Error('Failed to parse AI recipe response');
    }

    // Generate meal image using the image prompt
    let imageUrl = null;
    try {
      const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: recipeData.imagePrompt || `Professional food photography of ${meal.name}, beautifully plated`,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          style: 'natural'
        }),
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        imageUrl = imageData.data[0].url;
        console.log('✅ Image generated for meal:', meal.name);
      }
    } catch (imageError) {
      console.error('Image generation failed:', imageError);
      // Continue without image
    }

    // Update meal with detailed recipe
    const { error: updateError } = await supabase
      .from('daily_meals')
      .update({
        ingredients: recipeData.ingredients || [],
        instructions: recipeData.instructions || [],
        youtube_search_term: recipeData.youtubeSearchTerm || `${meal.name} recipe`,
        image_url: imageUrl,
        recipe_fetched: true
      })
      .eq('id', mealId);

    if (updateError) {
      throw new Error('Failed to update meal with recipe data');
    }

    // Log the generation
    await supabase
      .from('ai_generation_logs')
      .insert({
        user_id: userId,
        generation_type: 'recipe',
        prompt_data: { meal_name: meal.name, meal_id: mealId },
        response_data: { recipe_generated: true, image_generated: !!imageUrl },
        status: 'success'
      });

    console.log('✅ Recipe generated and saved for:', meal.name);

    return new Response(JSON.stringify({ 
      success: true,
      message: `Recipe generated for ${meal.name}`,
      recipeCount: todayRecipeCount + 1,
      dailyLimit: 10
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== RECIPE GENERATION FAILED ===');
    console.error('Error details:', error);
    
    // Log the error
    if (req.body) {
      try {
        const { userId } = await req.json();
        await supabase
          .from('ai_generation_logs')
          .insert({
            user_id: userId,
            generation_type: 'recipe',
            prompt_data: { error: true },
            status: 'failed',
            error_message: error.message
          });
      } catch (logError) {
        console.error('Failed to log error:', logError);
      }
    }

    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Failed to generate recipe'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
