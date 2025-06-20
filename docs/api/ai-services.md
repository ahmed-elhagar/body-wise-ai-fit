
# AI Services API

Comprehensive AI-powered features including chat, image analysis, and content generation.

## 🤖 AI Chat Services

### Fitness Chat
**Endpoint**: `POST /functions/v1/fitness-chat`

**Purpose**: Context-aware fitness and nutrition assistant with conversation history.

**Request Body**:
```json
{
  "message": "What exercises are best for building chest muscles?",
  "userId": "user-uuid",
  "conversationId": "conv-uuid",
  "context": {
    "currentProgram": "home_strength",
    "fitnessLevel": "intermediate",
    "equipment": ["dumbbells", "resistance_bands"],
    "injuries": ["lower_back"]
  },
  "language": "en"
}
```

**Response**:
```json
{
  "success": true,
  "response": "For building chest muscles at your intermediate level with dumbbells and resistance bands, I recommend focusing on these exercises:\n\n1. **Dumbbell Chest Press** - 3 sets of 8-12 reps\n2. **Dumbbell Flyes** - 3 sets of 10-15 reps\n3. **Push-ups** (various angles) - 2-3 sets of 8-15 reps\n4. **Resistance Band Chest Press** - 3 sets of 12-15 reps\n\nGiven your lower back concern, avoid exercises that put excessive strain on your back. Focus on proper form and controlled movements.",
  "conversationId": "conv-uuid",
  "messageId": "msg-uuid",
  "creditsUsed": 1,
  "creditsRemaining": 24,
  "modelUsed": "gpt-4o-mini",
  "responseTime": 1847
}
```

### General AI Chat
**Endpoint**: `POST /functions/v1/chat`

**Request Body**:
```json
{
  "message": "How can I improve my sleep quality?",
  "userId": "user-uuid",
  "conversationId": "conv-uuid",
  "language": "en"
}
```

**Response**:
```json
{
  "success": true,
  "response": "Here are evidence-based strategies to improve your sleep quality:\n\n**Sleep Hygiene:**\n- Maintain consistent sleep/wake times\n- Create a cool, dark sleeping environment\n- Avoid screens 1 hour before bedtime\n\n**Lifestyle Factors:**\n- Regular exercise (but not within 3 hours of bedtime)\n- Limit caffeine after 2 PM\n- Avoid large meals before sleep\n\n**Relaxation Techniques:**\n- Progressive muscle relaxation\n- Deep breathing exercises\n- Meditation or mindfulness\n\nWould you like me to elaborate on any of these strategies?",
  "conversationId": "conv-uuid",
  "creditsUsed": 1,
  "creditsRemaining": 23
}
```

## 📷 Image Analysis Services

### Analyze Food Image
**Endpoint**: `POST /functions/v1/analyze-food-image`

**Purpose**: AI-powered food recognition and nutrition estimation from photos.

**Request**: Multipart form data with image file

**Request Body**:
```json
{
  "userId": "user-uuid",
  "mealType": "lunch",
  "language": "en"
}
```

**Response**:
```json
{
  "success": true,
  "analysis": {
    "detectedFoods": [
      {
        "name": "Grilled Chicken Breast",
        "confidence": 0.92,
        "estimatedQuantityG": 150,
        "nutrition": {
          "calories": 248,
          "protein": 46.2,
          "carbs": 0,
          "fat": 5.4
        },
        "boundingBox": {
          "x": 120,
          "y": 80,
          "width": 200,
          "height": 150
        }
      },
      {
        "name": "Brown Rice",
        "confidence": 0.88,
        "estimatedQuantityG": 100,
        "nutrition": {
          "calories": 112,
          "protein": 2.6,
          "carbs": 25,
          "fat": 0.9
        },
        "boundingBox": {
          "x": 320,
          "y": 100,
          "width": 180,
          "height": 120
        }
      }
    ],
    "totalNutrition": {
      "calories": 360,
      "protein": 48.8,
      "carbs": 25,
      "fat": 6.3
    },
    "overallConfidence": 0.90,
    "cuisineType": "american",
    "mealType": "lunch",
    "suggestions": "Well-balanced meal with good protein. Consider adding vegetables for fiber and micronutrients.",
    "processingTime": 2340
  },
  "creditsUsed": 2,
  "creditsRemaining": 21
}
```

### Generate Meal Image
**Endpoint**: `POST /functions/v1/generate-meal-image`

**Purpose**: Generate AI images for meals using DALL-E.

**Request Body**:
```json
{
  "mealId": "meal-uuid",
  "mealName": "Mediterranean Quinoa Bowl",
  "description": "Healthy quinoa bowl with vegetables, feta cheese, and olive oil dressing",
  "style": "food_photography"
}
```

**Response**:
```json
{
  "success": true,
  "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/...",
  "prompt": "Professional food photography of a Mediterranean quinoa bowl with colorful vegetables, crumbled feta cheese, and olive oil dressing, beautifully plated on a white ceramic bowl",
  "creditsUsed": 3,
  "creditsRemaining": 18
}
```

## 🍽️ Content Generation Services

### Generate AI Snack
**Endpoint**: `POST /functions/v1/generate-ai-snack`

**Purpose**: Quick snack recommendations based on preferences and nutritional needs.

**Request Body**:
```json
{
  "userId": "user-uuid",
  "preferences": {
    "targetCalories": 200,
    "dietaryRestrictions": ["vegetarian"],
    "timeOfDay": "afternoon",
    "cravingType": "sweet"
  },
  "language": "en"
}
```

