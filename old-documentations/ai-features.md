
# FitFatta AI Features Documentation

This document details all AI-powered features in the FitFatta platform. Use this to understand how to implement intelligent features in your React Native/Expo app.

## 🧠 AI Architecture Overview

### Multi-Model Fallback System
FitFatta uses an intelligent AI model chain with automatic fallbacks:

```javascript
const modelChain = {
  primary: { provider: 'openai', model: 'gpt-4o-mini' },
  fallback: { provider: 'google', model: 'gemini-1.5-flash-8b' },
  emergency: { provider: 'anthropic', model: 'claude-3-haiku' }
};
```

### Rate Limiting & Credit System
- **Free Users**: 5 AI generations per day
- **Pro Users**: Unlimited AI generations
- **Admin Users**: Unlimited AI generations
- **Credit Reset**: Daily at midnight UTC

### AI Generation Types
1. **Meal Plans** (7-day comprehensive plans)
2. **Exercise Programs** (4-week progressive programs)
3. **Food Analysis** (Image-to-nutrition analysis)
4. **Recipe Generation** (Detailed cooking instructions)
5. **Exercise Exchanges** (Alternative exercise suggestions)
6. **Meal Alternatives** (Dietary preference substitutions)

## 🍽️ AI Meal Planning System

### 1. Intelligent Meal Plan Generation

**Core Features:**
- Personalized nutrition calculations based on BMR/TDEE
- Life-phase adjustments (pregnancy, breastfeeding, fasting)
- Cultural cuisine preferences and dietary restrictions
- Automatic macro distribution and calorie targeting
- Multi-language support (English/Arabic)

**Nutrition Calculation Logic:**
```javascript
// BMR Calculation (Harris-Benedict)
const calculateBMR = (age, weight, height, gender) => {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
};

// TDEE with Activity Multipliers
const activityMultipliers = {
  'sedentary': 1.2,
  'lightly_active': 1.375,
  'moderately_active': 1.55,
  'very_active': 1.725,
  'extremely_active': 1.9
};

// Life Phase Adjustments
const lifePhaseCalories = {
  pregnancy_trimester_2: +340,
  pregnancy_trimester_3: +450,
  breastfeeding_exclusive: +400,
  breastfeeding_partial: +250
};
```

**AI Prompt Engineering:**
```javascript
const mealPlanPrompt = `
You are a professional nutritionist AI specialized in life-phase nutrition.

User Profile:
- Age: ${age}, Gender: ${gender}
- Weight: ${weight}kg, Height: ${height}cm
- Activity Level: ${activityLevel}
- Daily Calorie Target: ${dailyCalories} calories
- Cultural Background: ${nationality}

Special Considerations:
${pregnancyTrimester ? `- Pregnancy Trimester ${pregnancyTrimester}: Extra nutrition needed` : ''}
${breastfeedingLevel ? `- Breastfeeding: ${breastfeedingLevel} level` : ''}
${fastingType ? `- Fasting Type: ${fastingType}` : ''}

Dietary Requirements:
- Restrictions: ${dietaryRestrictions.join(', ')}
- Allergies: ${allergies.join(', ')}

Generate a complete 7-day meal plan with exactly ${mealsPerDay} meals per day.
Include cultural foods from ${nationality} cuisine.
Return as valid JSON with this structure:

{
  "days": [
    {
      "day": 1,
      "meals": [
        {
          "type": "breakfast",
          "name": "Traditional Breakfast",
          "calories": 400,
          "protein": 20,
          "carbs": 45,
          "fat": 15,
          "prep_time": 15,
          "cook_time": 10,
          "servings": 1,
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2"],
          "alternatives": ["alternative1", "alternative2"]
        }
      ]
    }
  ]
}
`;
```

### 2. Smart Recipe Generation

**Features:**
- Detailed ingredient lists with measurements
- Step-by-step cooking instructions
- Prep and cook time estimates
- Serving size calculations
- Cultural adaptation based on user nationality

**Implementation for React Native:**
```javascript
const generateRecipe = async (mealId, userLanguage) => {
  const { data } = await supabase.functions.invoke('generate-meal-recipe', {
    body: { mealId, userLanguage }
  });
  
  return {
    ingredients: data.recipe.ingredients,
    instructions: data.recipe.instructions,
    prepTime: data.recipe.prepTime,
    cookTime: data.recipe.cookTime,
    servings: data.recipe.servings,
    tips: data.recipe.tips
  };
};
```

### 3. Intelligent Meal Alternatives

**Triggers for Alternatives:**
- User dislikes current meal
- Dietary restriction changes
- Ingredient unavailability
- Cultural preference shifts

