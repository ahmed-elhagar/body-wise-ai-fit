
import { AIService } from "../_shared/aiService.ts";

export const callOpenAI = async (
  openAIApiKey: string,
  selectedPrompt: string,
  systemMessage: string
) => {
  console.log('📤 Sending request to AI service...');
  
  const aiService = new AIService(openAIApiKey);
  
  const response = await aiService.generate('exercise_program', {
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: selectedPrompt }
    ],
    temperature: 0.3,
    maxTokens: 4000,
  });

  console.log('📥 AI exercise response received successfully');
  return response.content;
};

export const createSystemMessage = (workoutType: string, userLanguage: string) => {
  return userLanguage === 'ar' 
    ? `أنت مدرب شخصي معتمد ومتخصص في التمارين الرياضية. اكتب استجابتك بتنسيق JSON صحيح فقط. قم بإنشاء تمارين آمنة وفعالة لبيئة ${workoutType === 'gym' ? 'الصالة الرياضية' : 'المنزل'}. ركز على الشكل الصحيح والزيادة التدريجية والتعليمات الواضحة. استخدم اللغة العربية لأسماء التمارين والتعليمات.`
    : `You are a certified personal trainer and exercise specialist. Always respond with valid JSON only. Create safe, effective workouts for ${workoutType} environment. Focus on proper form, progressive overload, and clear instructions. Use ${userLanguage === 'en' ? 'English' : userLanguage} for exercise names and instructions.`;
};
