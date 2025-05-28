import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client for the edge function
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to generate meal image
async function generateMealImage(mealName: string, ingredients: string[]): Promise<string | null> {
  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) return null;

    const prompt = `Professional food photography of ${mealName}${ingredients.length > 0 ? ` with ${ingredients.slice(0, 3).join(', ')}` : ''}, beautifully plated on a white ceramic plate, natural lighting, overhead view, restaurant quality presentation, appetizing, high resolution, clean background`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        style: 'natural'
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.data[0].url;
    }
  } catch (error) {
    console.error('Error generating image for', mealName, ':', error);
  }
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userProfile, preferences } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('=== MEAL PLAN GENERATION START ===');
    console.log('User Profile:', JSON.stringify(userProfile, null, 2));
    console.log('Preferences:', JSON.stringify(preferences, null, 2));

    // Calculate BMR and daily calorie needs
    const bmr = userProfile?.gender === 'male' 
      ? 88.362 + (13.397 * userProfile.weight) + (4.799 * userProfile.height) - (5.677 * userProfile.age)
      : 447.593 + (9.247 * userProfile.weight) + (3.098 * userProfile.height) - (4.330 * userProfile.age);

    const activityMultiplier = {
      'sedentary': 1.2,
      'lightly_active': 1.375,
      'moderately_active': 1.55,
      'very_active': 1.725,
      'extremely_active': 1.9
    }[userProfile?.activity_level] || 1.55;

    const dailyCalories = Math.round(bmr * activityMultiplier);
    console.log('Calculated daily calories:', dailyCalories);

    // Enhanced prompt with cultural cuisine focus and detailed requirements
    const prompt = `Generate a complete 7-day meal plan with EXACTLY 35 meals (7 days × 5 meals per day: breakfast, lunch, dinner, snack1, snack2).

USER PROFILE:
- Age: ${userProfile?.age}, Gender: ${userProfile?.gender}
- Weight: ${userProfile?.weight}kg, Height: ${userProfile?.height}cm
- Goal: ${userProfile?.fitness_goal}, Activity: ${userProfile?.activity_level}
- Nationality: ${userProfile?.nationality}
- Target: ${dailyCalories} calories daily

CRITICAL REQUIREMENTS:
1. EXACTLY 7 days (Monday to Sunday)
2. EXACTLY 5 meals per day
3. TOTAL: 35 meals - NO EXCEPTIONS
4. Valid JSON only - no markdown formatting
5. All nutritional values must be numbers
6. Focus on ${userProfile?.nationality || 'international'} cuisine with authentic local dishes
7. Include detailed cooking instructions and cultural context
8. Provide comprehensive ingredient lists with exact measurements

Return ONLY this JSON structure:

{
  "weekSummary": {
    "totalCalories": ${dailyCalories * 7},
    "avgDailyCalories": ${dailyCalories},
    "totalProtein": 700,
    "totalCarbs": 2100,
    "totalFat": 490,
    "dietType": "${userProfile?.fitness_goal === 'weight_loss' ? 'Weight Loss' : 'Balanced'}"
  },
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Monday",
      "totalCalories": ${dailyCalories},
      "meals": [
        {
          "type": "breakfast",
          "name": "Traditional ${userProfile?.nationality || 'International'} Breakfast",
          "calories": ${Math.round(dailyCalories * 0.25)},
          "protein": 20,
          "carbs": 45,
          "fat": 12,
          "fiber": 8,
          "sugar": 15,
          "description": "A nutritious and culturally authentic breakfast to start your day",
          "ingredients": [
            {"name": "main ingredient", "quantity": "100", "unit": "g", "calories": 120, "protein": 8, "carbs": 20, "fat": 3},
            {"name": "secondary ingredient", "quantity": "50", "unit": "g", "calories": 80, "protein": 4, "carbs": 15, "fat": 2}
          ],
          "instructions": [
            "Step 1: Detailed preparation instruction",
            "Step 2: Cooking method with timing",
            "Step 3: Plating and serving suggestions"
          ],
          "prepTime": 10,
          "cookTime": 15,
          "servings": 1,
          "youtubeSearchTerm": "${userProfile?.nationality || 'traditional'} breakfast recipe",
          "cuisine": "${userProfile?.nationality || 'international'}",
          "difficulty": "easy",
          "tips": "Chef tips for best results",
          "nutritionBenefits": "Health benefits of this meal",
          "culturalInfo": "Cultural significance and variations"
        }
      ]
    }
  ]
}

Generate all 7 days following this exact pattern. Each day must have exactly 5 meals. Vary the meal names and ingredients but keep authentic ${userProfile?.nationality || 'international'} flavors and traditional cooking methods.`;

    console.log('Sending request to OpenAI...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: `You are a professional nutritionist specializing in ${userProfile?.nationality || 'international'} cuisine. Generate EXACTLY 7 days with EXACTLY 5 meals each (35 total meals). Return ONLY valid JSON with no markdown formatting. Focus on authentic cultural dishes with detailed instructions and nutritional information.` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received, content length:', data.choices[0]?.message?.content?.length);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }

    let generatedPlan;
    try {
      const content = data.choices[0].message.content.trim();
      console.log('Raw content preview:', content.substring(0, 300) + '...');
      
      // Clean the content more thoroughly
      let cleanedContent = content;
      
      // Remove markdown code blocks
      cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Remove any text before the first {
      const firstBrace = cleanedContent.indexOf('{');
      if (firstBrace > 0) {
        cleanedContent = cleanedContent.substring(firstBrace);
      }
      
      // Remove any text after the last }
      const lastBrace = cleanedContent.lastIndexOf('}');
      if (lastBrace < cleanedContent.length - 1) {
        cleanedContent = cleanedContent.substring(0, lastBrace + 1);
      }
      
      console.log('Cleaned content preview:', cleanedContent.substring(0, 300) + '...');
      
      generatedPlan = JSON.parse(cleanedContent);
      console.log('Meal plan parsed successfully');
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse AI response. The response was not valid JSON.');
    }

    // Strict validation
    if (!generatedPlan.days || !Array.isArray(generatedPlan.days)) {
      throw new Error('Invalid meal plan structure: days must be an array');
    }

    if (generatedPlan.days.length !== 7) {
      console.error('Generated plan has', generatedPlan.days.length, 'days instead of 7');
      throw new Error(`Must contain exactly 7 days, got ${generatedPlan.days.length}`);
    }

    let totalMeals = 0;
    for (let i = 0; i < generatedPlan.days.length; i++) {
      const day = generatedPlan.days[i];
      if (!day.meals || !Array.isArray(day.meals)) {
        throw new Error(`Day ${i + 1} meals must be an array`);
      }
      if (day.meals.length !== 5) {
        throw new Error(`Day ${i + 1} must have exactly 5 meals, got ${day.meals.length}`);
      }
      
      totalMeals += day.meals.length;
      day.dayNumber = i + 1;
      
      const requiredTypes = ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'];
      const mealTypes = day.meals.map(m => m.type);
      for (const type of requiredTypes) {
        if (!mealTypes.includes(type)) {
          throw new Error(`Day ${i + 1} missing meal type: ${type}`);
        }
      }
    }

    if (totalMeals !== 35) {
      throw new Error(`Must have exactly 35 meals total, got ${totalMeals}`);
    }

    // Ensure dietType exists
    if (!generatedPlan.weekSummary) {
      generatedPlan.weekSummary = {};
    }
    if (!generatedPlan.weekSummary.dietType) {
      generatedPlan.weekSummary.dietType = userProfile?.fitness_goal === 'weight_loss' ? 'Weight Loss' : 'Balanced';
    }

    console.log('✅ VALIDATION PASSED - 7 days with 35 total meals confirmed');
    
    // Delete existing meals for this week before saving new ones
    const weekStartDate = new Date();
    weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
    
    console.log('Deleting existing plan for week:', weekStartDate.toISOString().split('T')[0]);
    const { error: deleteError } = await supabase
      .from('weekly_meal_plans')
      .delete()
      .eq('user_id', userProfile.id)
      .eq('week_start_date', weekStartDate.toISOString().split('T')[0]);
    
    if (deleteError) {
      console.error('Error deleting existing plan:', deleteError);
    }

    // Save new weekly plan
    console.log('Saving new weekly plan...');
    const { data: weeklyPlan, error: weeklyError } = await supabase
      .from('weekly_meal_plans')
      .insert({
        user_id: userProfile.id,
        week_start_date: weekStartDate.toISOString().split('T')[0],
        generation_prompt: {
          userProfile,
          preferences,
          generatedAt: new Date().toISOString()
        },
        total_calories: generatedPlan.weekSummary?.totalCalories || dailyCalories * 7,
        total_protein: generatedPlan.weekSummary?.totalProtein || 700,
        total_carbs: generatedPlan.weekSummary?.totalCarbs || 2100,
        total_fat: generatedPlan.weekSummary?.totalFat || 490
      })
      .select()
      .single();

    if (weeklyError) {
      console.error('Error saving weekly plan:', weeklyError);
      throw weeklyError;
    }

    console.log('Weekly plan saved with ID:', weeklyPlan.id);

    // Save ALL 35 meals systematically with enhanced data and images
    let totalMealsSaved = 0;
    let failedMeals = 0;

    for (let dayIndex = 0; dayIndex < generatedPlan.days.length; dayIndex++) {
      const day = generatedPlan.days[dayIndex];
      console.log(`Saving meals for day ${dayIndex + 1} (${day.meals.length} meals)...`);
      
      for (let mealIndex = 0; mealIndex < day.meals.length; mealIndex++) {
        const meal = day.meals[mealIndex];
        
        // Generate image for the meal
        const ingredientNames = (meal.ingredients || []).map((ing: any) => ing.name || '');
        const imageUrl = await generateMealImage(meal.name || 'meal', ingredientNames);
        
        const { error: mealError } = await supabase
          .from('daily_meals')
          .insert({
            weekly_plan_id: weeklyPlan.id,
            day_number: day.dayNumber,
            meal_type: meal.type,
            name: meal.name || 'Unnamed Meal',
            calories: meal.calories || 0,
            protein: meal.protein || 0,
            carbs: meal.carbs || 0,
            fat: meal.fat || 0,
            ingredients: meal.ingredients || [],
            instructions: meal.instructions || [],
            prep_time: meal.prepTime || 0,
            cook_time: meal.cookTime || 0,
            servings: meal.servings || 1,
            youtube_search_term: meal.youtubeSearchTerm || null,
            alternatives: meal.alternatives || [],
            image_url: imageUrl
          });

        if (mealError) {
          console.error(`Error saving meal ${mealIndex + 1} of day ${dayIndex + 1}:`, mealError);
          failedMeals++;
        } else {
          totalMealsSaved++;
          if (imageUrl) {
            console.log(`✅ Meal ${meal.name} saved with AI-generated image`);
          }
        }
      }
    }

    console.log(`✅ MEAL SAVING COMPLETE: ${totalMealsSaved} meals saved, ${failedMeals} failed out of 35 expected`);

    console.log('=== MEAL PLAN GENERATION COMPLETE ===');
    console.log(`✅ SUCCESS: Generated ${generatedPlan.days.length} days with ${totalMealsSaved} meals`);
    
    return new Response(JSON.stringify({ generatedPlan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('=== MEAL PLAN GENERATION FAILED ===');
    console.error('Error details:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate meal plan',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
