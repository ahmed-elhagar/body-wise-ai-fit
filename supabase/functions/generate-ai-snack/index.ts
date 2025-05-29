
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
    
    console.log('Generate AI Snack - Request data:', { 
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

    const isArabic = language === 'ar';
    
    // Create culturally appropriate snacks based on language/locale
    const arabicSnacks = [
      { 
        name: 'لوز محمص مع التمر', 
        nameEn: 'Roasted Almonds with Dates',
        ingredients: ['لوز محمص', 'تمر منزوع النوى', 'رشة قرفة'],
        instructions: ['قم بتقطيع التمر إلى قطع صغيرة', 'اخلط اللوز مع التمر', 'رش القرفة للنكهة']
      },
      { 
        name: 'زبادي يوناني بالعسل والجوز', 
        nameEn: 'Greek Yogurt with Honey and Walnuts',
        ingredients: ['زبادي يوناني', 'عسل طبيعي', 'جوز مقطع'],
        instructions: ['ضع الزبادي في وعاء', 'أضف العسل والجوز', 'اخلط واستمتع']
      },
      { 
        name: 'حمص مشوي بالبهارات', 
        nameEn: 'Spiced Roasted Chickpeas',
        ingredients: ['حمص مسلوق', 'كمون', 'بابريكا', 'ملح'],
        instructions: ['اشوي الحمص في الفرن', 'تبل بالبهارات', 'قدم دافئاً']
      }
    ];

    const englishSnacks = [
      { 
        name: 'Greek Yogurt Berry Bowl', 
        nameAr: 'وعاء الزبادي اليوناني بالتوت',
        ingredients: ['Greek yogurt', 'Mixed berries', 'Honey', 'Granola'],
        instructions: ['Place yogurt in bowl', 'Top with berries and granola', 'Drizzle with honey']
      },
      { 
        name: 'Apple Slices with Almond Butter', 
        nameAr: 'شرائح التفاح بزبدة اللوز',
        ingredients: ['Apple', 'Almond butter', 'Cinnamon'],
        instructions: ['Slice apple into wedges', 'Serve with almond butter', 'Sprinkle with cinnamon']
      },
      { 
        name: 'Protein Energy Balls', 
        nameAr: 'كرات الطاقة بالبروتين',
        ingredients: ['Oats', 'Protein powder', 'Peanut butter', 'Honey'],
        instructions: ['Mix all ingredients', 'Form into balls', 'Refrigerate for 30 minutes']
      }
    ];

    const snackOptions = isArabic ? arabicSnacks : englishSnacks;
    const selectedSnack = snackOptions[Math.floor(Math.random() * snackOptions.length)];

    // Calculate nutritional values based on calories
    const targetCalories = Math.min(calories, 300);
    const protein = Math.round((targetCalories * 0.25) / 4); // 25% from protein
    const carbs = Math.round((targetCalories * 0.45) / 4); // 45% from carbs  
    const fat = Math.round((targetCalories * 0.30) / 9); // 30% from fat

    // Create the snack object
    const snackData = {
      weekly_plan_id: weeklyPlanId,
      day_number: day,
      meal_type: 'snack',
      name: selectedSnack.name,
      calories: targetCalories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      prep_time: 5,
      cook_time: 0,
      servings: 1,
      image_url: '/api/placeholder/300/200',
      ingredients: selectedSnack.ingredients,
      instructions: selectedSnack.instructions,
      created_at: new Date().toISOString()
    };

    console.log('Saving snack to database:', snackData);

    // Save to database
    const { data: savedSnack, error: dbError } = await supabase
      .from('daily_meals')
      .insert([snackData])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ 
          error: isArabic ? 'خطأ في حفظ الوجبة الخفيفة' : 'Failed to save snack',
          success: false 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('Snack saved successfully:', savedSnack);

    const successMessage = isArabic ? 'تم إضافة الوجبة الخفيفة بنجاح!' : 'Snack added successfully!';

    return new Response(
      JSON.stringify({ 
        success: true,
        snack: savedSnack,
        message: successMessage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Generate AI Snack - Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        success: false 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
