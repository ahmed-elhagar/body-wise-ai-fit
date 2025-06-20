
# Meal Planning API

AI-powered meal plan generation with cultural adaptation and life-phase considerations.

## 🍽️ Core Meal Planning APIs

### Generate Meal Plan
**Endpoint**: `POST /functions/v1/generate-meal-plan`

**Purpose**: Generate a complete 7-day AI-powered meal plan with cultural and life-phase considerations.

**Request Body**:
```json
{
  "userData": {
    "id": "user-uuid",
    "age": 28,
    "weight": 70,
    "height": 175,
    "gender": "female",
    "activity_level": "moderately_active",
    "dietary_restrictions": ["vegetarian", "gluten_free"],
    "allergies": ["nuts"],
    "nationality": "Saudi Arabia",
    "pregnancy_trimester": 2,
    "breastfeeding_level": null,
    "fasting_type": null,
    "fitness_goal": "maintenance"
  },
  "preferences": {
    "cuisine": "middle_eastern",
    "maxPrepTime": "45",
    "includeSnacks": true,
    "language": "ar",
    "weekOffset": 0
  }
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "weeklyPlanId": "plan-uuid",
  "weekStartDate": "2024-01-15",
  "totalMeals": 35,
  "generationsRemaining": 4,
  "includeSnacks": true,
  "mealsPerDay": 5,
  "language": "ar",
  "nutritionContext": {
    "isPregnant": true,
    "pregnancyTrimester": 2,
    "extraCalories": 340,
    "specialRequirements": ["folate", "iron", "calcium"]
  },
  "modelUsed": {
    "provider": "openai",
    "model": "gpt-4o-mini"
  },
  "totalNutrition": {
    "calories": 14000,
    "protein": 875,
    "carbs": 1750,
    "fat": 583
  }
}
```

**React Native Implementation**:
```javascript
const generateMealPlan = async (userData, preferences) => {
  const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
    body: { userData, preferences }
  });
  
  if (error) {
    if (error.message?.includes('rate limit')) {
      throw new RateLimitError(error.message);
    }
    throw error;
  }
  
  return data;
};
```

### Get Weekly Meal Plan
**Method**: `GET`  
**Table**: `weekly_meal_plans`

```javascript
const getMealPlan = async (userId, weekStartDate) => {
  const { data, error } = await supabase
    .from('weekly_meal_plans')
    .select(`
      *,
      daily_meals (
        id,
        day_number,
        meal_type,
        name,
        calories,
        protein,
        carbs,
        fat,
        prep_time,
        cook_time,
        servings,
        ingredients,
        instructions,
        alternatives,
        youtube_search_term,
        image_url
      )
    `)
    .eq('user_id', userId)
    .eq('week_start_date', weekStartDate)
    .single();
    
  return { data, error };
};
```

### Generate Meal Recipe
**Endpoint**: `POST /functions/v1/generate-meal-recipe`

**Request Body**:
```json
{
  "mealId": "meal-uuid",
  "userLanguage": "en"
}
```

**Response**:
```json
{
  "success": true,
  "recipe": {
    "ingredients": [
      "2 large eggs",
      "1 medium tomato, diced",
      "1/2 onion, sliced",
      "2 tbsp olive oil"
    ],
    "instructions": [
      "Heat 2 tbsp olive oil in a skillet over medium heat",
      "Sauté onions until golden brown, about 5 minutes",
      "Add diced tomatoes and cook 5 minutes more",
      "Create wells and crack eggs into them"
    ],
    "prepTime": 15,
    "cookTime": 20,
    "servings": 2,
    "tips": [
      "Don't overcook the eggs",
      "Serve immediately while hot"
    ]
  },
  "generationsRemaining": 3
}
```

### Generate Meal Alternatives
**Endpoint**: `POST /functions/v1/generate-meal-alternatives`

**Request Body**:
```json
{
  "mealId": "meal-uuid",
  "reason": "dietary_preference",
  "preferences": {
    "dietary_restrictions": ["vegan"],
    "cuisine": "mediterranean",
    "maxPrepTime": 30
  },
  "userLanguage": "en"
}
```

**Response**:
```json
{
  "success": true,
  "alternatives": [
    {
      "name": "Mediterranean Quinoa Bowl",
      "calories": 420,
      "protein": 15,
      "carbs": 65,
      "fat": 12,
      "prepTime": 25,
      "cookTime": 15,
      "servings": 2,
      "ingredients": ["quinoa", "chickpeas", "cucumber"],
      "instructions": ["Cook quinoa", "Prepare vegetables"],
      "why_better": "Vegan-friendly, same calorie content"
    }
  ]
}
```

