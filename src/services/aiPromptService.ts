
// Centralized AI Prompt Management Service
// All prompts are in English with language-specific response instructions

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

export class AIPromptService {
  
  // Language configurations
  private static getLanguageConfig(language: string): LanguageConfig {
    const configs: Record<string, LanguageConfig> = {
      'ar': {
        language: 'Arabic',
        isRTL: true,
        responseInstructions: 'Respond with all text content, names, instructions, and descriptions in Arabic. Use Arabic names for exercises, foods, and measurements.'
      },
      'en': {
        language: 'English',
        isRTL: false,
        responseInstructions: 'Respond with all text content in English.'
      }
    };
    
    return configs[language] || configs['en'];
  }

  // Meal Plan Generation Prompts
  static getMealPlanPrompt(userProfile: any, preferences: any, dailyCalories: number): PromptConfig {
    const langConfig = this.getLanguageConfig(preferences?.language || 'en');
    const includeSnacks = preferences?.includeSnacks || false;
    const mealsPerDay = includeSnacks ? 5 : 3;
    
    const systemMessage = `You are a professional nutritionist AI. Create personalized meal plans based on user data. 
CRITICAL: Generate EXACTLY 7 days of meals. Each day must have exactly ${mealsPerDay} meals.
${langConfig.responseInstructions}
Always return valid JSON only - no markdown formatting.`;

    const userPrompt = `Create a comprehensive 7-day meal plan for:

USER PROFILE:
- Age: ${userProfile?.age || 25}, Gender: ${userProfile?.gender || 'not specified'}
- Weight: ${userProfile?.weight || 70}kg, Height: ${userProfile?.height || 170}cm
- Activity Level: ${userProfile?.activity_level || 'moderate'}
- Daily Calorie Target: ${dailyCalories} calories
- Nationality: ${userProfile?.nationality || 'International'}

PREFERENCES:
- Cuisine Types: ${preferences?.cuisineTypes?.join(', ') || 'mixed'}
- Dietary Restrictions: ${preferences?.dietaryRestrictions?.join(', ') || 'none'}
- Allergies: ${preferences?.allergies?.join(', ') || 'none'}
- Max Prep Time: ${preferences?.maxPrepTime || 30} minutes
- Include Snacks: ${includeSnacks ? 'Yes (5 meals/day)' : 'No (3 meals/day)'}

REQUIREMENTS:
- Generate exactly 7 days starting from Saturday
- Each day must have exactly ${mealsPerDay} meals
- Meal types: ${includeSnacks ? 'breakfast, snack, lunch, snack, dinner' : 'breakfast, lunch, dinner'}
- All nutrition values per 100g
- Realistic prep and cook times
- Cultural authenticity for specified cuisine`;

    const responseFormat = `{
  "days": [
    {
      "day": 1,
      "meals": [
        {
          "type": "breakfast",
          "name": "meal name",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "prep_time": number,
          "cook_time": number,
          "servings": number,
          "ingredients": ["ingredient 1", "ingredient 2"],
          "instructions": ["step 1", "step 2"],
          "alternatives": ["alternative 1", "alternative 2"]
        }
      ]
    }
  ]
}`;

    return {
      systemMessage,
      userPrompt,
      responseFormat,
      temperature: 0.7,
      maxTokens: 4000
    };
  }

  // Exercise Program Generation Prompts
  static getExerciseProgramPrompt(userProfile: any, preferences: any, workoutType: 'home' | 'gym'): PromptConfig {
    const langConfig = this.getLanguageConfig(preferences?.userLanguage || 'en');
    
    const systemMessage = `You are a certified fitness trainer AI. Create safe, effective workout programs.
${langConfig.responseInstructions}
Always return valid JSON only - no markdown formatting.`;

    const userPrompt = `Create a comprehensive 1-week ${workoutType} workout program for:

USER PROFILE:
- Age: ${userProfile?.age || 25}, Gender: ${userProfile?.gender || 'not specified'}
- Weight: ${userProfile?.weight || 70}kg, Height: ${userProfile?.height || 170}cm
- Activity Level: ${userProfile?.activity_level || 'moderate'}
- Fitness Goal: ${preferences?.goalType || 'general fitness'}
- Fitness Level: ${preferences?.fitnessLevel || 'beginner'}
- Available Time: ${preferences?.availableTime || 45} minutes per session
- Health Conditions: ${userProfile?.health_conditions?.join(', ') || 'none'}

PROGRAM REQUIREMENTS:
- Create exactly 7 days (determine training vs rest days based on fitness level)
- Beginner: 3-4 training days, Intermediate: 4-5 training days, Advanced: 5-6 training days
- ${workoutType === 'gym' ? 'Use gym equipment (weights, machines, cables)' : 'Bodyweight exercises only'}
- ${workoutType === 'gym' ? '5-8 exercises per training day' : '4-7 exercises per training day'}
- Progressive difficulty based on fitness level
- Target different muscle groups
- Include warm-up and cool-down guidance
- Proper form instructions and safety notes`;

    const responseFormat = `{
  "programOverview": {
    "name": "program name",
    "duration": "1 week",
    "difficulty": "fitness level",
    "description": "program description"
  },
  "weeks": [{
    "weekNumber": 1,
    "workouts": [
      {
        "day": 1,
        "workoutName": "workout name",
        "estimatedDuration": number,
        "estimatedCalories": number,
        "muscleGroups": ["muscle1", "muscle2"],
        "exercises": [
          {
            "name": "exercise name",
            "sets": number,
            "reps": "reps",
            "restSeconds": number,
            "muscleGroups": ["muscle1"],
            "instructions": "detailed instructions",
            "youtubeSearchTerm": "search term",
            "equipment": "equipment needed",
            "difficulty": "difficulty level",
            "orderNumber": number
          }
        ]
      }
    ]
  }]
}`;

    return {
      systemMessage,
      userPrompt,
      responseFormat,
      temperature: 0.3,
      maxTokens: 4000
    };
  }

