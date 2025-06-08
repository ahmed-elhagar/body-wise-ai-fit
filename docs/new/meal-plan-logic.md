
# FitFatta Meal Plan Logic Documentation

## Overview
FitFatta's meal planning system uses AI to generate personalized, nutrition-balanced meal plans with support for life phases, dietary restrictions, and cultural preferences.

## Core Architecture

### 1. Meal Plan Generation Pipeline

#### Step 1: User Data Collection
```typescript
interface MealPlanRequest {
  userData: {
    id: string;
    age: number;
    weight: number;
    height: number;
    gender: 'male' | 'female';
    activity_level: string;
    dietary_restrictions: string[];
    allergies: string[];
    pregnancy_trimester?: number;
    breastfeeding_level?: 'exclusive' | 'partial';
    fasting_type?: 'ramadan' | 'islamic';
  };
  preferences: {
    cuisine: string;
    maxPrepTime: string;
    includeSnacks: boolean;
    language: 'en' | 'ar';
    weekOffset: number;
  };
}
```

#### Step 2: Calorie Calculation
```typescript
// Base calorie calculation using Mifflin-St Jeor equation
const calculateBasalMetabolicRate = (weight: number, height: number, age: number, gender: string) => {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
};

// Activity multipliers
const activityMultipliers = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9
};

// Life phase adjustments
const lifePhaseAdjustments = {
  pregnancy_trimester_2: +340,
  pregnancy_trimester_3: +450,
  breastfeeding_exclusive: +400,
  breastfeeding_partial: +250
};
```

#### Step 3: AI Prompt Generation
The system builds enhanced prompts with:
- Base nutritional requirements
- Life phase considerations
- Cultural context
- Dietary restrictions
- Language preferences

```typescript
const generateEnhancedPrompt = (userProfile, preferences, adjustedCalories, nutritionContext) => {
  const basePrompt = buildNutritionalPrompt(userProfile, adjustedCalories);
  const culturalPrompt = addCulturalContext(userProfile.nationality, preferences.language);
  const lifePhasePrompt = addLifePhaseInstructions(nutritionContext);
  
  return `${basePrompt}\n${culturalPrompt}\n${lifePhasePrompt}`;
};
```

#### Step 4: AI Model Execution with Fallback Chain
```typescript
const modelChain = [
  { provider: 'openai', model: 'gpt-4o-mini' },
  { provider: 'google', model: 'gemini-1.5-flash-8b' },
  { provider: 'anthropic', model: 'claude-3-haiku' }
];

// Executes with automatic fallback on failure
const generateWithFallback = async (prompt, modelChain) => {
  for (const modelConfig of modelChain) {
    try {
      return await callAIProvider(modelConfig, prompt);
    } catch (error) {
      console.log(`${modelConfig.provider} failed, trying next...`);
    }
  }
  throw new Error('All AI models failed');
};
```

### 2. Meal Plan Structure

#### Database Schema
```sql
-- Weekly container
CREATE TABLE weekly_meal_plans (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  week_start_date DATE,
  total_calories INTEGER,
  language TEXT,
  nutrition_context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual meals
CREATE TABLE daily_meals (
  id UUID PRIMARY KEY,
  weekly_plan_id UUID REFERENCES weekly_meal_plans,
  day_number INTEGER, -- 1-7 (Saturday to Friday)
  meal_type TEXT, -- breakfast, lunch, dinner, snack
  name TEXT,
  calories INTEGER,
  protein DECIMAL,
  carbs DECIMAL,
  fat DECIMAL,
  fiber DECIMAL,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  instructions JSONB,
  alternatives JSONB
);

-- Ingredients for each meal
CREATE TABLE meal_ingredients (
  id UUID PRIMARY KEY,
  meal_id UUID REFERENCES daily_meals,
  name TEXT,
  amount TEXT,
  unit TEXT,
  category TEXT
);
```

