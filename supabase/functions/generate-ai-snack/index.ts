
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userProfile, day, calories, weeklyPlanId, language = 'en' } = await req.json();
    
    console.log('🍎 Generate AI Snack - Enhanced Request:', { 
      userProfile: userProfile ? 'provided' : 'missing',
      day, 
      calories, 
      weeklyPlanId, 
      language 
    });

    if (!day || !calories || !weeklyPlanId || !userProfile) {
      return new Response(
        JSON.stringify({ 
          error: language === 'ar' ? 'بيانات غير مكتملة' : 'Missing required data',
          success: false 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get AI model configuration for snack generation feature
    let modelConfig = { modelId: 'gpt-4o-mini', provider: 'openai' }; // fallback
    
    try {
      const { data: modelData, error: modelError } = await supabase
        .from('ai_feature_models')
        .select(`
          primary_model:ai_models!primary_model_id(
            model_id,
            provider,
            is_active
          )
        `)
        .eq('feature_name', 'snack_generation')
        .eq('is_active', true)
        .single();

      if (!modelError && modelData?.primary_model) {
        const model = modelData.primary_model as any;
        if (model.is_active) {
          modelConfig = {
            modelId: model.model_id,
            provider: model.provider
          };
        }
      }
    } catch (error) {
      console.log('📋 Using fallback AI model for snack generation:', error);
    }

    console.log('🤖 Using AI model configuration:', modelConfig);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const isArabic = language === 'ar';
    
    // Enhanced AI prompt for snack generation
    const systemPrompt = isArabic 
      ? 'أنت خبير تغذية متخصص في إنشاء وجبات خفيفة صحية ومتوازنة. قم بالرد بتنسيق JSON فقط.'
      : 'You are a nutrition expert specialized in creating healthy and balanced snacks. Respond in JSON format only.';

    const userPrompt = `Generate a healthy snack for ${calories} calories. User profile:
- Age: ${userProfile.age}, Gender: ${userProfile.gender}
- Fitness Goal: ${userProfile.fitness_goal}
- Allergies: ${userProfile.allergies?.join(', ') || 'None'}
- Dietary Restrictions: ${userProfile.dietary_restrictions?.join(', ') || 'None'}
- Nationality: ${userProfile.nationality || 'International'}

Generate a snack in ${isArabic ? 'Arabic' : 'English'} that:
1. Matches the calorie target (±50 calories)
2. Considers cultural preferences based on nationality
3. Avoids all listed allergens and dietary restrictions
4. Is practical and easy to prepare
5. Provides balanced nutrition

Return ONLY a JSON object with this exact structure:
{
  "name": "snack name in ${language}",
  "ingredients": [{"name": "ingredient", "quantity": "amount", "unit": "unit"}],
  "instructions": ["step 1", "step 2"],
  "calories": ${calories},
  "protein": estimated_grams,
  "carbs": estimated_grams,
  "fat": estimated_grams
}`;

    console.log('🤖 Calling OpenAI with model:', modelConfig.modelId);

    // Use the configured AI model
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelConfig.modelId,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      console.error('❌ OpenAI API error:', response.status, response.statusText);
      if (response.status === 429) {
        throw new Error(isArabic ? 'تم تجاوز حد الطلبات. حاول مرة أخرى لاحقاً.' : 'Rate limit exceeded. Try again later.');
      }
      throw new Error(isArabic ? 'خطأ في الذكاء الاصطناعي' : 'AI service error');
    }

    const data = await response.json();
    console.log('✅ AI response received successfully');

    // Enhanced parsing with better error handling
    let snackData;
    try {
      const content = data.choices?.[0]?.message?.content?.trim();
      if (!content) {
        throw new Error('Empty AI response');
      }

      const cleanedContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      snackData = JSON.parse(cleanedContent);
      
      // Validate required fields
      if (!snackData.name || !snackData.ingredients || !Array.isArray(snackData.ingredients)) {
        throw new Error('Invalid snack data structure');
      }

    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError);
      
      // Enhanced fallback snacks based on language and nationality
      const fallbackSnacks = isArabic ? [
        { 
          name: 'لوز وتمر صحي', 
          ingredients: [
            { name: 'لوز محمص', quantity: '20', unit: 'جرام' },
            { name: 'تمر طبيعي', quantity: '2', unit: 'حبة' }
          ],
          instructions: ['اخلط اللوز مع التمر', 'استمتع بوجبة خفيفة صحية']
        },
        {
          name: 'زبادي بالعسل والمكسرات',
          ingredients: [
            { name: 'زبادي يوناني', quantity: '100', unit: 'جرام' },
            { name: 'عسل طبيعي', quantity: '1', unit: 'ملعقة صغيرة' },
            { name: 'جوز', quantity: '10', unit: 'جرام' }
          ],
          instructions: ['اخلط الزبادي مع العسل', 'أضف المكسرات واستمتع']
        }
      ] : [
        { 
          name: 'Apple with Almond Butter', 
          ingredients: [
            { name: 'Apple', quantity: '1', unit: 'medium' },
            { name: 'Almond butter', quantity: '1', unit: 'tablespoon' }
          ],
          instructions: ['Slice the apple', 'Serve with almond butter for dipping']
        },
        {
          name: 'Greek Yogurt with Berries',
          ingredients: [
            { name: 'Greek yogurt', quantity: '100', unit: 'grams' },
            { name: 'Mixed berries', quantity: '50', unit: 'grams' },
            { name: 'Honey', quantity: '1', unit: 'teaspoon' }
          ],
          instructions: ['Mix yogurt with honey', 'Top with fresh berries']
        }
      ];
      
      snackData = fallbackSnacks[0];
      snackData.calories = calories;
      snackData.protein = Math.round(calories * 0.15 / 4);
      snackData.carbs = Math.round(calories * 0.55 / 4);
      snackData.fat = Math.round(calories * 0.30 / 9);
    }

    // Prepare snack data for database with enhanced validation - fix meal_type to use valid enum
    const finalSnackData = {
      weekly_plan_id: weeklyPlanId,
      day_number: day,
      meal_type: 'snack', // Use valid enum value instead of 'snack1'
      name: snackData.name,
      calories: Math.min(snackData.calories || calories, calories + 50),
      protein: Math.max(snackData.protein || Math.round(calories * 0.15 / 4), 1),
      carbs: Math.max(snackData.carbs || Math.round(calories * 0.55 / 4), 1),
      fat: Math.max(snackData.fat || Math.round(calories * 0.30 / 9), 1),
      prep_time: 5,
      cook_time: 0,
      servings: 1,
      image_url: '/api/placeholder/300/200',
      ingredients: snackData.ingredients || [],
      instructions: snackData.instructions || []
    };

    console.log('💾 Saving AI-generated snack to database:', finalSnackData);

    // Save to database with better error handling
    const { data: savedSnack, error: dbError } = await supabase
      .from('daily_meals')
      .insert([finalSnackData])
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      return new Response(
        JSON.stringify({ 
          error: isArabic ? 'خطأ في حفظ الوجبة الخفيفة' : 'Failed to save snack',
          success: false,
          details: dbError.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('✅ AI snack saved successfully:', savedSnack);

    const successMessage = isArabic ? 'تم إضافة الوجبة الخفيفة بنجاح!' : 'AI snack added successfully!';

    return new Response(
      JSON.stringify({ 
        success: true,
        snack: savedSnack,
        message: successMessage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Generate AI Snack - Enhanced Error:', error);
    
    const isArabic = language === 'ar';
    const errorMessage = isArabic ? 'فشل في توليد الوجبة الخفيفة' : 'Failed to generate snack';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false,
        details: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