  // Food Analysis Prompts
  static getFoodAnalysisPrompt(userLanguage: string = 'en'): PromptConfig {
    const langConfig = this.getLanguageConfig(userLanguage);
    
    const systemMessage = `You are a nutrition analysis expert. Analyze food images and provide accurate nutritional information.
${langConfig.responseInstructions}
Always return valid JSON only - no markdown formatting.`;

    const userPrompt = `Analyze this food image and identify all food items with their nutritional information.

ANALYSIS REQUIREMENTS:
- Identify 1-5 main food items
- Estimate serving sizes based on visual cues
- Provide nutrition values per 100g
- Use appropriate food categories
- Make realistic estimates for calories and macros
- Consider preparation methods (fried, grilled, etc.)`;

    const responseFormat = `{
  "foodItems": [
    {
      "name": "food name",
      "category": "protein|vegetables|fruits|grains|dairy|nuts|beverages|snacks|general",
      "cuisine": "cuisine type",
      "calories": number_per_100g,
      "protein": number_per_100g,
      "carbs": number_per_100g,
      "fat": number_per_100g,
      "fiber": number_per_100g,
      "sugar": number_per_100g,
      "quantity": "estimated serving description"
    }
  ],
  "overallConfidence": 0.8,
  "cuisineType": "cuisine",
  "suggestions": "brief analysis"
}`;

    return {
      systemMessage,
      userPrompt,
      responseFormat,
      temperature: 0.1,
      maxTokens: 1000
    };
  }

  // Exercise Exchange Prompts
  static getExerciseExchangePrompt(originalExercise: any, reason: string, preferences: any, userLanguage: string = 'en'): PromptConfig {
    const langConfig = this.getLanguageConfig(userLanguage);
    
    const systemMessage = `You are a fitness expert AI. Provide suitable exercise alternatives that target the same muscle groups.
${langConfig.responseInstructions}
Always return valid JSON only - no markdown formatting.`;

    const userPrompt = `Find a suitable alternative for this exercise:

CURRENT EXERCISE:
- Name: ${originalExercise.name}
- Sets: ${originalExercise.sets || 3}
- Reps: ${originalExercise.reps || '12'}
- Equipment: ${originalExercise.equipment || 'bodyweight'}
- Muscle Groups: ${originalExercise.muscle_groups?.join(', ') || 'full body'}
- Instructions: ${originalExercise.instructions || 'No instructions'}

EXCHANGE REASON: ${reason}

AVAILABLE EQUIPMENT: ${preferences?.equipment?.join(', ') || 'any suitable equipment'}

REQUIREMENTS:
- Target the same muscle groups
- Match difficulty level
- Consider available equipment
- Address the exchange reason
- Maintain similar workout structure`;

    const responseFormat = `{
  "name": "exercise name",
  "sets": ${originalExercise.sets || 3},
  "reps": "${originalExercise.reps || '12'}",
  "rest_seconds": ${originalExercise.rest_seconds || 60},
  "muscle_groups": ${JSON.stringify(originalExercise.muscle_groups || ['full_body'])},
  "equipment": "required equipment",
  "difficulty": "${originalExercise.difficulty || 'intermediate'}",
  "instructions": "detailed instructions",
  "youtube_search_term": "search term for tutorial"
}`;

    return {
      systemMessage,
      userPrompt,
      responseFormat,
      temperature: 0.7,
      maxTokens: 1000
    };
  }

  // Fitness Chat Prompts
  static getFitnessChatPrompt(userProfile: any, userLanguage: string = 'en'): PromptConfig {
    const langConfig = this.getLanguageConfig(userLanguage);
    
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
  }

  // General Chat Prompts
  static getGeneralChatPrompt(userLanguage: string = 'en'): PromptConfig {
    const langConfig = this.getLanguageConfig(userLanguage);
    
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
  }
}