**Response**:
```json
{
  "success": true,
  "snack": {
    "name": "Greek Yogurt Berry Parfait",
    "description": "Creamy Greek yogurt layered with fresh mixed berries and a drizzle of honey",
    "calories": 195,
    "protein": 15,
    "carbs": 28,
    "fat": 4,
    "ingredients": [
      "1 cup Greek yogurt (plain)",
      "1/2 cup mixed berries",
      "1 tbsp honey",
      "1 tbsp granola (optional)"
    ],
    "instructions": [
      "Layer half the yogurt in a glass or bowl",
      "Add half the berries",
      "Add remaining yogurt",
      "Top with remaining berries",
      "Drizzle with honey and add granola if desired"
    ],
    "prepTime": 3,
    "nutritionBenefits": "High in protein and probiotics, rich in antioxidants from berries",
    "tags": ["vegetarian", "quick", "healthy", "protein_rich"]
  },
  "creditsUsed": 1,
  "creditsRemaining": 17
}
```

## 🔄 AI Model Management

### AI Model Selection
The system uses a multi-provider approach with automatic failover:

**Primary Models**:
- **OpenAI GPT-4o-mini**: Fast, cost-effective for most tasks
- **OpenAI GPT-4o**: More powerful for complex reasoning
- **Google Gemini Pro**: Fallback provider
- **Anthropic Claude**: Secondary fallback

**Model Selection Logic**:
```javascript
const selectOptimalModel = (task, userTier) => {
  if (userTier === 'premium') {
    return task.complexity === 'high' ? 'gpt-4o' : 'gpt-4o-mini';
  }
  return 'gpt-4o-mini'; // Free users get standard model
};
```

### Credit System Management
**Method**: Database Function Call

```javascript
const checkAndUseCredits = async (userId, feature, creditsRequired = 1) => {
  const { data, error } = await supabase.rpc('check_and_use_ai_generation', {
    user_id_param: userId,
    generation_type_param: feature,
    prompt_data_param: { credits_required: creditsRequired }
  });
  
  if (error) throw error;
  return data;
};
```

**Response**:
```json
{
  "success": true,
  "log_id": "log-uuid",
  "remaining": 22
}
```

## 📊 AI Analytics & Usage

### Get AI Usage Statistics
```javascript
const getAIUsageStats = async (userId, timeRange = '30d') => {
  const { data, error } = await supabase
    .from('ai_generation_logs')
    .select(`
      generation_type,
      credits_used,
      status,
      created_at,
      response_data
    `)
    .eq('user_id', userId)
    .gte('created_at', getDateRange(timeRange))
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  const stats = {
    totalCreditsUsed: data.reduce((sum, log) => sum + log.credits_used, 0),
    generationsByType: data.reduce((acc, log) => {
      acc[log.generation_type] = (acc[log.generation_type] || 0) + 1;
      return acc;
    }, {}),
    successRate: (data.filter(log => log.status === 'completed').length / data.length) * 100,
    mostUsedFeature: Object.entries(generationsByType).sort(([,a], [,b]) => b - a)[0]?.[0]
  };
  
  return stats;
};
```

## 🌐 Multi-Language Support

### Language-Specific Responses
**Supported Languages**:
- **English** (`en`): Default language
- **Arabic** (`ar`): RTL support, cultural context

**Cultural Adaptations**:
```javascript
const getCulturalContext = (language, nationality) => {
  const contexts = {
    'ar': {
      'Saudi Arabia': {
        foodPreferences: ['rice', 'lamb', 'dates', 'yogurt'],
        cookingMethods: ['grilling', 'slow_cooking'],
        mealTiming: 'late_dinner',
        religiousConsiderations: ['halal', 'ramadan_aware']
      }
    }
  };
  
  return contexts[language]?.[nationality] || {};
};
```

## 🚫 Error Handling & Rate Limiting

### Credit Management
- **Free Users**: 5 AI generations per day
- **Premium Users**: Unlimited generations
- **Reset**: Daily at midnight UTC

### Error Responses
```javascript
const AI_ERRORS = {
  'INSUFFICIENT_CREDITS': {
    message: 'You need more credits for AI features',
    upgradeRequired: true
  },
  'AI_SERVICE_UNAVAILABLE': {
    message: 'AI service temporarily unavailable',
    retryAfter: 300
  },
  'INVALID_IMAGE_FORMAT': {
    message: 'Please upload a valid image file (JPG, PNG)',
    supportedFormats: ['jpeg', 'jpg', 'png']
  },
  'RATE_LIMIT_EXCEEDED': {
    message: 'Too many requests. Please wait before trying again',
    retryAfter: 60
  }
};
```

### Fallback Mechanisms
```javascript
const callAIWithFallback = async (prompt, providers = ['openai', 'google', 'anthropic']) => {
  for (const provider of providers) {
    try {
      return await callAIProvider(provider, prompt);
    } catch (error) {
      console.warn(`${provider} failed, trying next provider`);
      continue;
    }
  }
  throw new Error('All AI providers failed');
};
```

## 🔄 Real-time AI Features

### Streaming Responses
For long-form content generation:

```javascript
const streamAIResponse = async (prompt, onChunk) => {
  const response = await fetch('/functions/v1/stream-ai-response', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  
  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = new TextDecoder().decode(value);
    onChunk(chunk);
  }
};
```

This comprehensive AI services API provides intelligent, context-aware assistance across all aspects of fitness, nutrition, and wellness with multi-language support and cultural sensitivity.