**React Native Implementation:**
```javascript
const generateMealAlternatives = async (mealId, reason, newPreferences) => {
  const { data } = await supabase.functions.invoke('generate-meal-alternatives', {
    body: {
      mealId,
      reason,
      preferences: newPreferences
    }
  });
  
  return data.alternatives.map(alt => ({
    name: alt.name,
    calories: alt.calories,
    macros: {
      protein: alt.protein,
      carbs: alt.carbs,
      fat: alt.fat
    },
    ingredients: alt.ingredients,
    instructions: alt.instructions
  }));
};
```

## 💪 AI Exercise Programming

### 1. Progressive Program Generation

**Core Features:**
- 4-week structured progression
- Equipment-based exercise selection
- Muscle group balancing
- Difficulty scaling based on fitness level
- Home vs Gym workout variants

**AI Program Structure:**
```javascript
const exerciseProgramPrompt = `
Create a ${duration} ${workoutType} workout program for ${fitnessGoal}.

User Profile:
- Age: ${age}, Fitness Level: ${fitnessLevel}
- Available Time: ${availableTime} minutes per session
- Equipment: ${equipment.join(', ')}
- Injuries/Limitations: ${injuries.join(', ')}
- Goal: ${fitnessGoal}

Program Requirements:
- ${workoutDays} workouts per week
- Progressive overload each week
- Balanced muscle group targeting
- Include warm-up and cool-down
- Rest day recommendations

Generate 4 weeks of workouts with this structure:
{
  "programName": "4-Week Home Strength Program",
  "weeks": [
    {
      "weekNumber": 1,
      "workouts": [
        {
          "dayNumber": 1,
          "workoutName": "Upper Body Strength",
          "estimatedDuration": 45,
          "muscleGroups": ["chest", "shoulders", "triceps"],
          "exercises": [
            {
              "name": "Push-ups",
              "sets": 3,
              "reps": "8-12",
              "restSeconds": 60,
              "muscleGroups": ["chest", "triceps"],
              "instructions": "Keep body straight, control the movement",
              "equipment": "bodyweight",
              "difficulty": "beginner"
            }
          ]
        }
      ]
    }
  ]
}
`;
```

### 2. Smart Exercise Exchange System

**Exchange Triggers:**
- Equipment not available
- Exercise too difficult/easy
- Injury considerations
- User preference

**React Native Implementation:**
```javascript
const exchangeExercise = async (exerciseId, reason, userPreferences) => {
  const { data } = await supabase.functions.invoke('exchange-exercise', {
    body: {
      exerciseId,
      reason,
      preferences: userPreferences,
      userLanguage: 'en',
      userId: user.id
    }
  });
  
  return {
    newExercise: {
      name: data.newExercise.name,
      sets: data.newExercise.sets,
      reps: data.newExercise.reps,
      instructions: data.newExercise.instructions,
      equipment: data.newExercise.equipment
    },
    exchangeReason: data.reason
  };
};
```

### 3. Adaptive Progression System

**Progression Logic:**
```javascript
const calculateProgression = (weekNumber, baseReps, baseSets, difficultyLevel) => {
  const progressionMultipliers = {
    beginner: {
      week1: { sets: 1.0, reps: 1.0 },
      week2: { sets: 1.0, reps: 1.1 },
      week3: { sets: 1.2, reps: 1.1 },
      week4: { sets: 1.2, reps: 1.2 }
    },
    intermediate: {
      week1: { sets: 1.0, reps: 1.0 },
      week2: { sets: 1.1, reps: 1.1 },
      week3: { sets: 1.2, reps: 1.2 },
      week4: { sets: 1.3, reps: 1.2 }
    },
    advanced: {
      week1: { sets: 1.0, reps: 1.0 },
      week2: { sets: 1.2, reps: 1.1 },
      week3: { sets: 1.3, reps: 1.2 },
      week4: { sets: 1.4, reps: 1.3 }
    }
  };
  
  const multiplier = progressionMultipliers[difficultyLevel][`week${weekNumber}`];
  return {
    sets: Math.ceil(baseSets * multiplier.sets),
    reps: Math.ceil(baseReps * multiplier.reps)
  };
};
```

## 📸 AI Food Image Analysis

### 1. Computer Vision Food Recognition

**Features:**
- Multi-food item detection in single image
- Nutrition estimation based on visual portion size
- Cuisine type classification
- Confidence scoring for accuracy
- Cultural food database (Arabic, Western, Asian cuisines)

