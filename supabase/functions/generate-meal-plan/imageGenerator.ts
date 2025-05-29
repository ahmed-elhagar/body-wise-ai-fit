
export const getMealImageUrl = async (mealName: string, imagePrompt?: string): Promise<string | null> => {
  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) return null;

    // Use the provided prompt or create a default one
    const prompt = imagePrompt || `Professional food photography of ${mealName}, beautifully plated on a white ceramic plate, natural lighting, overhead view, restaurant quality presentation, appetizing, high resolution, clean background`;

    console.log(`Generating image for: ${mealName}`);

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
      console.log(`✅ Image generated for: ${mealName}`);
      return data.data[0].url;
    } else {
      console.error(`Failed to generate image for ${mealName}:`, response.status);
    }
  } catch (error) {
    console.error('Error generating image for', mealName, ':', error);
  }
  return null;
};
