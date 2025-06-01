
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { AIService } from "../_shared/aiService.ts";

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
    
    console.log('🍎 Generate AI Snack - Request data:', { 
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

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const isArabic = language === 'ar';
    
    // Create a smarter AI prompt for snack generation
    const prompt = `Generate a healthy snack for ${calories} calories. User profile:
- Age: ${userProfile.age}, Gender: ${userProfile.gender}
- Fitness Goal: ${userProfile.fitness_goal}
- Allergies: ${userProfile.allergies?.join(', ') || 'None'}
- Dietary Restrictions: ${userProfile.dietary_restrictions?.join(', ') || 'None'}
- Nationality: ${userProfile.nationality || 'International'}

Generate a snack in ${isArabic ? 'Arabic' : 'English'} that:
1. Matches the calorie target (±50 calories)
2. Considers cultural preferences
3. Avoids allergens and dietary restrictions
4. Is practical and easy to prepare

Return ONLY a JSON object:
{
  "name": "snack name in ${language}",
  "ingredients": [{"name": "ingredient", "quantity": "amount", "unit": "unit"}],
  "instructions": ["step 1", "step 2"],
  "calories": ${calories},
  "protein": estimated_grams,
  "carbs": estimated_grams,
  "fat": estimated_grams
}`;

    console.log('🤖 Using multi-provider AI service for snack generation...');

    // Use the enhanced AI service with multiple providers
    const aiService = new AIService(openAIApiKey, anthropicApiKey, googleApiKey);
    const response = await aiService.generate('snack_generation', {
      messages: [
        { role: 'system', content: 'You are a nutritionist AI. Generate healthy snacks based on user requirements. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      maxTokens: 800,
    });

    console.log('✅ AI snack response received');

    // Parse AI response
    let snackData;
    try {
      const cleanedContent = response.content.trim()
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '');
      snackData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI snack response:', parseError);
      // Fallback to pre-defined snacks
      const fallbackSnacks = isArabic ? [
        { 
          name: 'لوز وتمر', 
          ingredients: [
            { name: 'لوز', quantity: '20', unit: 'جرام' },
            { name: 'تمر', quantity: '2', unit: 'حبة' }
          ],
          instructions: ['اخلط اللوز مع التمر واستمتع']
        }
      ] : [
        { 
          name: 'Apple with Almonds', 
          ingredients: [
            { name: 'Apple', quantity: '1', unit: 'medium' },
            { name: 'Almonds', quantity: '15', unit: 'pieces' }
          ],
          instructions: ['Slice apple and enjoy with almonds']
        }
      ];
      
      snackData = fallbackSnacks[0];
      snackData.calories = calories;
      snackData.protein = Math.round(calories * 0.15 / 4);
      snackData.carbs = Math.round(calories * 0.55 / 4);
      snackData.fat = Math.round(calories * 0.30 / 9);
    }

    // Prepare snack data for database
    const finalSnackData = {
      weekly_plan_id: weeklyPlanId,
      day_number: day,
      meal_type: 'snack',
      name: snackData.name,
      calories: snackData.calories || calories,
      protein: snackData.protein || Math.round(calories * 0.15 / 4),
      carbs: snackData.carbs || Math.round(calories * 0.55 / 4),
      fat: snackData.fat || Math.round(calories * 0.30 / 9),
      prep_time: 5,
      cook_time: 0,
      servings: 1,
      image_url: '/api/placeholder/300/200',
      ingredients: snackData.ingredients || [],
      instructions: snackData.instructions || []
    };

    console.log('🍎 Saving AI-generated snack to database:', finalSnackData);

    // Save to database
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
    console.error('❌ Generate AI Snack - Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        success: false,
        details: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
