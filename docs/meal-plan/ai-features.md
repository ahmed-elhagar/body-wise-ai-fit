
# Meal Plan AI Features

Complete guide to AI-powered meal planning features for React Native/Expo implementation.

## 🧠 AI Architecture Overview

### Multi-Model Fallback System
```typescript
interface AIModelConfig {
  provider: 'openai' | 'google' | 'anthropic';
  modelId: string;
  priority: number;
  capabilities: string[];
  maxTokens: number;
  costPerToken: number;
}

const mealPlanModels: AIModelConfig[] = [
  {
    provider: 'openai',
    modelId: 'gpt-4o-mini',
    priority: 1,
    capabilities: ['meal_planning', 'cultural_cuisine', 'life_phase_nutrition'],
    maxTokens: 8000,
    costPerToken: 0.000075
  },
  {
    provider: 'google',
    modelId: 'gemini-1.5-flash-8b',
    priority: 2,
    capabilities: ['meal_planning', 'recipe_generation'],
    maxTokens: 8000,
    costPerToken: 0.000038
  },
  {
    provider: 'anthropic',
    modelId: 'claude-3-haiku',
    priority: 3,
    capabilities: ['meal_planning', 'dietary_restrictions'],
    maxTokens: 8000,
    costPerToken: 0.000125
  }
];
```

## 🍽️ Intelligent Meal Planning

### 1. Cultural Cuisine Intelligence

**Supported Cuisines:**
- **Middle Eastern**: Saudi, Egyptian, Lebanese, Palestinian, Jordanian
- **South Asian**: Indian, Pakistani, Bangladeshi
- **Mediterranean**: Greek, Turkish, Italian, Spanish
- **East Asian**: Chinese, Japanese, Korean, Thai
- **Western**: American, British, French, German

**Cultural Food Mapping:**
```typescript
const culturalFoodMaps = {
  'Saudi Arabia': {
    staples: ['rice', 'dates', 'lamb', 'chicken', 'yogurt'],
    spices: ['cardamom', 'cinnamon', 'black_lime', 'baharat'],
    cookingMethods: ['grilled', 'slow_cooked', 'rice_dishes'],
    mealStructure: {
      breakfast: ['ful', 'shakshuka', 'cheese_olives'],
      lunch: ['kabsa', 'mandi', 'machboos'],
      dinner: ['grilled_meats', 'stews', 'salads'],
      snacks: ['dates', 'nuts', 'fruit']
    },
    restrictions: ['halal_only', 'no_pork', 'no_alcohol'],
    ramadanConsiderations: {
      iftar: ['dates', 'soup', 'light_appetizers'],
      suhoor: ['slow_digesting_carbs', 'protein', 'hydrating_foods']
    }
  },
  'Egypt': {
    staples: ['rice', 'bread', 'lentils', 'beans', 'vegetables'],
    signature_dishes: ['koshari', 'molokhia', 'fatteh', 'mahshi'],
    proteins: ['chicken', 'fish', 'lamb', 'legumes'],
    dairy: ['cheese', 'yogurt', 'milk'],
    cooking_oils: ['olive_oil', 'sunflower_oil']
  }
};
```

### 2. Life-Phase Nutrition Intelligence

**Pregnancy Nutrition Adjustments:**
```typescript
const pregnancyNutrition = {
  trimester1: {
    extraCalories: 0,
    keyNutrients: ['folate', 'iron', 'calcium'],
    avoidFoods: ['raw_fish', 'unpasteurized_dairy', 'high_mercury_fish'],
    recommendations: [
      'Small frequent meals for nausea',
      'Ginger for morning sickness',
      'Complex carbohydrates for energy'
    ]
  },
  trimester2: {
    extraCalories: 340,
    keyNutrients: ['protein', 'calcium', 'iron', 'folate'],
    supplements: ['prenatal_vitamins', 'omega3'],
    mealAdjustments: {
      protein: '+25g daily',
      calcium: '1200mg daily',
      iron: '27mg daily'
    }
  },
  trimester3: {
    extraCalories: 450,
    keyNutrients: ['protein', 'calcium', 'iron', 'dha'],
    considerations: [
      'Smaller portions due to stomach compression',
      'Focus on nutrient-dense foods',
      'Adequate hydration'
    ]
  }
};

const breastfeedingNutrition = {
  exclusive: {
    extraCalories: 400,
    keyNutrients: ['protein', 'calcium', 'iron', 'omega3'],
    hydration: 'extra_2_3_liters_daily',
    avoidFoods: ['excess_caffeine', 'alcohol', 'high_mercury_fish']
  },
  partial: {
    extraCalories: 250,
    keyNutrients: ['protein', 'calcium', 'vitamins'],
    balanceNote: 'Adjust based on milk production level'
  }
};
```

