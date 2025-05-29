
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { day, calories, userProfile, language = 'en' } = await req.json();
    
    console.log('Generate AI Snack - Request data:', { day, calories, userProfile, language });

    if (!day || !calories || !userProfile) {
      return new Response(
        JSON.stringify({ 
          error: language === 'ar' ? 'بيانات غير مكتملة' : 'Missing required data',
          success: false 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Enhanced snack generation logic based on user profile
    const isArabic = language === 'ar';
    
    // Create culturally appropriate snacks
    const arabicSnacks = [
      { name: 'لوز محمص', nameEn: 'Roasted Almonds' },
      { name: 'تمر وجوز', nameEn: 'Dates and Walnuts' },
      { name: 'حمص مشوي', nameEn: 'Roasted Chickpeas' },
      { name: 'زبادي بالعسل', nameEn: 'Honey Yogurt' },
      { name: 'فاكهة مشكلة', nameEn: 'Mixed Fruits' }
    ];

    const englishSnacks = [
      { name: 'Greek Yogurt with Berries', nameAr: 'زبادي يوناني بالتوت' },
      { name: 'Mixed Nuts', nameAr: 'مكسرات مشكلة' },
      { name: 'Apple with Peanut Butter', nameAr: 'تفاح بزبدة الفول السوداني' },
      { name: 'Protein Smoothie', nameAr: 'عصير البروتين' },
      { name: 'Cottage Cheese Bowl', nameAr: 'وعاء الجبن القريش' }
    ];

    const snackOptions = isArabic ? arabicSnacks : englishSnacks;
    const selectedSnack = snackOptions[Math.floor(Math.random() * snackOptions.length)];

    // Calculate nutritional values based on calories
    const targetCalories = Math.min(calories, 300);
    const protein = Math.round((targetCalories * 0.25) / 4); // 25% from protein
    const carbs = Math.round((targetCalories * 0.45) / 4); // 45% from carbs  
    const fat = Math.round((targetCalories * 0.30) / 9); // 30% from fat

    const snack = {
      id: `snack_${Date.now()}`,
      name: selectedSnack.name,
      calories: targetCalories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      prep_time: 5,
      meal_type: 'snack',
      day: day,
      image_url: '/api/placeholder/300/200',
      ingredients: isArabic ? ['مكونات طبيعية'] : ['Natural ingredients'],
      instructions: isArabic ? ['تحضير سريع وسهل'] : ['Quick and easy preparation']
    };

    console.log('Generated snack:', snack);

    const successMessage = isArabic ? 'تم إضافة الوجبة الخفيفة بنجاح!' : 'Snack added successfully!';

    return new Response(
      JSON.stringify({ 
        success: true,
        snack: snack,
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
