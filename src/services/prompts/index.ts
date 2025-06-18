
// Centralized prompt service with modular structure
export { createMealPlanPrompt } from './mealPlanPrompts';
export { createExerciseProgramPrompt, createExerciseExchangePrompt } from './exercisePrompts';
export { createFoodAnalysisPrompt } from './analysisPrompts';
export { createFitnessChatPrompt, createGeneralChatPrompt } from './chatPrompts';
export { getLanguageConfig } from './languageConfig';
export type { PromptConfig, LanguageConfig, SupportedLanguage, FeatureType } from './types';
