
export const callOpenAI = async (
  openAIApiKey: string,
  selectedPrompt: string,
  systemMessage: string
) => {
  console.log('📤 Sending request to OpenAI...');
  
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
          content: systemMessage
        },
        { role: 'user', content: selectedPrompt }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ OpenAI API error:', response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('📥 OpenAI exercise response received successfully');

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response structure from OpenAI API');
  }

  return data.choices[0].message.content;
};

export const createSystemMessage = (workoutType: string, userLanguage: string) => {
  return userLanguage === 'ar' 
    ? `أنت مدرب شخصي معتمد ومتخصص في التمارين الرياضية. اكتب استجابتك بتنسيق JSON صحيح فقط. قم بإنشاء تمارين آمنة وفعالة لبيئة ${workoutType === 'gym' ? 'الصالة الرياضية' : 'المنزل'}. ركز على الشكل الصحيح والزيادة التدريجية والتعليمات الواضحة. استخدم اللغة العربية لأسماء التمارين والتعليمات.`
    : `You are a certified personal trainer and exercise specialist. Always respond with valid JSON only. Create safe, effective workouts for ${workoutType} environment. Focus on proper form, progressive overload, and clear instructions. Use ${userLanguage === 'en' ? 'English' : userLanguage} for exercise names and instructions.`;
};
