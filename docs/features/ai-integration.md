
# AI Integration Guide

## 🤖 Overview
FitFatta AI leverages multiple AI providers to deliver personalized fitness and nutrition guidance through a robust, fallback-enabled system with comprehensive credit management.

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
- **Admin Management**: Reset user credits via admin panel
- **Usage Tracking**: Comprehensive logging in `ai_generation_logs`

## 🍽️ Meal Plan Generation

### Generation Process
```
User Input → Profile Analysis → AI Prompt → OpenAI API → Response Parsing → Database Storage
```

### Current Implementation
Located in: `supabase/functions/generate-meal-plan/index.ts`

**Key Features**:
- Cultural cuisine adaptation based on nationality
- Life-phase adjustments (pregnancy, breastfeeding, fasting)
- Nutritional target optimization
- Multi-language support (English/Arabic)
- Fallback AI providers for reliability

### Prompt Structure
```typescript
interface MealPlanPrompt {
  systemMessage: string;     // AI role and cultural guidelines
  userPrompt: string;        // User preferences and requirements
  responseFormat: string;    // Expected JSON structure
  temperature: number;       // Creativity level (0.1-0.3)
  maxTokens: number;        // Response length limit (8000)
}
```

### Cultural Adaptation Features
- **Nationality-Based Cuisine**: Automatic cuisine selection
- **Dietary Restrictions**: Comprehensive filtering system
- **Allergies**: Intelligent ingredient substitutions
- **Religious Considerations**: Halal, kosher compliance
- **Regional Preferences**: Local ingredient availability

## 🏋️ Exercise Program Generation

### Program Creation Flow
```
Fitness Goals → Equipment Available → Difficulty Level → AI Generation → Program Structure
```

### Current Implementation
Located in: `supabase/functions/generate-exercise-program/index.ts`

**Program Features**:
- Home/Gym variants based on equipment
- Progressive overload planning
- YouTube integration for exercise tutorials
- Alternative exercise suggestions
- Muscle group targeting
- Duration and intensity customization

### Program Structure
```typescript
interface ExerciseProgram {
  programName: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  workoutType: 'home' | 'gym';
  weeklyWorkouts: DailyWorkout[];
  totalEstimatedCalories: number;
}
```

## 📸 Food Image Analysis

### Visual Analysis Process
```
Photo Upload → Image Processing → AI Analysis → Nutrition Estimation → Result Display
```

### Current Implementation
Located in: `supabase/functions/analyze-food-image/index.ts`

**Analysis Capabilities**:
- Multi-food recognition in single image
- Portion size estimation
- Calorie and macro calculation
- Confidence scoring for accuracy
- Cultural food recognition
- Integration with food database

### Analysis Response Format
```typescript
interface FoodAnalysis {
  recognizedFoods: Array<{
    name: string;
    confidence: number;
    estimatedQuantity: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  totalCalories: number;
  overallConfidence: number;
  analysisModel: string;
  processingTime: number;
}
```

## 🔄 Smart Exchange Systems

### Meal Exchange
Located in: `supabase/functions/generate-meal-alternatives/index.ts`

**Features**:
- Nutritionally equivalent swaps
- Cultural preference preservation
- Dietary restriction compliance
- Preparation time matching
- Ingredient availability consideration

### Exercise Exchange
Located in: `supabase/functions/exchange-exercise/index.ts`

**Features**:
- Same muscle group targeting
- Equipment substitution
- Difficulty level matching
- Time duration preservation
- Progressive overload maintenance

## 💬 AI Chat Systems

### Fitness Chat
Located in: `supabase/functions/fitness-chat/index.ts`

**Specialized Features**:
- Personalized fitness coaching
- Exercise form guidance
- Nutrition advice
- Progress encouragement
- Goal setting assistance
- Cultural sensitivity

### General Chat
Located in: `supabase/functions/chat/index.ts`

**General Purpose AI**:
- Health and wellness questions
- Lifestyle advice
- Motivation support
- Educational content
- Quick answers

## ⚙️ Edge Function Architecture

### Standard Function Structure
```typescript
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Unauthorized');

    // Credit check for AI functions
    const creditCheck = await checkAndUseAIGeneration(userId, generationType);
    if (!creditCheck.success) {
      throw new Error('Insufficient credits');
    }

    // AI processing with fallback
    const result = await processWithAIFallback(prompt, options);
    
    // Complete generation log
    await completeAIGeneration(creditCheck.log_id, result);

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
```

### Error Handling & Fallbacks
```typescript
async function processWithAIFallback(prompt: string, options: any) {
  const providers = ['openai', 'google', 'anthropic'];
  
  for (const provider of providers) {
    try {
      const result = await callAIProvider(provider, prompt, options);
      console.log(`✅ Success with ${provider}`);
      return result;
    } catch (error) {
      console.log(`❌ ${provider} failed:`, error.message);
      if (provider === providers[providers.length - 1]) {
        throw new Error('All AI providers failed');
      }
    }
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
- Religious and cultural considerations

## 📊 AI Usage Analytics

### Generation Logging
Every AI operation is tracked in `ai_generation_logs`:
```sql
INSERT INTO ai_generation_logs (
  user_id,
  generation_type,
  prompt_data,
  response_data,
  credits_used,
  processing_time,
  status
);
```

### Performance Metrics
- **Response Time**: Average generation duration
- **Success Rate**: Successful vs failed generations  
- **User Satisfaction**: Feedback and regeneration rates
- **Provider Performance**: Success rates by AI provider
- **Credit Consumption**: Usage patterns and trends

## 🔒 Security & Rate Limiting

### API Key Protection
```typescript
// Stored securely in Supabase secrets
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');
```

### Rate Limiting Implementation
- **Credit System**: Per-user generation limits
- **Time-Based Limits**: Cooldown periods
- **Abuse Detection**: Automated monitoring
- **Admin Override**: Emergency credit reset

### Credit Management Functions
```sql
-- Check and use AI generation
SELECT check_and_use_ai_generation(user_id, 'meal_plan', prompt_data);

-- Complete AI generation
SELECT complete_ai_generation(log_id, response_data, error_message);

-- Reset user credits (admin only)
SELECT reset_ai_generations(user_id, new_count);
```

## 🧪 Testing AI Features

### Mock Responses for Development
```typescript
const mockResponses = {
  meal_plan: {
    meals: [/* structured meal data */],
    nutrition: {/* nutrition totals */}
  },
  exercise_program: {
    workouts: [/* workout data */],
    difficulty: 'intermediate'
  }
};
```

### Integration Testing
- End-to-end AI generation flows
- Error handling verification
- Multi-language response testing
- Provider fallback testing
- Performance benchmarking

## 🚀 Future AI Enhancements

### Planned Features
- **Conversation Memory**: Context-aware multi-turn chats
- **Computer Vision**: Advanced posture analysis
- **Predictive Analytics**: Health outcome forecasting
- **Voice Integration**: Speech-to-text meal logging
- **Real-time Coaching**: Live workout guidance

### Model Improvements
- **Fine-tuning**: Custom models for nutrition and fitness
- **Context Awareness**: Better user preference learning
- **Real-time Adaptation**: Dynamic plan adjustments
- **Multi-modal AI**: Text, image, and voice integration

---
*Intelligent AI integration powering personalized fitness experiences*
