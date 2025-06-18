
# AI Integration Guide

## 🤖 Overview
FitFatta AI leverages multiple AI providers to deliver personalized fitness and nutrition guidance through a robust, fallback-enabled system.

## 🔧 AI Service Architecture

### Multi-Provider Setup
```typescript
// Primary provider hierarchy
1. OpenAI (GPT-4o-mini, GPT-4o)
2. Google Gemini (fallback)
3. Anthropic Claude (backup)
```

### Credit Management System
- **New Users**: 5 AI generations
- **Rate Limiting**: Prevents API abuse
- **Admin Management**: Reset user credits
- **Usage Tracking**: Comprehensive logging

## 🍽️ Meal Plan Generation

### Generation Process
```
User Input → Profile Analysis → AI Prompt → OpenAI API → Response Parsing → Database Storage
```

### Prompt Structure
```typescript
interface MealPlanPrompt {
  systemMessage: string;     // AI role and guidelines
  userPrompt: string;        // User preferences and requirements
  responseFormat: string;    // Expected JSON structure
  temperature: number;       // Creativity level (0.3-0.7)
  maxTokens: number;        // Response length limit
}
```

### Cultural Adaptation
- **Nationality-Based**: Cuisine preferences by user's nationality
- **Dietary Restrictions**: Vegetarian, vegan, halal, kosher, etc.
- **Allergies**: Intelligent ingredient substitutions
- **Life Phases**: Pregnancy, breastfeeding adjustments

### Example Generation
```typescript
const mealPlan = await generateMealPlan({
  userId: "user-123",
  preferences: {
    cuisine: "mediterranean",
    dietaryRestrictions: ["vegetarian"],
    allergies: ["nuts"],
    weekStartDate: "2025-06-18"
  },
  nutritionTargets: {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67
  }
});
```

## 🏋️ Exercise Program Generation

### Program Creation
```
Fitness Goals → Equipment Available → Difficulty Level → AI Generation → Program Structure
```

### Program Features
- **Home/Gym Variants**: Equipment-based adaptations
- **Progressive Overload**: Automatic difficulty scaling
- **YouTube Integration**: Exercise tutorial links
- **Alternative Exercises**: AI-powered substitutions

### Example Program
```typescript
const exerciseProgram = await generateExerciseProgram({
  userId: "user-123",
  goals: ["muscle_gain", "strength"],
  equipment: ["dumbbells", "resistance_bands"],
  experience: "intermediate",
  duration: "45_minutes",
  frequency: 4 // days per week
});
```

## 📸 Food Image Analysis

### Visual Analysis Process
```
Photo Upload → Image Processing → AI Analysis → Nutrition Estimation → Result Display
```

### Analysis Capabilities
- **Food Recognition**: Identify multiple food items
- **Portion Estimation**: Visual portion size calculation
- **Nutrition Calculation**: Calories, macros, micronutrients
- **Confidence Scoring**: Accuracy indicators

### Usage Example
```typescript
const analysis = await analyzeFoodImage({
  imageFile: selectedImage,
  userId: "user-123",
  mealType: "lunch"
});

// Returns:
// {
//   foods: [{ name: "grilled chicken", calories: 250, ... }],
//   totalCalories: 650,
//   confidence: 0.87
// }
```

## 🔄 Exchange Systems

### Meal Exchange
```typescript
// Smart meal swapping while maintaining nutrition
const alternatives = await exchangeMeal({
  originalMeal: currentMeal,
  preferences: userPreferences,
  nutritionTargets: dailyTargets
});
```

### Exercise Exchange
```typescript
// Alternative exercises for same muscle groups
const exerciseAlternatives = await exchangeExercise({
  originalExercise: currentExercise,
  equipment: availableEquipment,
  difficulty: userLevel
});
```

## ⚙️ Edge Function Implementation

### Meal Plan Generation
```typescript
// supabase/functions/generate-meal-plan/index.ts
export default async function handler(req: Request) {
  // Validate request
  // Check user credits
  // Generate AI prompt
  // Call OpenAI API
  // Parse and validate response
  // Store in database
  // Return formatted result
}
```

### Error Handling & Fallbacks
```typescript
try {
  return await openaiGeneration(prompt);
} catch (openaiError) {
  console.log('OpenAI failed, trying Gemini...');
  try {
    return await geminiGeneration(prompt);
  } catch (geminiError) {
    console.log('Gemini failed, trying Claude...');
    return await claudeGeneration(prompt);
  }
}
```

## 🌐 Multi-Language AI Responses

### Language-Aware Prompts
```typescript
const promptConfig = createMealPlanPrompt(userProfile, 'ar');
// Automatically includes Arabic response instructions
// AI responds in Arabic with culturally appropriate content
```

### RTL Content Handling
- Arabic recipe instructions in proper RTL format
- Cultural food names and cooking methods
- Localized measurement units

## 📊 AI Usage Analytics

### Generation Logging
```sql
-- Every AI operation is tracked
INSERT INTO ai_generation_logs (
  user_id,
  generation_type,
  prompt_data,
  response_data,
  credits_used,
  processing_time
);
```

### Performance Metrics
- **Response Time**: Average generation duration
- **Success Rate**: Successful vs failed generations
- **User Satisfaction**: Feedback and regeneration rates
- **Provider Performance**: Success rates by AI provider

## 🔒 Security & Rate Limiting

### API Key Protection
```typescript
// Stored securely in Supabase secrets
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
```

### Rate Limiting
- **Credit System**: Prevents unlimited usage
- **User-Based Limits**: Per-user generation caps
- **Time-Based Limits**: Cooldown periods
- **Abuse Detection**: Automated monitoring

## 🧪 Testing AI Features

### Mock Responses
```typescript
// Test with predictable AI responses
const mockMealPlan = {
  breakfast: { name: "Oatmeal", calories: 300 },
  lunch: { name: "Grilled Chicken Salad", calories: 450 },
  dinner: { name: "Salmon with Rice", calories: 600 }
};
```

### Integration Testing
- End-to-end AI generation flows
- Error handling verification
- Multi-language response testing
- Performance benchmarking

## 🚀 Future AI Enhancements

### Planned Features
- **Conversation AI**: Natural language meal planning
- **Computer Vision**: Advanced posture analysis
- **Predictive Analytics**: Health outcome forecasting
- **Personalized Coaching**: AI-powered fitness guidance

### Model Improvements
- **Fine-tuning**: Custom models for nutrition
- **Context Awareness**: Better user preference learning
- **Real-time Adaptation**: Dynamic plan adjustments
- **Multi-modal AI**: Text, image, and voice integration

---
*Intelligent AI integration for personalized fitness experiences*
