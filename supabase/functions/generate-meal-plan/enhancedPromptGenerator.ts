
import { AIPromptService } from '../../../src/services/aiPromptService.ts';

export const generateEnhancedMealPlanPrompt = (
  userProfile: any,
  preferences: any,
  dailyCalories: number
): { systemMessage: string; userPrompt: string } => {
  console.log('🎯 Using centralized prompt service for meal plan generation');
  
  const promptConfig = AIPromptService.getMealPlanPrompt(
    userProfile,
    preferences,
    dailyCalories
  );
  
  return {
    systemMessage: promptConfig.systemMessage,
    userPrompt: promptConfig.userPrompt + '\n\nResponse format:\n' + promptConfig.responseFormat
  };
};

// Legacy support - gradually replace usage
export const generateMealPlanPrompt = generateEnhancedMealPlanPrompt;
