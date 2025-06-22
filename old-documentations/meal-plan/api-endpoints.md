
# Meal Plan API Endpoints

Complete API reference for meal plan functionality, designed for React Native/Expo implementation.

## 🎯 Core Meal Plan APIs

### 1. Generate Meal Plan
**Endpoint:** `POST /functions/v1/generate-meal-plan`

**Purpose:** Generate a complete 7-day AI-powered meal plan with cultural and life-phase considerations.

**Authentication:** Required (JWT token in Authorization header)

**Request Body:**
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
    "fitness_goal": "maintenance",
    "preferred_foods": ["rice", "chicken", "vegetables"],
    "health_conditions": ["diabetes"]
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

**Response Success (200):**
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

**Response Error (429 - Rate Limited):**
```json
{
  "success": false,
  "error": "AI generation limit reached",
  "generationsRemaining": 0,
  "upgradeRequired": true,
  "resetDate": "2024-01-16T00:00:00Z"
}
```

**React Native Implementation:**
```typescript
const generateMealPlan = async (userData: UserProfile, preferences: MealPlanPreferences) => {
  const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
    body: { userData, preferences }
  });
  
  if (error) {
    if (error.message?.includes('rate limit')) {
      // Handle rate limiting in UI
      throw new RateLimitError(error.message);
    }
    throw error;
  }
  
  return data;
};
```

### 2. Get Weekly Meal Plan
**Endpoint:** `GET /rest/v1/weekly_meal_plans`

**Query Parameters:**
```
user_id=eq.{userId}
week_start_date=eq.{date}
select=*,daily_meals(*)
```

**Purpose:** Retrieve existing meal plan with all daily meals for a specific week.

**Response:**
```json
[
  {
    "id": "plan-uuid",
    "user_id": "user-uuid",
    "week_start_date": "2024-01-15",
    "total_calories": 14000,
    "total_protein": 875,
    "total_carbs": 1750,
    "total_fat": 583,
    "generation_prompt": {
      "cuisine": "middle_eastern",
      "includeSnacks": true,
      "language": "ar"
    },
    "life_phase_context": {
      "isPregnant": true,
      "pregnancyTrimester": 2,
      "extraCalories": 340
    },
    "created_at": "2024-01-15T10:30:00Z",
    "daily_meals": [
      {
        "id": "meal-uuid",
        "day_number": 1,
        "meal_type": "breakfast",
        "name": "Shakshuka with Pita",
        "calories": 420,
        "protein": 18,
        "carbs": 32,
        "fat": 24,
        "prep_time": 15,
        "cook_time": 20,
        "servings": 2,
        "ingredients": ["eggs", "tomatoes", "onions", "pita bread"],
        "instructions": ["Heat oil", "Sauté onions", "Add tomatoes", "Crack eggs"],
        "alternatives": ["Turkish Menemen", "Fatteh with Eggs"],
        "youtube_search_term": "shakshuka recipe",
        "image_url": "https://...",
        "recipe_fetched": false
      }
    ]
  }
]
```

**React Native Query:**
```typescript
const getMealPlan = async (userId: string, weekStartDate: string) => {
  const { data, error } = await supabase
    .from('weekly_meal_plans')
    .select(`
      *,
      daily_meals (
        *
      )
    `)
    .eq('user_id', userId)
    .eq('week_start_date', weekStartDate)
    .single();
    
  return { data, error };
};
```

### 3. Generate Meal Recipe
**Endpoint:** `POST /functions/v1/generate-meal-recipe`

**Purpose:** Generate detailed cooking instructions for a specific meal.

**Request Body:**
```json
{
  "mealId": "meal-uuid",
  "userLanguage": "en"
}
```

**Response:**
```json
{
  "success": true,
  "recipe": {
    "ingredients": [
      "2 large eggs",
      "1 medium tomato, diced",
      "1/2 onion, sliced",
      "2 tbsp olive oil",
      "1 tsp cumin",
      "Salt and pepper to taste",
      "2 pita breads"
    ],
    "instructions": [
      "Heat 2 tbsp olive oil in a skillet over medium heat",
      "Sauté onions until golden brown, about 5 minutes",
      "Add diced tomatoes and cumin, cook 5 minutes",
      "Create wells in the mixture and crack eggs into them",
      "Cover and cook 8-10 minutes until eggs are set",
      "Serve immediately with warm pita bread"
    ],
    "prepTime": 15,
    "cookTime": 20,
    "servings": 2,
    "tips": [
      "Don't overcook the eggs - yolks should be slightly runny",
      "Serve immediately while hot",
      "Can be topped with fresh herbs like parsley"
    ],
    "nutritionNotes": "High in protein and healthy fats, good source of lycopene"
  },
  "generationsRemaining": 3
}
```

### 4. Generate Meal Alternatives
**Endpoint:** `POST /functions/v1/generate-meal-alternatives`

**Purpose:** Generate alternative meals when user wants to replace current suggestion.

**Request Body:**
```json
{
  "mealId": "meal-uuid",
  "reason": "dietary_preference", // or "ingredient_unavailable", "dislike", "time_constraint"
  "preferences": {
    "dietary_restrictions": ["vegan"],
    "cuisine": "mediterranean",
    "maxPrepTime": 30,
    "availableIngredients": ["quinoa", "vegetables", "olive oil"]
  },
  "userLanguage": "en"
}
```

