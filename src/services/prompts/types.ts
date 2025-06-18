
// Centralized prompt types and interfaces
export interface PromptConfig {
  systemMessage: string;
  userPrompt: string;
  responseFormat: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LanguageConfig {
  language: string;
  isRTL: boolean;
  responseInstructions: string;
}

export type SupportedLanguage = 'en' | 'ar';
export type FeatureType = 'meal_plan' | 'exercise_program' | 'food_analysis' | 'exercise_exchange' | 'fitness_chat' | 'general_chat';