## 🛒 Shopping List APIs

### Generate Shopping List
**Endpoint**: `POST /functions/v1/send-shopping-list-email`

**Request Body**:
```json
{
  "weeklyPlanId": "plan-uuid",
  "userId": "user-uuid",
  "emailAddress": "user@example.com",
  "weekStartDate": "2024-01-15"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Shopping list sent successfully",
  "emailSent": true,
  "shoppingList": {
    "produce": ["2 tomatoes", "1 onion", "2 bell peppers"],
    "dairy": ["12 eggs", "1 lb cheese"],
    "pantry": ["olive oil", "quinoa", "chickpeas"]
  }
}
```

## 🔄 Meal Plan Management

### Shuffle Weekly Meals
**Endpoint**: `POST /functions/v1/shuffle-weekly-meals`

**Request Body**:
```json
{
  "weeklyPlanId": "plan-uuid",
  "userId": "user-uuid"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Meals shuffled successfully",
  "mealsUpdated": 28,
  "preservedMealTypes": ["breakfast", "lunch", "dinner", "snack"]
}
```

### Exchange Single Meal
**Method**: `PATCH`  
**Table**: `daily_meals`

```javascript
const exchangeMeal = async (mealId, newMealData) => {
  const { data, error } = await supabase
    .from('daily_meals')
    .update({
      name: newMealData.name,
      calories: newMealData.calories,
      protein: newMealData.protein,
      carbs: newMealData.carbs,
      fat: newMealData.fat,
      ingredients: newMealData.ingredients,
      instructions: newMealData.instructions,
      updated_at: new Date().toISOString()
    })
    .eq('id', mealId)
    .select()
    .single();
    
  return { data, error };
};
```

## 🌍 Cultural & Life-Phase Adaptations

### Pregnancy Meal Plans
- **Trimester 1**: Base calories
- **Trimester 2**: +340 calories
- **Trimester 3**: +450 calories
- **Focus**: Folate, iron, calcium, DHA
- **Avoid**: High-mercury fish, raw foods, alcohol

### Breastfeeding Meal Plans
- **Exclusive**: +400 calories
- **Partial**: +250 calories
- **Focus**: Protein, healthy fats, hydration
- **Include**: Galactagogue foods (oats, flax)

### Ramadan Meal Plans
- **Suhoor**: Slow-release carbs, protein
- **Iftar**: Hydrating foods, balanced nutrition
- **Timing**: Based on local prayer times
- **Cultural**: Traditional breaking-fast foods

### Cultural Cuisines
- **Middle Eastern**: Rice, lamb, vegetables, spices
- **Mediterranean**: Olive oil, fish, grains, herbs
- **Asian**: Rice, vegetables, soy products, seafood
- **Indian**: Lentils, spices, vegetables, grains

## 📊 Nutrition Tracking

### Get Daily Nutrition Summary
**Method**: `GET`  
**Table**: `daily_meals`

```javascript
const getDailyNutrition = async (weeklyPlanId, dayNumber) => {
  const { data, error } = await supabase
    .from('daily_meals')
    .select('calories, protein, carbs, fat')
    .eq('weekly_plan_id', weeklyPlanId)
    .eq('day_number', dayNumber);
    
  if (data) {
    const totals = data.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    return { data: totals, error: null };
  }
  
  return { data: null, error };
};
```

## 🔄 Real-time Updates

### Subscribe to Meal Plan Changes
```javascript
const subscribeMealPlanUpdates = (userId, callback) => {
  return supabase
    .channel('meal-plan-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'daily_meals',
        filter: `weekly_plan_id=in.(select id from weekly_meal_plans where user_id=${userId})`
      },
      callback
    )
    .subscribe();
};
```

## 🚫 Error Handling

### Rate Limiting
- **Free users**: 5 meal plan generations per day
- **Premium users**: Unlimited generations
- **Reset**: Daily at midnight UTC

### Common Errors
```javascript
const MEAL_PLAN_ERRORS = {
  'INSUFFICIENT_CREDITS': 'You need more credits to generate meal plans',
  'INVALID_DIETARY_RESTRICTIONS': 'Invalid dietary restriction combination',
  'AI_GENERATION_FAILED': 'Failed to generate meal plan. Please try again',
  'MEAL_PLAN_NOT_FOUND': 'Meal plan not found'
};
```

This comprehensive meal planning API supports cultural adaptation, life-phase nutrition, and intelligent meal management with real-time updates.
