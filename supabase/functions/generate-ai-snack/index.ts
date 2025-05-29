
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
        ingredients: [
          { name: 'لوز محمص', quantity: '30', unit: 'جرام' },
          { name: 'تمر منزوع النوى', quantity: '3', unit: 'حبة' },
          { name: 'قرفة مطحونة', quantity: '1/2', unit: 'ملعقة صغيرة' }
        ],
        instructions: ['قم بتقطيع التمر إلى قطع صغيرة', 'اخلط اللوز مع التمر', 'رش القرفة للنكهة', 'قدم في طبق صغير']
      },
      { 
        name: 'زبادي يوناني بالعسل والجوز', 
        nameEn: 'Greek Yogurt with Honey and Walnuts',
        ingredients: [
          { name: 'زبادي يوناني', quantity: '150', unit: 'جرام' },
          { name: 'عسل طبيعي', quantity: '1', unit: 'ملعقة كبيرة' },
          { name: 'جوز مقطع', quantity: '20', unit: 'جرام' }
        ],
        instructions: ['ضع الزبادي في وعاء', 'أضف العسل والجوز من الأعلى', 'اخلط برفق واستمتع']
      },
      { 
        name: 'حمص مشوي بالبهارات', 
        nameEn: 'Spiced Roasted Chickpeas',
        ingredients: [
          { name: 'حمص مسلوق', quantity: '100', unit: 'جرام' },
          { name: 'كمون مطحون', quantity: '1/2', unit: 'ملعقة صغيرة' },
          { name: 'بابريكا', quantity: '1/2', unit: 'ملعقة صغيرة' },
          { name: 'ملح', quantity: '1/4', unit: 'ملعقة صغيرة' }
        ],
        instructions: ['سخن الفرن على 200 درجة مئوية', 'اخلط الحمص مع البهارات', 'اشوي لمدة 15 دقيقة', 'قدم دافئاً']
      }
    ];

    const englishSnacks = [
      { 
        name: 'Greek Yogurt Berry Bowl', 
        nameAr: 'وعاء الزبادي اليوناني بالتوت',
        ingredients: [
          { name: 'Greek yogurt', quantity: '150', unit: 'g' },
          { name: 'Mixed berries', quantity: '80', unit: 'g' },
          { name: 'Honey', quantity: '1', unit: 'tbsp' },
          { name: 'Granola', quantity: '20', unit: 'g' }
        ],
        instructions: ['Place yogurt in bowl', 'Top with berries and granola', 'Drizzle with honey', 'Serve immediately']
      },
      { 
        name: 'Apple Slices with Almond Butter', 
        nameAr: 'شرائح التفاح بزبدة اللوز',
        ingredients: [
          { name: 'Medium apple', quantity: '1', unit: 'piece' },
          { name: 'Almond butter', quantity: '2', unit: 'tbsp' },
          { name: 'Cinnamon powder', quantity: '1/4', unit: 'tsp' }
        ],
        instructions: ['Wash and slice apple into wedges', 'Arrange on plate', 'Serve with almond butter for dipping', 'Sprinkle with cinnamon']
      },
      { 
        name: 'Protein Energy Balls', 
        nameAr: 'كرات الطاقة بالبروتين',
        ingredients: [
          { name: 'Rolled oats', quantity: '50', unit: 'g' },
          { name: 'Protein powder', quantity: '1', unit: 'scoop' },
          { name: 'Peanut butter', quantity: '2', unit: 'tbsp' },
          { name: 'Honey', quantity: '1', unit: 'tbsp' }
        ],
        instructions: ['Mix all ingredients in a bowl', 'Form mixture into small balls', 'Refrigerate for 30 minutes', 'Enjoy chilled']
      }
    ];

    const snackOptions = isArabic ? arabicSnacks : englishSnacks;
    const selectedSnack = snackOptions[Math.floor(Math.random() * snackOptions.length)];

    // Calculate nutritional values based on calories with more realistic values
    const targetCalories = Math.min(calories, 350);
    const protein = Math.round((targetCalories * 0.20) / 4); // 20% from protein
    const carbs = Math.round((targetCalories * 0.50) / 4); // 50% from carbs  
    const fat = Math.round((targetCalories * 0.30) / 9); // 30% from fat

    // Create the snack object with proper structure
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
      instructions: selectedSnack.instructions
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
          success: false,
          details: dbError.message
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
        success: false,
        details: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