### 3. Smart Nutrition Calculation

**BMR & TDEE Calculation:**
```typescript
const calculateDailyCalories = (userProfile: UserProfile) => {
  // Harris-Benedict Equation for BMR
  let bmr: number;
  
  if (userProfile.gender === 'male') {
    bmr = 88.362 + (13.397 * userProfile.weight) + 
          (4.799 * userProfile.height) - (5.677 * userProfile.age);
  } else {
    bmr = 447.593 + (9.247 * userProfile.weight) + 
          (3.098 * userProfile.height) - (4.330 * userProfile.age);
  }
  
  // Activity Level Multipliers
  const activityMultipliers = {
    'sedentary': 1.2,
    'lightly_active': 1.375,
    'moderately_active': 1.55,
    'very_active': 1.725,
    'extremely_active': 1.9
  };
  
  const tdee = bmr * activityMultipliers[userProfile.activity_level];
  
  // Fitness Goal Adjustments
  const goalAdjustments = {
    'weight_loss': -500, // 500 calorie deficit
    'weight_gain': 500,  // 500 calorie surplus
    'muscle_gain': 300,  // Moderate surplus
    'maintenance': 0     // No adjustment
  };
  
  let dailyCalories = tdee + goalAdjustments[userProfile.fitness_goal];
  
  // Life Phase Adjustments
  if (userProfile.pregnancy_trimester) {
    const pregnancyCalories = {
      1: 0, 2: 340, 3: 450
    };
    dailyCalories += pregnancyCalories[userProfile.pregnancy_trimester];
  }
  
  if (userProfile.breastfeeding_level) {
    const breastfeedingCalories = {
      'exclusive': 400,
      'partial': 250
    };
    dailyCalories += breastfeedingCalories[userProfile.breastfeeding_level];
  }
  
  return Math.round(dailyCalories);
};
```

## 🤖 AI Prompt Engineering

### 1. Meal Plan Generation Prompt
```typescript
const generateMealPlanPrompt = (userProfile: UserProfile, preferences: any) => {
  const language = preferences.language || 'en';
  const isArabic = language === 'ar';
  
  const basePrompt = isArabic ? `
أنت خبير تغذية بالذكاء الاصطناعي متخصص في التخطيط المخصص للوجبات.
أنشئ خطة وجبات شاملة لمدة 7 أيام تكون مناسبة ثقافياً ومتوازنة غذائياً.
` : `
You are a professional nutritionist AI specializing in personalized meal planning.
Create a comprehensive 7-day meal plan that is culturally appropriate and nutritionally balanced.
`;

  const culturalContext = buildCulturalContext(userProfile.nationality, language);
  const lifePhaseContext = buildLifePhaseContext(userProfile, language);
  const dietaryRestrictions = buildDietaryRestrictions(userProfile, language);
  
  return `${basePrompt}

User Profile:
- Age: ${userProfile.age}, Gender: ${userProfile.gender}
- Weight: ${userProfile.weight}kg, Height: ${userProfile.height}cm
- Activity Level: ${userProfile.activity_level}
- Daily Calorie Target: ${calculateDailyCalories(userProfile)} calories
- Fitness Goal: ${userProfile.fitness_goal}
- Nationality: ${userProfile.nationality}

${culturalContext}
${lifePhaseContext}
${dietaryRestrictions}

Meal Plan Requirements:
- 7 days starting from Saturday
- ${preferences.includeSnacks ? '5 meals per day (breakfast, snack, lunch, snack, dinner)' : '3 meals per day (breakfast, lunch, dinner)'}
- Maximum preparation time: ${preferences.maxPrepTime || 30} minutes per meal
- Cuisine preference: ${preferences.cuisine || 'mixed'}
- Language: ${language}

For each meal, provide:
1. Name (culturally appropriate)
2. Nutritional information (calories, protein, carbs, fat)
3. Preparation and cooking time
4. Serving size
5. Ingredient list
6. Step-by-step instructions
7. 2-3 alternative meal suggestions
8. YouTube search term for recipe videos

Return as valid JSON with this exact structure:
{
  "days": [
    {
      "day": 1,
      "meals": [
        {
          "type": "breakfast",
          "name": "Traditional Breakfast Name",
          "calories": 400,
          "protein": 20,
          "carbs": 45,
          "fat": 15,
          "prep_time": 15,
          "cook_time": 10,
          "servings": 1,
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2"],
          "alternatives": ["alternative1", "alternative2"],
          "youtube_search_term": "recipe name tutorial"
        }
      ]
    }
  ]
}`;
};
```

