
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
    const { mealId, userId, language = 'en', mealData } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!mealId || !userId) {
      throw new Error('Meal ID and User ID are required');
    }

    console.log('=== MEAL RECIPE GENERATION START ===');
    console.log('Meal ID:', mealId);
    console.log('User ID:', userId);
    console.log('Language:', language);

    // Get the meal from database
    const { data: meal, error: mealError } = await supabase
      .from('daily_meals')
      .select('*')
      .eq('id', mealId)
      .single();

    if (mealError || !meal) {
      console.error('Meal fetch error:', mealError);
      throw new Error('Meal not found');
    }

    console.log('📊 Current meal data:', {
      name: meal.name,
      recipe_fetched: meal.recipe_fetched,
      has_ingredients: meal.ingredients?.length > 0,
      has_instructions: meal.instructions?.length > 0
    });

    // Check if recipe already exists and is complete
    if (meal.recipe_fetched && 
        meal.ingredients?.length > 0 && 
        meal.instructions?.length > 0) {
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
      .eq('generation_type', 'meal_plan')
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lte('created_at', `${today}T23:59:59.999Z`);

    if (logError) {
      console.error('Error checking generation logs:', logError);
    }

    const todayRecipeCount = todayLogs?.length || 0;
    if (todayRecipeCount >= 10) {
      throw new Error('Daily recipe generation limit reached (10 per day)');
    }

    console.log(`🔄 Generating detailed recipe for: ${meal.name} (${todayRecipeCount + 1}/10 today) in ${language}`);

    // Language-aware prompt generation
    const isArabic = language === 'ar';
    const systemPrompt = isArabic 
      ? 'أنت طاهٍ محترف متخصص. قم بإنشاء وصفات مفصلة باللغة العربية بتنسيق JSON فقط.'
      : 'You are a professional chef specialist. Generate detailed recipes in JSON format only.';

    const userPrompt = isArabic 
      ? `أنت طاهٍ محترف. قم بإنشاء وصفة مفصلة لـ "${meal.name}" تحتوي على ${meal.calories} سعرة حرارية بالضبط و ${meal.servings} حصة.

معلومات الوجبة:
- الاسم: ${meal.name}
- السعرات الحرارية: ${meal.calories}
- البروتين: ${meal.protein}جم
- الكربوهيدرات: ${meal.carbs}جم  
- الدهون: ${meal.fat}جم
- وقت التحضير: ${meal.prep_time} دقيقة
- وقت الطبخ: ${meal.cook_time} دقيقة
- عدد الحصص: ${meal.servings}

أنشئ JSON صحيح فقط مع مكونات مفصلة وتعليمات وموجه لإنشاء الصورة:

{
  "ingredients": [
    {
      "name": "اسم المكون",
      "quantity": "100",
      "unit": "جم"
    }
  ],
  "instructions": [
    "الخطوة 1: تعليمات التحضير المفصلة",
    "الخطوة 2: تعليمات الطبخ مع التوقيت",
    "الخطوة 3: التقديم النهائي"
  ],
  "imagePrompt": "تصوير طعام احترافي لـ ${meal.name}، مقدم بشكل جميل، إضاءة طبيعية، عرض شهي",
  "youtubeSearchTerm": "${meal.name} وصفة طبخ تعليمي",
  "tips": "نصائح الطاهي للحصول على أفضل النتائج"
}`
      : `You are a professional chef. Generate a detailed recipe for "${meal.name}" with exactly ${meal.calories} calories and ${meal.servings} serving(s).

MEAL INFO:
- Name: ${meal.name}
- Calories: ${meal.calories}
- Protein: ${meal.protein}g
- Carbs: ${meal.carbs}g  
- Fat: ${meal.fat}g
- Prep Time: ${meal.prep_time} minutes
- Cook Time: ${meal.cook_time} minutes
- Servings: ${meal.servings}

Generate ONLY valid JSON with detailed ingredients and instructions:

{
  "ingredients": [
    {
      "name": "ingredient name",
      "quantity": "100",
      "unit": "g"
    }
  ],
  "instructions": [
    "Step 1: Detailed preparation instruction",
    "Step 2: Cooking instruction with timing",
    "Step 3: Final plating and serving"
  ],
  "imagePrompt": "Professional food photography of ${meal.name}, beautifully plated, natural lighting, appetizing presentation",
  "youtubeSearchTerm": "${meal.name} recipe cooking tutorial",
  "tips": "Chef tips for best results"
}`;

    console.log('🤖 Sending request to OpenAI API...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response:', data);
      throw new Error('Invalid response from OpenAI API');
    }

    // Parse recipe data
    let recipeData;
    try {
      const content = data.choices[0].message.content.trim();
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      recipeData = JSON.parse(cleanedContent);
      console.log('✅ Recipe data parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse recipe response:', parseError);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse AI recipe response');
    }

    // Generate meal image using DALL-E 3
    let imageUrl = null;
    try {
      console.log('🎨 Generating recipe image...');
      const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: recipeData.imagePrompt || `Professional food photography of ${meal.name}, beautifully plated, natural lighting, appetizing presentation`,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          style: 'natural'
        }),
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        imageUrl = imageData.data[0].url;
        console.log('✅ Image generated successfully');
      } else {
        console.warn('Image generation failed:', await imageResponse.text());
      }
    } catch (imageError) {
      console.error('Image generation failed:', imageError);
      // Continue without image
    }

    // Update meal with detailed recipe in database
    console.log('💾 Saving recipe to database...');
    
    const updateData = {
      ingredients: recipeData.ingredients || [],
      instructions: recipeData.instructions || [],
      youtube_search_term: recipeData.youtubeSearchTerm || `${meal.name} recipe cooking tutorial`,
      recipe_fetched: true
    };

    if (imageUrl) {
      updateData.image_url = imageUrl;
    }

    const { error: updateError } = await supabase
      .from('daily_meals')
      .update(updateData)
      .eq('id', mealId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error('Failed to update meal with recipe data');
    }

    console.log('✅ Recipe saved to database successfully');

    // Log the successful generation
    await supabase
      .from('ai_generation_logs')
      .insert({
        user_id: userId,
        generation_type: 'meal_plan',
        prompt_data: { 
          meal_name: meal.name, 
          meal_id: mealId, 
          language: language,
          action: 'recipe_generation'
        },
        response_data: { 
          recipe_generated: true, 
          image_generated: !!imageUrl,
          ingredients_count: recipeData.ingredients?.length || 0,
          instructions_count: recipeData.instructions?.length || 0
        },
        status: 'completed'
      });

    console.log('✅ Generation logged successfully');
    console.log('=== MEAL RECIPE GENERATION COMPLETE ===');

    return new Response(JSON.stringify({ 
      success: true,
      message: `Recipe generated for ${meal.name}`,
      recipeCount: todayRecipeCount + 1,
      dailyLimit: 10,
      imageGenerated: !!imageUrl
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== RECIPE GENERATION FAILED ===');
    console.error('Error details:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Failed to generate recipe'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