**React Native Implementation:**
```javascript
const analyzeFoodImage = async (imageUri) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'food-photo.jpg'
  });
  
  const { data } = await supabase.functions.invoke('analyze-food-image', {
    body: formData
  });
  
  return {
    foodItems: data.analysis.foodItems.map(item => ({
      name: item.name,
      category: item.category,
      nutrition: {
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat
      },
      quantity: item.quantity,
      confidence: item.confidence
    })),
    overallConfidence: data.analysis.overallConfidence,
    suggestions: data.analysis.suggestions,
    totalNutrition: data.analysis.totalNutrition
  };
};
```

### 2. Smart Nutrition Estimation

**AI Vision Prompt:**
```javascript
const foodAnalysisPrompt = `
Analyze this food image and identify all visible food items. For each item, estimate:

1. Food name and category
2. Approximate quantity/portion size
3. Nutritional content per 100g
4. Confidence level (0-1)

Consider these factors:
- Plate/container size for scale reference
- Visual texture and density
- Cooking method (fried, grilled, baked)
- Cultural context of the dish

Return JSON format:
{
  "foodItems": [
    {
      "name": "Grilled Chicken Breast",
      "category": "protein",
      "estimatedQuantity": "150g",
      "nutrition": {
        "calories": 248,
        "protein": 46.2,
        "carbs": 0,
        "fat": 5.4
      },
      "confidence": 0.92
    }
  ],
  "overallConfidence": 0.89,
  "suggestions": "Well-balanced meal with lean protein. Consider adding vegetables for extra nutrients."
}
`;
```

### 3. Cultural Food Recognition

**Specialized Databases:**
```javascript
const culturalFoodMaps = {
  arabic: {
    keywords: ['kabsa', 'hummus', 'falafel', 'shawarma', 'tabbouleh'],
    nutritionAdjustments: {
      spiceLevel: 'moderate',
      cookingOil: 'olive_oil',
      portionStyle: 'family_sharing'
    }
  },
  mediterranean: {
    keywords: ['pasta', 'pizza', 'olive', 'feta', 'tzatziki'],
    nutritionAdjustments: {
      cookingOil: 'olive_oil',
      sodiumLevel: 'moderate'
    }
  }
};
```

## 🎨 AI-Generated Content

### 1. Meal Image Generation

**Features:**
- DALL-E 3 integration for high-quality food images
- Cultural context awareness
- Professional food photography style
- Automatic prompt optimization

**Implementation:**
```javascript
const generateMealImage = async (mealName, description, cuisine) => {
  const imagePrompt = `Professional food photography of ${mealName}, ${description}, 
  ${cuisine} cuisine style, beautifully plated on white ceramic plate, 
  natural lighting, overhead view, restaurant quality presentation, 
  appetizing, high resolution, clean background`;
  
  const { data } = await supabase.functions.invoke('generate-meal-image', {
    body: {
      mealId: meal.id,
      mealName: meal.name,
      description: imagePrompt
    }
  });
  
  return data.imageUrl;
};
```

### 2. Dynamic Content Localization

**Multi-Language AI Generation:**
```javascript
const localizedPrompts = {
  en: {
    mealPlan: "Generate a 7-day meal plan with detailed recipes and nutrition information.",
    exercise: "Create a progressive workout program with clear instructions.",
    analysis: "Analyze this food image and provide nutritional breakdown."
  },
  ar: {
    mealPlan: "أنشئ خطة وجبات لمدة 7 أيام مع وصفات مفصلة ومعلومات غذائية.",
    exercise: "إنشاء برنامج تمارين تدريجي مع تعليمات واضحة.",
    analysis: "تحليل صورة الطعام هذه وتقديم التفصيل الغذائي."
  }
};
```

## 🔄 AI Response Processing

### 1. Robust JSON Parsing

**Error Handling for AI Responses:**
```javascript
const parseAIResponse = (aiResponse) => {
  try {
    // Clean AI response from markdown and comments
    const cleanedResponse = aiResponse
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim();
    
    const parsed = JSON.parse(cleanedResponse);
    
    // Validate structure
    if (!validateResponseStructure(parsed)) {
      throw new Error('Invalid response structure');
    }
    
    return parsed;
  } catch (error) {
    console.error('AI Response parsing failed:', error);
    throw new Error('Failed to parse AI response');
  }
};

const validateResponseStructure = (response) => {
  // Implement validation logic based on expected structure
  if (response.days && Array.isArray(response.days)) {
    return response.days.length === 7 && 
           response.days.every(day => day.meals && Array.isArray(day.meals));
  }
  return false;
};
```

### 2. Fallback Content Generation

