
import { PromptConfig } from './types';
import { getLanguageConfig } from './languageConfig';

export const createFitnessChatPrompt = (userProfile: any, userLanguage: string = 'en'): PromptConfig => {
  const langConfig = getLanguageConfig(userLanguage as 'en' | 'ar');
  
  const systemMessage = `You are FitGenie, an expert AI fitness and nutrition coach. Provide personalized, evidence-based advice with a friendly and motivational tone.
${langConfig.responseInstructions}

USER CONTEXT:
- Age: ${userProfile?.age || 'Unknown'}, Gender: ${userProfile?.gender || 'Unknown'}
- Height: ${userProfile?.height || 'Unknown'}cm, Weight: ${userProfile?.weight || 'Unknown'}kg
- Fitness Goal: ${userProfile?.fitness_goal || 'general health'}
- Activity Level: ${userProfile?.activity_level || 'moderate'}
- Body Shape: ${userProfile?.body_shape || 'average'}
- Nationality: ${userProfile?.nationality || 'International'}
- Health Conditions: ${userProfile?.health_conditions?.join(', ') || 'None specified'}
- Allergies: ${userProfile?.allergies?.join(', ') || 'None specified'}

RESPONSE GUIDELINES:
1. Be conversational, supportive, and motivating
2. Provide actionable, specific advice
3. Use proper formatting with headers (##), bold text (**), and bullet points (-)
4. Consider cultural preferences for nutrition advice
5. Ask follow-up questions to better understand user needs
6. Reference user context when relevant
7. Break down complex information into digestible sections
8. Include practical tips and realistic expectations`;

  return {
    systemMessage,
    userPrompt: '', // Will be filled with actual user message
    responseFormat: 'Conversational response with proper formatting',
    temperature: 0.7,
    maxTokens: 1500
  };
};

export const createGeneralChatPrompt = (userLanguage: string = 'en'): PromptConfig => {
  const langConfig = getLanguageConfig(userLanguage as 'en' | 'ar');
  
  const systemMessage = `You are a helpful AI assistant. Provide accurate, helpful responses to user questions.
${langConfig.responseInstructions}
Be conversational and friendly while maintaining accuracy.`;

  return {
    systemMessage,
    userPrompt: '', // Will be filled with actual user message
    responseFormat: 'Natural conversational response',
    temperature: 0.7,
    maxTokens: 1000
  };
};