#### Meal Type Distribution
```typescript
const mealDistribution = {
  with_snacks: {
    breakfast: 0.25, // 25% of daily calories
    snack1: 0.10,    // 10% of daily calories
    lunch: 0.30,     // 30% of daily calories
    snack2: 0.10,    // 10% of daily calories
    dinner: 0.25     // 25% of daily calories
  },
  without_snacks: {
    breakfast: 0.30, // 30% of daily calories
    lunch: 0.40,     // 40% of daily calories
    dinner: 0.30     // 30% of daily calories
  }
};
```

## AI Generation Features

### 1. Life Phase Support

#### Pregnancy Support
```typescript
const pregnancyInstructions = {
  trimester_1: {
    extraCalories: 0,
    focusNutrients: ['folic_acid', 'iron', 'calcium'],
    avoidFoods: ['raw_fish', 'unpasteurized_dairy', 'high_mercury_fish'],
    instructions: 'Focus on prenatal nutrition with adequate folate'
  },
  trimester_2: {
    extraCalories: 340,
    focusNutrients: ['protein', 'calcium', 'iron'],
    instructions: 'Increase protein and calcium for fetal development'
  },
  trimester_3: {
    extraCalories: 450,
    focusNutrients: ['protein', 'iron', 'omega3'],
    instructions: 'Higher protein needs for rapid fetal growth'
  }
};
```

#### Islamic Fasting Support
```typescript
const islamicFastingInstructions = {
  ramadan: {
    mealStructure: ['suhoor', 'iftar', 'late_evening'],
    suhoorFocus: 'complex_carbs_protein_hydration',
    iftarFocus: 'gentle_breaking_balanced_nutrition',
    hydrationEmphasis: true,
    instructions: 'Plan for pre-dawn (Suhoor) and sunset (Iftar) meals'
  }
};
```

#### Breastfeeding Support
```typescript
const breastfeedingInstructions = {
  exclusive: {
    extraCalories: 400,
    extraFluids: '2-3L daily',
    focusNutrients: ['protein', 'calcium', 'omega3', 'iron'],
    instructions: 'High-quality nutrition for milk production'
  },
  partial: {
    extraCalories: 250,
    instructions: 'Balanced nutrition to support continued breastfeeding'
  }
};
```

### 2. Cultural Adaptation

#### Regional Cuisine Support
```typescript
const culturalAdaptations = {
  middle_eastern: {
    commonIngredients: ['dates', 'nuts', 'olive_oil', 'yogurt', 'rice'],
    mealPatterns: ['substantial_breakfast', 'light_lunch', 'family_dinner'],
    spices: ['za_atar', 'sumac', 'baharat', 'cardamom']
  },
  mediterranean: {
    commonIngredients: ['olive_oil', 'fish', 'vegetables', 'whole_grains'],
    mealPatterns: ['light_breakfast', 'main_lunch', 'light_dinner']
  }
};
```

### 3. Dietary Restriction Handling
```typescript
const dietaryRestrictions = {
  vegetarian: {
    exclude: ['meat', 'poultry', 'fish', 'seafood'],
    proteinSources: ['legumes', 'nuts', 'dairy', 'eggs']
  },
  vegan: {
    exclude: ['meat', 'poultry', 'fish', 'seafood', 'dairy', 'eggs', 'honey'],
    proteinSources: ['legumes', 'nuts', 'seeds', 'quinoa', 'tofu']
  },
  gluten_free: {
    exclude: ['wheat', 'barley', 'rye', 'pasta', 'bread'],
    alternatives: ['rice', 'quinoa', 'corn', 'gluten_free_oats']
  },
  halal: {
    exclude: ['pork', 'alcohol', 'non_halal_meat'],
    requirements: ['halal_certified_meat', 'no_alcohol_extracts']
  }
};
```

## Meal Exchange System

### 1. Exchange Triggers
```typescript
interface ExchangeReason {
  type: 'dislike' | 'allergy' | 'unavailable' | 'dietary_change' | 'preference';
  description: string;
  urgency: 'low' | 'medium' | 'high';
}
```