**Response:**
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
      "ingredients": ["quinoa", "chickpeas", "cucumber", "tomatoes", "olives"],
      "instructions": ["Cook quinoa", "Prepare vegetables", "Mix with dressing"],
      "why_better": "Vegan-friendly, same calorie content, Mediterranean flavors"
    },
    {
      "name": "Stuffed Bell Peppers",
      "calories": 380,
      "protein": 12,
      "carbs": 55,
      "fat": 14,
      "prepTime": 20,
      "cookTime": 30,
      "servings": 2,
      "ingredients": ["bell peppers", "rice", "vegetables", "herbs"],
      "instructions": ["Prepare filling", "Stuff peppers", "Bake until tender"],
      "why_better": "Creative presentation, same prep time, family-friendly"
    }
  ],
  "originalMeal": {
    "name": "Shakshuka with Pita",
    "reasonForReplacement": "dietary_preference"
  }
}
```

## 📊 Meal Plan Data Queries

### 5. Get Meals by Day
**Purpose:** Get all meals for a specific day within a meal plan.

```typescript
const getMealsByDay = async (weeklyPlanId: string, dayNumber: number) => {
  const { data, error } = await supabase
    .from('daily_meals')
    .select('*')
    .eq('weekly_plan_id', weeklyPlanId)
    .eq('day_number', dayNumber)
    .order('meal_type', { ascending: true });
    
  return { data, error };
};
```

### 6. Update Meal Completion
**Purpose:** Mark a meal as consumed or completed.

```typescript
const updateMealCompletion = async (mealId: string, completed: boolean) => {
  // This would require adding a 'completed' column to daily_meals table
  const { data, error } = await supabase
    .from('daily_meals')
    .update({ completed, completed_at: completed ? new Date().toISOString() : null })
    .eq('id', mealId);
    
  return { data, error };
};
```

### 7. Get Weekly Nutrition Summary
**Purpose:** Calculate total nutrition for the week.

```typescript
const getWeeklyNutritionSummary = async (weeklyPlanId: string) => {
  const { data, error } = await supabase
    .from('daily_meals')
    .select('calories, protein, carbs, fat')
    .eq('weekly_plan_id', weeklyPlanId);
    
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

## 🔄 Meal Plan Management APIs

### 8. Shuffle Weekly Meals
**Endpoint:** `POST /functions/v1/shuffle-weekly-meals`

**Purpose:** Redistribute meals across the week while maintaining nutritional balance.

**Request Body:**
```json
{
  "weeklyPlanId": "plan-uuid",
  "userId": "user-uuid",
  "preserveMealTypes": true, // Keep breakfast as breakfast, etc.
  "constraints": {
    "keepFavoriteMeals": ["meal-uuid-1", "meal-uuid-2"],
    "avoidMealTypes": {
      "sunday": ["heavy_dinner"] // Cultural/religious preferences
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Meals shuffled successfully",
  "mealsUpdated": 28,
  "preservedMealTypes": ["breakfast", "lunch", "dinner", "snack"],
  "changes": [
    {
      "mealId": "meal-uuid",
      "oldDay": 1,
      "newDay": 3,
      "mealType": "lunch"
    }
  ]
}
```

### 9. Duplicate Meal Plan
**Endpoint:** `POST /functions/v1/duplicate-meal-plan`

**Purpose:** Copy an existing meal plan to a new week.

**Request Body:**
```json
{
  "sourcePlanId": "source-plan-uuid",
  "targetWeekStartDate": "2024-01-22",
  "userId": "user-uuid",
  "modifications": {
    "adjustPortions": 1.1, // 10% increase
    "replaceMeals": {
      "meal-uuid-1": "alternative-meal-name"
    }
  }
}
```

## 📱 React Native Implementation Patterns

### Offline-First Data Fetching
```typescript
class MealPlanService {
  async getMealPlanWithFallback(userId: string, weekStartDate: string) {
    try {
      // Try to fetch from server
      const { data } = await this.getMealPlan(userId, weekStartDate);
      
      // Cache for offline use
      await AsyncStorage.setItem(
        `meal_plan_${weekStartDate}`,
        JSON.stringify(data)
      );
      
      return data;
    } catch (error) {
      // Fallback to cached data
      const cached = await AsyncStorage.getItem(`meal_plan_${weekStartDate}`);
      return cached ? JSON.parse(cached) : null;
    }
  }

  async syncMealPlanChanges() {
    // Sync any offline changes when connection restored
    const pendingChanges = await AsyncStorage.getItem('pending_meal_changes');
    if (pendingChanges) {
      const changes = JSON.parse(pendingChanges);
      for (const change of changes) {
        await this.applyChange(change);
      }
      await AsyncStorage.removeItem('pending_meal_changes');
    }
  }
}
```

### Real-time Meal Plan Updates
```typescript
// Subscribe to meal plan changes
const subscribeMealPlanUpdates = (userId: string, callback: Function) => {
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

This comprehensive API documentation provides everything needed to implement meal plan functionality in React Native with proper offline support, real-time updates, and cultural considerations.