### 2. Recipe Generation Prompt
```typescript
const generateRecipePrompt = (mealName: string, userLanguage: string) => {
  const isArabic = userLanguage === 'ar';
  
  return isArabic ? `
أنت طاهي خبير. قدم وصفة مفصلة لـ "${mealName}".

المطلوب:
1. قائمة مكونات دقيقة بالكميات
2. خطوات الطبخ واضحة ومرقمة
3. وقت التحضير والطبخ
4. عدد الحصص
5. نصائح للطبخ
6. بدائل للمكونات إن أمكن
7. معلومات غذائية

اجعل الوصفة سهلة المتابعة للمبتدئين.
` : `
You are an expert chef. Provide a detailed recipe for "${mealName}".

Required:
1. Precise ingredient list with measurements
2. Clear, numbered cooking steps
3. Preparation and cooking time
4. Number of servings
5. Cooking tips
6. Ingredient substitutions if possible
7. Nutritional notes

Make the recipe easy to follow for beginners.
`;
};
```

## 🔄 AI Response Processing

### 1. Response Validation & Parsing
```typescript
class MealPlanAIProcessor {
  static validateMealPlanResponse(response: any): boolean {
    // Validate structure
    if (!response.days || !Array.isArray(response.days)) {
      console.error('Invalid response: missing days array');
      return false;
    }
    
    if (response.days.length !== 7) {
      console.error(`Invalid response: expected 7 days, got ${response.days.length}`);
      return false;
    }
    
    // Validate each day
    for (const day of response.days) {
      if (!day.day || !day.meals || !Array.isArray(day.meals)) {
        console.error('Invalid day structure:', day);
        return false;
      }
      
      // Validate meals
      for (const meal of day.meals) {
        if (!this.validateMeal(meal)) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  static validateMeal(meal: any): boolean {
    const requiredFields = ['name', 'type', 'calories', 'protein', 'carbs', 'fat'];
    
    for (const field of requiredFields) {
      if (meal[field] === undefined || meal[field] === null) {
        console.error(`Missing required field: ${field} in meal:`, meal);
        return false;
      }
    }
    
    // Validate meal type
    const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'snack1', 'snack2'];
    if (!validMealTypes.includes(meal.type)) {
      console.error('Invalid meal type:', meal.type);
      return false;
    }
    
    // Validate nutrition values
    if (meal.calories < 0 || meal.protein < 0 || meal.carbs < 0 || meal.fat < 0) {
      console.error('Invalid nutrition values in meal:', meal);
      return false;
    }
    
    return true;
  }
  
  static cleanAIResponse(response: string): string {
    return response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .trim();
  }
  
  static parseMealPlanResponse(rawResponse: string): any {
    try {
      const cleaned = this.cleanAIResponse(rawResponse);
      const parsed = JSON.parse(cleaned);
      
      if (!this.validateMealPlanResponse(parsed)) {
        throw new Error('Response validation failed');
      }
      
      return this.normalizeMealTypes(parsed);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Invalid AI response format');
    }
  }
  
  static normalizeMealTypes(mealPlan: any): any {
    // Normalize meal types to database-valid values
    const mealTypeMap = {
      'snack1': 'snack',
      'snack2': 'snack',
      'morning_snack': 'snack',
      'afternoon_snack': 'snack',
      'evening_snack': 'snack'
    };
    
    mealPlan.days.forEach((day: any) => {
      day.meals.forEach((meal: any) => {
        if (mealTypeMap[meal.type]) {
          meal.type = mealTypeMap[meal.type];
        }
      });
    });
    
    return mealPlan;
  }
}
```