### 2. Exchange Logic
```typescript
const generateExchangePrompt = (originalMeal, reason, userPreferences) => {
  return `
Replace this meal: ${originalMeal.name}
Reason: ${reason}
Maintain:
- Similar calories (${originalMeal.calories} ± 50)
- Same meal type (${originalMeal.meal_type})
- Similar prep time (${originalMeal.prep_time + originalMeal.cook_time} minutes)
- Nutritional balance (P: ${originalMeal.protein}g, C: ${originalMeal.carbs}g, F: ${originalMeal.fat}g)

User preferences:
${JSON.stringify(userPreferences)}
`;
};
```

### 3. Exchange Validation
```typescript
const validateExchange = (original, replacement) => {
  const caloriesDiff = Math.abs(original.calories - replacement.calories);
  const proteinDiff = Math.abs(original.protein - replacement.protein);
  
  return {
    valid: caloriesDiff <= 100 && proteinDiff <= 10,
    reasons: {
      calories: caloriesDiff <= 100,
      protein: proteinDiff <= 10,
      mealType: original.meal_type === replacement.meal_type
    }
  };
};
```

## Recipe & Image Generation

### 1. Recipe Enhancement
```typescript
const enhanceRecipe = async (meal) => {
  const prompt = `
Create detailed cooking instructions for: ${meal.name}

Ingredients: ${meal.ingredients?.join(', ')}
Servings: ${meal.servings}
Prep time: ${meal.prep_time} minutes
Cook time: ${meal.cook_time} minutes

Provide:
1. Step-by-step instructions
2. Cooking tips
3. Nutritional highlights
4. Possible substitutions
5. Storage recommendations
`;

  return await callAI(prompt);
};
```

### 2. Recipe Image Search
```typescript
const generateRecipeImage = async (mealName) => {
  // Generate optimized search term for image APIs
  const searchTerm = `${mealName} healthy recipe food photography`;
  
  // Search multiple sources
  const imageSources = [
    'unsplash', 'pexels', 'pixabay'
  ];
  
  for (const source of imageSources) {
    try {
      const imageUrl = await searchImages(source, searchTerm);
      if (imageUrl) return imageUrl;
    } catch (error) {
      console.log(`${source} search failed`);
    }
  }
  
  return generatePlaceholderImage(mealName);
};
```

## Add Snack System

### 1. Snack Calculation Logic
```typescript
const calculateSnackNeeds = (currentMeals, targetCalories) => {
  const currentCalories = currentMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const remainingCalories = targetCalories - currentCalories;
  
  return {
    recommendedCalories: Math.max(100, Math.min(remainingCalories, 300)),
    suggestedMacros: {
      protein: remainingCalories * 0.2 / 4, // 20% protein
      carbs: remainingCalories * 0.5 / 4,   // 50% carbs
      fat: remainingCalories * 0.3 / 9      // 30% fat
    }
  };
};
```

### 2. Smart Snack Suggestions
```typescript
const generateSnackSuggestions = (remainingCalories, userPreferences, timeOfDay) => {
  const snackCategories = {
    morning: ['fruits', 'yogurt', 'nuts'],
    afternoon: ['protein_bar', 'vegetables_hummus', 'cheese'],
    evening: ['herbal_tea', 'small_portion_nuts', 'fruit']
  };
  
  return snackCategories[timeOfDay].filter(snack => 
    meetsCalorieRange(snack, remainingCalories) &&
    matchesPreferences(snack, userPreferences)
  );
};
```

## Shopping List Generation

### 1. Ingredient Aggregation
```typescript
const generateShoppingList = (weeklyMeals) => {
  const aggregatedIngredients = {};
  
  weeklyMeals.forEach(meal => {
    meal.ingredients.forEach(ingredient => {
      const key = ingredient.name.toLowerCase();
      if (aggregatedIngredients[key]) {
        aggregatedIngredients[key].amount += parseFloat(ingredient.amount);
      } else {
        aggregatedIngredients[key] = { ...ingredient };
      }
    });
  });
  
  return groupByCategory(aggregatedIngredients);
};
```

