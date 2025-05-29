
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

    // Simulate snack generation logic here
    const snack = {
      id: `snack_${Date.now()}`,
      name: language === 'ar' ? 'لوز محمص' : 'Roasted Almonds',
      calories: Math.min(calories, 200),
      protein: 6,
      carbs: 6,
      fat: 14,
      prep_time: 5,
      meal_type: 'snack',
      day: day,
      image_url: '/api/placeholder/300/200'
    };

    console.log('Generated snack:', snack);

    return new Response(
      JSON.stringify({ 
        success: true,
        snack: snack,
        message: language === 'ar' ? 'تم إضافة الوجبة الخفيفة بنجاح!' : 'Snack added successfully!'
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
