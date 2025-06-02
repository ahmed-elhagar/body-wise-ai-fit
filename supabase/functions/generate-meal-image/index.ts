
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { mealId, mealName, description } = await req.json()

    if (!mealId || !mealName) {
      return new Response(
        JSON.stringify({ error: 'Missing mealId or mealName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`🖼️ Generating image for meal: ${mealName}`)

    // Generate image with DALL-E
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `A professional, appetizing photo of ${mealName}. ${description}. High quality food photography, well-lit, restaurant-style presentation.`,
        n: 1,
        size: '1024x1024',
        quality: 'standard'
      }),
    })

    if (!imageResponse.ok) {
      const error = await imageResponse.text()
      console.error('OpenAI image generation error:', error)
      throw new Error('Failed to generate image')
    }

    const imageData = await imageResponse.json()
    const imageUrl = imageData.data[0].url

    // Update meal with image URL
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error: updateError } = await supabase
      .from('daily_meals')
      .update({ image_url: imageUrl })
      .eq('id', mealId)

    if (updateError) {
      console.error('Error updating meal with image:', updateError)
      throw updateError
    }

    console.log(`✅ Image generated and saved for meal: ${mealName}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl,
        message: 'Image generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in generate-meal-image function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