### 2. Smart Quantity Optimization
```typescript
const optimizeQuantities = (ingredients) => {
  return ingredients.map(ingredient => {
    // Round to common package sizes
    if (ingredient.unit === 'kg' && ingredient.amount < 0.5) {
      return { ...ingredient, amount: 0.5, note: 'Minimum package size' };
    }
    
    // Suggest bulk buying for frequently used items
    if (isFrequentlyUsed(ingredient.name) && ingredient.amount > 2) {
      return { ...ingredient, suggestion: 'Consider bulk purchase' };
    }
    
    return ingredient;
  });
};
```

## Performance Optimizations

### 1. Caching Strategies
```typescript
const mealPlanCache = {
  // Cache generated meal plans for 24 hours
  set: (userId, weekOffset, mealPlan) => {
    const key = `meal_plan_${userId}_${weekOffset}`;
    cache.set(key, mealPlan, 24 * 60 * 60); // 24 hours
  },
  
  get: (userId, weekOffset) => {
    const key = `meal_plan_${userId}_${weekOffset}`;
    return cache.get(key);
  }
};
```

### 2. Batch Operations
```typescript
const saveMealsBatch = async (meals, weeklyPlanId) => {
  // Save all meals in a single batch operation
  const mealInserts = meals.map(meal => ({
    ...meal,
    weekly_plan_id: weeklyPlanId,
    created_at: new Date().toISOString()
  }));
  
  const { data: savedMeals } = await supabase
    .from('daily_meals')
    .insert(mealInserts)
    .select();
    
  // Save ingredients in batch
  const ingredientInserts = [];
  savedMeals.forEach(meal => {
    meal.originalIngredients?.forEach(ingredient => {
      ingredientInserts.push({
        meal_id: meal.id,
        ...ingredient
      });
    });
  });
  
  if (ingredientInserts.length > 0) {
    await supabase
      .from('meal_ingredients')
      .insert(ingredientInserts);
  }
};
```

## Error Handling & Validation

### 1. AI Response Validation
```typescript
const validateMealPlan = (aiResponse) => {
  const required = ['days'];
  const dayRequired = ['day', 'meals'];
  const mealRequired = ['name', 'calories', 'protein', 'carbs', 'fat'];
  
  // Validate structure
  if (!hasRequiredFields(aiResponse, required)) {
    throw new Error('Invalid meal plan structure');
  }
  
  // Validate days
  if (aiResponse.days.length !== 7) {
    throw new Error('Meal plan must have exactly 7 days');
  }
  
  // Validate each day
  aiResponse.days.forEach((day, index) => {
    if (!hasRequiredFields(day, dayRequired)) {
      throw new Error(`Day ${index + 1} missing required fields`);
    }
    
    // Validate meals
    day.meals.forEach((meal, mealIndex) => {
      if (!hasRequiredFields(meal, mealRequired)) {
        throw new Error(`Day ${index + 1}, meal ${mealIndex + 1} missing required fields`);
      }
    });
  });
  
  return true;
};
```

### 2. Nutritional Validation
```typescript
const validateNutrition = (meal, targetCalories) => {
  const issues = [];
  
  if (meal.calories > targetCalories * 0.6) {
    issues.push('Meal calories too high for single meal');
  }
  
  if (meal.protein < 10) {
    issues.push('Insufficient protein content');
  }
  
  const totalMacros = (meal.protein * 4) + (meal.carbs * 4) + (meal.fat * 9);
  if (Math.abs(totalMacros - meal.calories) > 50) {
    issues.push('Macro breakdown does not match total calories');
  }
  
  return { valid: issues.length === 0, issues };
};
```
