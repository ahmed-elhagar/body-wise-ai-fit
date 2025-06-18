
// Simplified prompt service that delegates to modular prompt creators
import {
  createMealPlanPrompt,
  createExerciseProgramPrompt,
  createExerciseExchangePrompt,
  createFoodAnalysisPrompt,
  createFitnessChatPrompt,
  createGeneralChatPrompt,
  type PromptConfig
} from './prompts';

export class AIPromptService {
  static getMealPlanPrompt(userProfile: any, preferences: any, dailyCalories: number): PromptConfig {
    return createMealPlanPrompt(userProfile, preferences, dailyCalories);
  }

  static getExerciseProgramPrompt(userProfile: any, preferences: any, workoutType: 'home' | 'gym'): PromptConfig {
    return createExerciseProgramPrompt(userProfile, preferences, workoutType);
  }

  static getExerciseExchangePrompt(originalExercise: any, reason: string, preferences: any, userLanguage: string = 'en'): PromptConfig {
    return createExerciseExchangePrompt(originalExercise, reason, preferences, userLanguage);
  }

  static getFoodAnalysisPrompt(userLanguage: string = 'en'): PromptConfig {
    return createFoodAnalysisPrompt(userLanguage);
  }

  static getFitnessChatPrompt(userProfile: any, userLanguage: string = 'en'): PromptConfig {
    return createFitnessChatPrompt(userProfile, userLanguage);
  }

  static getGeneralChatPrompt(userLanguage: string = 'en'): PromptConfig {
    return createGeneralChatPrompt(userLanguage);
  }
}

// Re-export types for backward compatibility
export type { PromptConfig } from './prompts';
