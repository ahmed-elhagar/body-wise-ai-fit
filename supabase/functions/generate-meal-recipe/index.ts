
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

    console.log('=== ENHANCED MEAL RECIPE GENERATION START ===');
    console.log('Meal ID:', mealId);
    console.log('User ID:', userId);
    console.log('Language:', language);

    // Enhanced meal fetching with caching check
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

    // Enhanced recipe caching - check if recipe already exists and is complete
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

    // Check for similar recipes in database to avoid duplicate AI calls
    const { data: similarMeal, error: similarError } = await supabase
      .from('daily_meals')
      .select('ingredients, instructions, youtube_search_term, image_url')
      .eq('name', meal.name)
      .eq('recipe_fetched', true)
      .not('ingredients', 'is', null)
      .not('instructions', 'is', null)
      .limit(1)
      .maybeSingle();

    if (!similarError && similarMeal) {
      console.log('🔄 Found similar recipe, using cached version for:', meal.name);
      
      // Update current meal with cached recipe data
      const { error: updateError } = await supabase
        .from('daily_meals')
        .update({
          ingredients: similarMeal.ingredients,
          instructions: similarMeal.instructions,
          youtube_search_term: similarMeal.youtube_search_term,
          image_url: similarMeal.image_url,
          recipe_fetched: true
        })
        .eq('id', mealId);

      if (updateError) {
        console.error('Failed to update meal with cached recipe:', updateError);
      } else {
        return new Response(JSON.stringify({ 
          success: true,
          message: 'Recipe loaded from cache',
          cached: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Enhanced rate limiting check
    const { data: rateLimitCheck } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle();

    const isPro = !!rateLimitCheck;
    
    if (!isPro) {
      // Check daily recipe generation limit for free users
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
      const dailyLimit = 10;
      
      if (todayRecipeCount >= dailyLimit) {
        throw new Error('Daily recipe generation limit reached (10 per day)');
      }
    }

    console.log(`🔄 Generating detailed recipe for: ${meal.name} ${isPro ? '(Pro User)' : `(${(todayLogs?.length || 0) + 1}/10 today)`} in ${language}`);

    // Enhanced AI recipe generation
    const recipeData = await generateEnhancedRecipe(meal, language, openAIApiKey);

    // Enhanced image generation with retry logic
    let imageUrl = null;
    try {
      imageUrl = await generateMealImageWithRetry(meal.name, recipeData.imagePrompt, openAIApiKey);
    } catch (imageError) {
      console.error('Image generation failed:', imageError);
      // Continue without image
    }

    // Enhanced database update with validation
    console.log('💾 Saving enhanced recipe to database...');
    
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

    // Enhanced logging
    await supabase
      .from('ai_generation_logs')
      .insert({
        user_id: userId,
        generation_type: 'meal_plan',
        prompt_data: { 
          meal_name: meal.name, 
          meal_id: mealId, 
          language: language,
          action: 'recipe_generation',
          cached: false
        },
        response_data: { 
          recipe_generated: true, 
          image_generated: !!imageUrl,
          ingredients_count: recipeData.ingredients?.length || 0,
          instructions_count: recipeData.instructions?.length || 0
        },
        status: 'completed',
        credits_used: isPro ? 0 : 1
      });

    console.log('✅ Enhanced recipe generation complete');
    console.log('=== ENHANCED MEAL RECIPE GENERATION COMPLETE ===');

    return new Response(JSON.stringify({ 
      success: true,
      message: `Recipe generated for ${meal.name}`,
      recipeCount: isPro ? -1 : (todayLogs?.length || 0) + 1,
      dailyLimit: isPro ? -1 : 10,
      imageGenerated: !!imageUrl,
      isPro: isPro
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== ENHANCED RECIPE GENERATION FAILED ===');
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

// Enhanced recipe generation function
const generateEnhancedRecipe = async (meal: any, language: string, openAIApiKey: string) => {
  const isArabic = language === 'ar';
  const systemPrompt = isArabic 
    ? 'أنت طاهٍ محترف متخصص. قم بإنشاء وصفات مفصلة وعالية الجودة باللغة العربية بتنسيق JSON فقط.'
    : 'You are a professional chef specialist. Generate detailed, high-quality recipes in JSON format only.';

  const userPrompt = isArabic 
    ? `أنت طاهٍ محترف. قم بإنشاء وصفة مفصلة وعالية الجودة لـ "${meal.name}" تحتوي على ${meal.calories} سعرة حرارية بالضبط و ${meal.servings} حصة.

معلومات الوجبة:
- الاسم: ${meal.name}
- السعرات الحرارية: ${meal.calories}
- البروتين: ${meal.protein}جم
- الكربوهيدرات: ${meal.carbs}جم  
- الدهون: ${meal.fat}جم
- وقت التحضير: ${meal.prep_time} دقيقة
- وقت الطبخ: ${meal.cook_time} دقيقة
- عدد الحصص: ${meal.servings}

أنشئ JSON صحيح مع مكونات مفصلة ومحددة وتعليمات واضحة خطوة بخطوة:

{
  "ingredients": [
    {
      "name": "اسم المكون المحدد",
      "quantity": "100",
      "unit": "جم"
    }
  ],
  "instructions": [
    "الخطوة 1: تعليمات التحضير المفصلة والواضحة",
    "الخطوة 2: تعليمات الطبخ مع التوقيت المحدد",
    "الخطوة 3: التقديم النهائي والتزيين"
  ],
  "imagePrompt": "تصوير طعام احترافي لـ ${meal.name}، مقدم بشكل جميل، إضاءة طبيعية، عرض شهي، جودة عالية",
  "youtubeSearchTerm": "${meal.name} وصفة طبخ تعليمي",
  "tips": "نصائح الطاهي المحترف للحصول على أفضل النتائج وتجنب الأخطاء الشائعة"
}`
    : `You are a professional chef. Generate a detailed, high-quality recipe for "${meal.name}" with exactly ${meal.calories} calories and ${meal.servings} serving(s).

MEAL INFO:
- Name: ${meal.name}
- Calories: ${meal.calories}
- Protein: ${meal.protein}g
- Carbs: ${meal.carbs}g  
- Fat: ${meal.fat}g
- Prep Time: ${meal.prep_time} minutes
- Cook Time: ${meal.cook_time} minutes
- Servings: ${meal.servings}

Generate ONLY valid JSON with detailed, specific ingredients and clear step-by-step instructions:

{
  "ingredients": [
    {
      "name": "specific ingredient name",
      "quantity": "100",
      "unit": "g"
    }
  ],
  "instructions": [
    "Step 1: Detailed preparation instruction with specifics",
    "Step 2: Cooking instruction with precise timing",
    "Step 3: Final plating and serving instructions"
  ],
  "imagePrompt": "Professional food photography of ${meal.name}, beautifully plated, natural lighting, appetizing presentation, high quality",
  "youtubeSearchTerm": "${meal.name} recipe cooking tutorial",
  "tips": "Professional chef tips for best results and common mistakes to avoid"
}`;

  console.log('🤖 Sending enhanced request to OpenAI API...');

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
      temperature: 0.2,
      max_tokens: 2000,
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

  // Enhanced parsing with validation
  try {
    const content = data.choices[0].message.content.trim();
    const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const recipeData = JSON.parse(cleanedContent);
    
    // Validate required fields
    if (!recipeData.ingredients || !Array.isArray(recipeData.ingredients)) {
      throw new Error('Invalid ingredients format');
    }
    
    if (!recipeData.instructions || !Array.isArray(recipeData.instructions)) {
      throw new Error('Invalid instructions format');
    }
    
    console.log('✅ Enhanced recipe data parsed and validated successfully');
    return recipeData;
  } catch (parseError) {
    console.error('Failed to parse recipe response:', parseError);
    console.error('Raw content:', data.choices[0].message.content);
    throw new Error('Failed to parse AI recipe response');
  }
};

// Enhanced image generation with retry logic
const generateMealImageWithRetry = async (mealName: string, imagePrompt: string, openAIApiKey: string, maxRetries: number = 2): Promise<string | null> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🎨 Generating recipe image (attempt ${attempt}/${maxRetries})...`);
      
      const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: imagePrompt || `Professional food photography of ${mealName}, beautifully plated, natural lighting, appetizing presentation, high quality`,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          style: 'natural'
        }),
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        const imageUrl = imageData.data[0].url;
        console.log('✅ Enhanced image generated successfully');
        return imageUrl;
      } else {
        const errorText = await imageResponse.text();
        console.warn(`Image generation attempt ${attempt} failed:`, errorText);
        
        if (attempt === maxRetries) {
          throw new Error(`All image generation attempts failed: ${errorText}`);
        }
      }
    } catch (imageError) {
      console.error(`Image generation attempt ${attempt} error:`, imageError);
      
      if (attempt === maxRetries) {
        throw imageError;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  return null;
};
