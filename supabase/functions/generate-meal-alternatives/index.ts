
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { currentMeal, userProfile, preferences, language = 'en' } = await req.json();
    
    console.log('🔄 Generating meal alternatives for:', currentMeal.name);

    // First, try to find similar meals from database
    const calorieRange = 100; // ±100 calories
    const minCalories = currentMeal.calories - calorieRange;
    const maxCalories = currentMeal.calories + calorieRange;

    const { data: existingMeals, error: dbError } = await supabase
      .from('daily_meals')
      .select('*')
      .gte('calories', minCalories)
      .lte('calories', maxCalories)
      .neq('id', currentMeal.id)
      .limit(5);

    if (dbError) {
      console.error('Database query error:', dbError);
    }

    const dbAlternatives = existingMeals?.map(meal => ({
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      reason: language === 'ar' ? 
        `وجبة مشابهة من قاعدة البيانات (${meal.calories} سعرة حرارية)` :
        `Similar meal from database (${meal.calories} calories)`,
      ingredients: meal.ingredients || [],
      instructions: meal.instructions || [],
      prepTime: meal.prep_time || 15,
      cookTime: meal.cook_time || 15,
      servings: meal.servings || 1,
      source: 'database'
    })) || [];

    // Generate AI alternatives if we need more options
    let aiAlternatives = [];
    if (dbAlternatives.length < 3) {
      const isArabic = language === 'ar';
      
      const systemPrompt = isArabic ? `
أنت خبير تغذية متخصص في إنشاء بدائل للوجبات. أنشئ 3 بدائل صحية ومتوازنة للوجبة المعطاة.

متطلبات البدائل:
- نفس السعرات الحرارية تقريباً (±50 سعرة)
- نفس النوع (إفطار/غداء/عشاء/وجبة خفيفة)
- مناسبة للملف الشخصي للمستخدم
- مكونات وتعليمات واضحة باللغة العربية

أرجع JSON صحيح فقط بدون أي تنسيق إضافي.` : `
You are a nutrition expert specialized in creating meal alternatives. Generate 3 healthy and balanced alternatives for the given meal.

Alternative requirements:
- Similar calories (±50 calories)
- Same meal type (breakfast/lunch/dinner/snack)
- Suitable for user profile
- Clear ingredients and instructions in English

Return only valid JSON without any additional formatting.`;

      const userPrompt = isArabic ? `
الوجبة الحالية: ${currentMeal.name}
السعرات: ${currentMeal.calories}
البروتين: ${currentMeal.protein}g
الكربوهيدرات: ${currentMeal.carbs}g
الدهون: ${currentMeal.fat}g

ملف المستخدم:
- العمر: ${userProfile?.age || 30}
- الجنس: ${userProfile?.gender || 'غير محدد'}
- الهدف: ${userProfile?.fitness_goal || 'المحافظة على الوزن'}
- القيود الغذائية: ${userProfile?.dietary_restrictions?.join(', ') || 'لا يوجد'}
- الحساسية: ${userProfile?.allergies?.join(', ') || 'لا يوجد'}

أنشئ 3 بدائل بهذا التنسيق:
{
  "alternatives": [
    {
      "name": "اسم الوجبة",
      "calories": 500,
      "protein": 25,
      "carbs": 40,
      "fat": 20,
      "reason": "سبب اختيار هذه الوجبة",
      "ingredients": ["مكون 1", "مكون 2"],
      "instructions": ["خطوة 1", "خطوة 2"],
      "prepTime": 15,
      "cookTime": 20,
      "servings": 1
    }
  ]
}` : `
Current meal: ${currentMeal.name}
Calories: ${currentMeal.calories}
Protein: ${currentMeal.protein}g
Carbs: ${currentMeal.carbs}g
Fat: ${currentMeal.fat}g

User profile:
- Age: ${userProfile?.age || 30}
- Gender: ${userProfile?.gender || 'not specified'}
- Goal: ${userProfile?.fitness_goal || 'maintain weight'}
- Dietary restrictions: ${userProfile?.dietary_restrictions?.join(', ') || 'none'}
- Allergies: ${userProfile?.allergies?.join(', ') || 'none'}

Generate 3 alternatives in this format:
{
  "alternatives": [
    {
      "name": "Meal name",
      "calories": 500,
      "protein": 25,
      "carbs": 40,
      "fat": 20,
      "reason": "Why this meal is a good alternative",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"],
      "prepTime": 15,
      "cookTime": 20,
      "servings": 1
    }
  ]
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
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        try {
          const parsed = JSON.parse(content);
          aiAlternatives = parsed.alternatives?.map(alt => ({
            ...alt,
            source: 'ai'
          })) || [];

          // Store AI alternatives in database for future use
          for (const alternative of aiAlternatives) {
            try {
              await supabase.from('daily_meals').insert({
                weekly_plan_id: currentMeal.weekly_plan_id || 'generated',
                day_number: currentMeal.day_number || 1,
                meal_type: currentMeal.meal_type || 'meal',
                name: alternative.name,
                calories: alternative.calories,
                protein: alternative.protein,
                carbs: alternative.carbs,
                fat: alternative.fat,
                ingredients: alternative.ingredients,
                instructions: alternative.instructions,
                prep_time: alternative.prepTime,
                cook_time: alternative.cookTime,
                servings: alternative.servings,
                youtube_search_term: `${alternative.name} recipe`,
                alternatives: [],
                recipe_fetched: true
              });
            } catch (insertError) {
              console.error('Failed to store AI alternative:', insertError);
            }
          }
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
        }
      }
    }

    // Combine database and AI alternatives
    const allAlternatives = [...dbAlternatives, ...aiAlternatives];

    return new Response(JSON.stringify({ 
      success: true,
      alternatives: allAlternatives,
      source_breakdown: {
        database: dbAlternatives.length,
        ai_generated: aiAlternatives.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating meal alternatives:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