### 2. Fallback Content Generation
```typescript
const fallbackMealPlans = {
  general: {
    breakfast: {
      name: "Oatmeal with Fruits",
      calories: 300,
      protein: 8,
      carbs: 54,
      fat: 6,
      prep_time: 5,
      cook_time: 5,
      ingredients: ["oats", "milk", "banana", "berries"],
      instructions: ["Boil milk", "Add oats", "Cook 5 min", "Top with fruits"]
    },
    lunch: {
      name: "Grilled Chicken Salad",
      calories: 350,
      protein: 30,
      carbs: 15,
      fat: 18,
      prep_time: 15,
      cook_time: 10,
      ingredients: ["chicken breast", "mixed greens", "tomato", "cucumber"],
      instructions: ["Grill chicken", "Prepare salad", "Combine", "Add dressing"]
    },
    dinner: {
      name: "Salmon with Vegetables",
      calories: 400,
      protein: 35,
      carbs: 20,
      fat: 20,
      prep_time: 10,
      cook_time: 20,
      ingredients: ["salmon fillet", "broccoli", "carrots", "olive oil"],
      instructions: ["Season salmon", "Steam vegetables", "Bake salmon", "Serve"]
    }
  },
  
  middle_eastern: {
    breakfast: {
      name: "Ful Medames",
      calories: 320,
      protein: 12,
      carbs: 48,
      fat: 8,
      prep_time: 10,
      cook_time: 15,
      ingredients: ["fava beans", "olive oil", "garlic", "lemon", "bread"],
      instructions: ["Heat beans", "Add garlic", "Drizzle oil", "Serve with bread"]
    }
  }
};

const generateFallbackMealPlan = (userProfile: UserProfile): any => {
  const cuisine = getCuisineType(userProfile.nationality);
  const baseSet = fallbackMealPlans[cuisine] || fallbackMealPlans.general;
  
  const days = [];
  for (let day = 1; day <= 7; day++) {
    const meals = [
      { ...baseSet.breakfast, type: 'breakfast' },
      { ...baseSet.lunch, type: 'lunch' },
      { ...baseSet.dinner, type: 'dinner' }
    ];
    
    days.push({ day, meals });
  }
  
  return { days };
};
```

## 📱 React Native AI Integration

### 1. AI Loading States
```typescript
interface AILoadingState {
  isGenerating: boolean;
  currentStep: string;
  progress: number;
  estimatedTimeRemaining: number;
}

const aiLoadingSteps = {
  mealPlan: [
    "Analyzing your profile...",
    "Calculating nutrition needs...",
    "Selecting cultural foods...",
    "Generating meal ideas...",
    "Creating recipes...",
    "Finalizing your plan..."
  ]
};

const useAIGeneration = () => {
  const [loadingState, setLoadingState] = useState<AILoadingState>({
    isGenerating: false,
    currentStep: '',
    progress: 0,
    estimatedTimeRemaining: 0
  });
  
  const generateMealPlan = async (userProfile: UserProfile, preferences: any) => {
    setLoadingState({
      isGenerating: true,
      currentStep: aiLoadingSteps.mealPlan[0],
      progress: 0,
      estimatedTimeRemaining: 30000 // 30 seconds
    });
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setLoadingState(prev => {
        const newProgress = Math.min(prev.progress + 16.67, 100);
        const stepIndex = Math.floor(newProgress / 16.67);
        
        return {
          ...prev,
          progress: newProgress,
          currentStep: aiLoadingSteps.mealPlan[stepIndex] || prev.currentStep,
          estimatedTimeRemaining: Math.max(0, prev.estimatedTimeRemaining - 5000)
        };
      });
    }, 5000);
    
    try {
      const result = await supabase.functions.invoke('generate-meal-plan', {
        body: { userData: userProfile, preferences }
      });
      
      clearInterval(progressInterval);
      setLoadingState({
        isGenerating: false,
        currentStep: 'Completed!',
        progress: 100,
        estimatedTimeRemaining: 0
      });
      
      return result;
    } catch (error) {
      clearInterval(progressInterval);
      setLoadingState({
        isGenerating: false,
        currentStep: 'Failed',
        progress: 0,
        estimatedTimeRemaining: 0
      });
      throw error;
    }
  };
  
  return { loadingState, generateMealPlan };
};
```

### 2. Offline AI Fallbacks
```typescript
const AIFallbackService = {
  async getMealSuggestions(userProfile: UserProfile) {
    const cached = await AsyncStorage.getItem('cached_meal_suggestions');
    if (cached) {
      const suggestions = JSON.parse(cached);
      return suggestions.filter((meal: any) => 
        this.matchesDietaryRestrictions(meal, userProfile.dietary_restrictions)
      );
    }
    return fallbackMealPlans.general;
  },
  
  async cacheAIResponse(type: string, key: string, data: any) {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    await AsyncStorage.setItem(`ai_cache_${type}_${key}`, JSON.stringify(cacheEntry));
  },
  
  async getCachedResponse(type: string, key: string) {
    const cached = await AsyncStorage.getItem(`ai_cache_${type}_${key}`);
    if (!cached) return null;
    
    const entry = JSON.parse(cached);
    if (Date.now() > entry.expiresAt) {
      await AsyncStorage.removeItem(`ai_cache_${type}_${key}`);
      return null;
    }
    
    return entry.data;
  }
};
```

This comprehensive AI features documentation provides everything needed to implement intelligent, culturally-aware meal planning in React Native with robust fallback mechanisms and offline support.
