
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userProfile, preferences } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing');
    }

    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('Generating meal plan for user:', userProfile?.id);
    console.log('Preferences:', preferences);

    // Check if user has generations remaining
    if (userProfile?.id) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('ai_generations_remaining')
        .eq('id', userProfile.id)
        .single();
        
      if (profileError) {
        console.error('Error checking AI generations remaining:', profileError);
        throw new Error('Failed to check AI generations remaining');
      }
      
      if (profile.ai_generations_remaining <= 0) {
        throw new Error('You have reached your AI generation limit. Please contact admin to increase your limit.');
      }
    }

    // Create a simpler prompt to reduce token usage
    const prompt = `Generate a personalized 3-day meal plan for a ${userProfile?.age || 'adult'} year old ${userProfile?.gender || 'person'} with the following details:
    - Height: ${userProfile?.height || 'average'}cm, Weight: ${userProfile?.weight || 'average'}kg
    - Fitness Goal: ${userProfile?.fitness_goal || 'general health'}
    - Activity Level: ${userProfile?.activity_level || 'moderate'}
    - Allergies: ${userProfile?.allergies?.join(', ') || 'None'}
    - Dietary Restrictions: ${userProfile?.dietary_restrictions?.join(', ') || 'None'}
    - Preferred Cuisine: ${preferences?.cuisine || 'Various'}
    - Max Prep Time: ${preferences?.maxPrepTime || '30'} minutes
    
    Create a simple meal plan with breakfast, lunch, dinner, and 1 snack for each day. Include:
    - Calories per meal
    - Macro breakdown (protein, carbs, fat)
    - Basic ingredient lists
    - Simple cooking instructions
    - Prep and cook times

    Format as JSON with this structure:
    {
      "weekSummary": {
        "totalCalories": number,
        "avgDailyCalories": number,
        "totalProtein": number,
        "totalCarbs": number,
        "totalFat": number
      },
      "days": [
        {
          "dayNumber": 1,
          "dayName": "Monday",
          "totalCalories": number,
          "meals": [
            {
              "type": "breakfast",
              "name": "Meal Name",
              "calories": number,
              "protein": number,
              "carbs": number,
              "fat": number,
              "ingredients": [{"name": "ingredient", "quantity": "amount", "unit": "unit"}],
              "instructions": ["Step 1", "Step 2"],
              "prepTime": number,
              "cookTime": number,
              "servings": 1
            }
          ]
        }
      ]
    }`;

    console.log('Sending request to OpenAI with smaller prompt');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Use a smaller model to avoid rate limits
        messages: [
          { role: 'system', content: 'You are a professional nutritionist and meal planning expert. Always respond with valid JSON only. Be precise with nutritional data and cooking instructions.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000, // Reduced token count
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response from OpenAI API');
    }

    let generatedPlan;
    try {
      generatedPlan = JSON.parse(data.choices[0].message.content);
      console.log('Meal plan parsed successfully');
      
      // If user exists, decrement their AI generations count
      if (userProfile?.id) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            ai_generations_remaining: supabase.rpc('decrement_function', { value: 1 }) 
          })
          .eq('id', userProfile.id);
          
        if (updateError) {
          console.error('Failed to update AI generations remaining:', updateError);
        }
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse AI response as JSON');
    }

    return new Response(JSON.stringify({ generatedPlan }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate meal plan',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