**When AI Fails:**
```javascript
const fallbackContent = {
  mealPlan: {
    breakfast: { name: "Oatmeal with Fruits", calories: 300, protein: 8, carbs: 54, fat: 6 },
    lunch: { name: "Grilled Chicken Salad", calories: 350, protein: 30, carbs: 15, fat: 18 },
    dinner: { name: "Salmon with Vegetables", calories: 400, protein: 35, carbs: 20, fat: 20 }
  },
  exercises: {
    bodyweight: ["Push-ups", "Squats", "Planks", "Lunges"],
    cardio: ["Jumping Jacks", "High Knees", "Burpees", "Mountain Climbers"]
  }
};

const generateFallbackMealPlan = (userProfile) => {
  const targetCalories = calculateDailyCalories(userProfile);
  return createBalancedMealPlan(targetCalories, fallbackContent.mealPlan);
};
```

## 📊 AI Performance Monitoring

### 1. Generation Success Tracking

**Metrics to Track:**
```javascript
const aiMetrics = {
  generationSuccess: {
    mealPlan: 0.95,
    exerciseProgram: 0.92,
    foodAnalysis: 0.88,
    recipeGeneration: 0.90
  },
  averageResponseTime: {
    mealPlan: 8500, // milliseconds
    exerciseProgram: 6200,
    foodAnalysis: 3100,
    recipeGeneration: 2800
  },
  userSatisfaction: {
    mealPlan: 4.2, // out of 5
    exerciseProgram: 4.4,
    foodAnalysis: 3.9,
    recipeGeneration: 4.1
  }
};
```

### 2. Model Performance Comparison

**A/B Testing Different Models:**
```javascript
const modelPerformance = {
  'gpt-4o-mini': {
    speed: 'fast',
    cost: 'low',
    quality: 'high',
    success_rate: 0.94
  },
  'gemini-1.5-flash-8b': {
    speed: 'very_fast',
    cost: 'very_low',
    quality: 'medium',
    success_rate: 0.89
  },
  'claude-3-haiku': {
    speed: 'medium',
    cost: 'medium',
    quality: 'high',
    success_rate: 0.92
  }
};
```

## 🔧 React Native AI Integration Best Practices

### 1. Loading States and User Feedback

```javascript
const AILoadingComponent = ({ step, totalSteps, message }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={styles.loadingTitle}>AI Processing...</Text>
    <Text style={styles.loadingMessage}>{message}</Text>
    <ProgressBar progress={step / totalSteps} />
    <Text style={styles.progressText}>Step {step} of {totalSteps}</Text>
  </View>
);

const aiLoadingSteps = {
  mealPlan: [
    "Analyzing your profile...",
    "Calculating nutrition needs...",
    "Generating meal ideas...",
    "Creating recipes...",
    "Finalizing your plan..."
  ],
  exercise: [
    "Assessing fitness level...",
    "Designing workout structure...",
    "Selecting exercises...",
    "Creating progression plan..."
  ]
};
```

### 2. Offline AI Features

```javascript
const OfflineAIFallbacks = {
  mealSuggestions: async (userProfile) => {
    const cached = await AsyncStorage.getItem('cached_meal_suggestions');
    if (cached) {
      const suggestions = JSON.parse(cached);
      return suggestions.filter(meal => 
        meal.calories <= userProfile.targetCalories * 0.4
      );
    }
    return fallbackContent.mealPlan;
  },
  
  exerciseAlternatives: async (muscleGroup, equipment) => {
    const cached = await AsyncStorage.getItem('cached_exercises');
    if (cached) {
      const exercises = JSON.parse(cached);
      return exercises.filter(ex => 
        ex.muscleGroups.includes(muscleGroup) && 
        ex.equipment === equipment
      );
    }
    return fallbackContent.exercises[equipment] || fallbackContent.exercises.bodyweight;
  }
};
```

### 3. Smart Caching Strategy

```javascript
const AICacheManager = {
  async cacheAIResponse(type, key, data, ttl = 86400000) { // 24 hours
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      ttl
    };
    await AsyncStorage.setItem(`ai_cache_${type}_${key}`, JSON.stringify(cacheEntry));
  },
  
  async getCachedResponse(type, key) {
    const cached = await AsyncStorage.getItem(`ai_cache_${type}_${key}`);
    if (!cached) return null;
    
    const entry = JSON.parse(cached);
    if (Date.now() - entry.timestamp > entry.ttl) {
      await AsyncStorage.removeItem(`ai_cache_${type}_${key}`);
      return null;
    }
    
    return entry.data;
  },
  
  async invalidateCache(type, pattern) {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => 
      key.startsWith(`ai_cache_${type}`) && 
      key.includes(pattern)
    );
    await AsyncStorage.multiRemove(cacheKeys);
  }
};
```

This comprehensive AI features documentation provides the foundation for implementing intelligent, adaptive features that enhance user experience while maintaining performance and reliability in your React Native/Expo app.
