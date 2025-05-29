
export const getMealImageUrl = async (mealName: string, ingredients: string[]): Promise<string | null> => {
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
};
