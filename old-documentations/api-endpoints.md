
# FitFatta API Endpoints Documentation

This document provides comprehensive API documentation for all backend endpoints. Use this to implement API calls in your React Native/Expo app.

## 🔐 Authentication

All API calls require authentication via Supabase Auth. Include the JWT token in headers:

```javascript
const headers = {
  'Authorization': `Bearer ${session.access_token}`,
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY
}
```

## 🍽️ Meal Planning APIs

### 1. Generate Meal Plan
**Endpoint:** `POST /functions/v1/generate-meal-plan`

**Purpose:** Generate a 7-day AI-powered meal plan based on user profile and preferences.

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

**Response:**
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
  "message": "Meal plan generated successfully"
}
```

**React Native Implementation:**
```javascript
const generateMealPlan = async (userData, preferences) => {
  const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
    body: { userData, preferences }
  });
  
  if (error) throw error;
  return data;
};
```

### 2. Get Weekly Meal Plan
**Endpoint:** `GET /rest/v1/weekly_meal_plans?user_id=eq.{userId}&week_start_date=eq.{date}`

**Purpose:** Retrieve existing meal plan for a specific week.

**Query Parameters:**
- `user_id`: User UUID
- `week_start_date`: Date in YYYY-MM-DD format (Saturday)

**Response:**
```json
{
  "id": "plan-uuid",
  "user_id": "user-uuid",
  "week_start_date": "2024-01-15",
  "total_calories": 14000,
  "total_protein": 875,
  "total_carbs": 1750,
  "total_fat": 583,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### 3. Get Daily Meals
**Endpoint:** `GET /rest/v1/daily_meals?weekly_plan_id=eq.{planId}&order=day_number,meal_type`

**Purpose:** Get all meals for a specific meal plan.

**Response:**
```json
[
  {
    "id": "meal-uuid",
    "weekly_plan_id": "plan-uuid",
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
    "image_url": "https://...",
    "youtube_search_term": "shakshuka recipe"
  }
]
```

### 4. Generate Meal Recipe
**Endpoint:** `POST /functions/v1/generate-meal-recipe`

**Purpose:** Generate detailed recipe for a specific meal.

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
      "1/2 onion, sliced"
    ],
    "instructions": [
      "Heat 2 tbsp olive oil in a skillet",
      "Sauté onions until golden",
      "Add tomatoes and cook 5 minutes",
      "Crack eggs into mixture"
    ],
    "prepTime": 15,
    "cookTime": 20,
    "servings": 2,
    "tips": "Serve immediately while hot"
  }
}
```

### 5. Generate Meal Alternatives
**Endpoint:** `POST /functions/v1/generate-meal-alternatives`

**Purpose:** Generate alternative meals when user dislikes current suggestion.

**Request Body:**
```json
{
  "mealId": "meal-uuid",
  "reason": "dietary_preference",
  "preferences": {
    "dietary_restrictions": ["vegan"],
    "cuisine": "mediterranean"
  }
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
      "ingredients": ["quinoa", "chickpeas", "cucumber"],
      "instructions": ["Cook quinoa", "Mix vegetables"]
    }
  ]
}
```

## 💪 Exercise Program APIs

### 1. Generate Exercise Program
**Endpoint:** `POST /functions/v1/generate-exercise-program`

**Purpose:** Generate a personalized 4-week exercise program.

**Request Body:**
```json
{
  "userData": {
    "userId": "user-uuid",
    "age": 25,
    "fitnessLevel": "beginner",
    "fitnessGoal": "weight_loss",
    "availableTime": "45",
    "injuries": ["lower_back"],
    "equipment": ["dumbbells", "resistance_bands"]
  },
  "preferences": {
    "workoutType": "home",
    "goalType": "weight_loss",
    "duration": "4_weeks",
    "workoutDays": "4",
    "difficulty": "beginner",
    "language": "en",
    "weekOffset": 0
  }
}
```

**Response:**
```json
{
  "success": true,
  "programId": "program-uuid",
  "programName": "4-Week Home Weight Loss Program",
  "workoutType": "home",
  "weekStartDate": "2024-01-15",
  "workoutsCreated": 16,
  "exercisesCreated": 64,
  "generationsRemaining": 3,
  "message": "Exercise program generated successfully"
}
```

### 2. Get Current Exercise Program
**Endpoint:** Database Function Call

```javascript
const { data } = await supabase.rpc('get_current_exercise_program', {
  user_id_param: userId
});
```

**Response:**
```json
{
  "id": "program-uuid",
  "program_name": "Home Strength Building",
  "difficulty_level": "intermediate",
  "workout_type": "home",
  "current_week": 2,
  "week_start_date": "2024-01-15",
  "daily_workouts_count": 12
}
```

### 3. Get Daily Workouts
**Endpoint:** `GET /rest/v1/daily_workouts?weekly_program_id=eq.{programId}&select=*,exercises(*)`

**Purpose:** Get workouts with exercises for a specific program.

**Response:**
```json
[
  {
    "id": "workout-uuid",
    "weekly_program_id": "program-uuid",
    "day_number": 1,
    "workout_name": "Upper Body Strength",
    "estimated_duration": 45,
    "estimated_calories": 220,
    "muscle_groups": ["chest", "shoulders", "triceps"],
    "completed": false,
    "exercises": [
      {
        "id": "exercise-uuid",
        "name": "Push-ups",
        "sets": 3,
        "reps": "8-12",
        "rest_seconds": 60,
        "muscle_groups": ["chest", "triceps"],
        "instructions": "Keep body straight, lower chest to floor",
        "equipment": "bodyweight",
        "difficulty": "beginner",
        "order_number": 1,
        "completed": false
      }
    ]
  }
]
```

### 4. Track Exercise Performance
**Endpoint:** `POST /functions/v1/track-exercise-performance`

**Purpose:** Log exercise completion and performance metrics.

**Request Body:**
```json
{
  "exerciseId": "exercise-uuid",
  "userId": "user-uuid",
  "action": "completed",
  "progressData": {
    "sets_completed": 3,
    "reps_completed": "12",
    "weight_used": 15,
    "notes": "Felt strong today"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Performance tracked successfully",
  "performanceMetrics": {
    "exercise_name": "Push-ups",
    "target_sets": 3,
    "actual_sets": 3,
    "completion_rate": 100,
    "exceeded_target": false
  }
}
```

### 5. Exchange Exercise
**Endpoint:** `POST /functions/v1/exchange-exercise`

**Purpose:** Replace an exercise with an alternative due to equipment/preference.

**Request Body:**
```json
{
  "exerciseId": "exercise-uuid",
  "reason": "equipment_not_available",
  "preferences": {
    "equipment": ["bodyweight"]
  },
  "userLanguage": "en",
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Exercise exchanged successfully",
  "newExercise": {
    "name": "Diamond Push-ups",
    "sets": 3,
    "reps": "6-10",
    "instructions": "Form diamond shape with hands",
    "equipment": "bodyweight"
  },
  "originalExercise": "Dumbbell Chest Press",
  "reason": "equipment_not_available"
}
```

## 🤖 AI Assistant APIs

### 1. Analyze Food Image
**Endpoint:** `POST /functions/v1/analyze-food-image`

**Purpose:** Analyze food photo to identify items and estimate nutrition.

**Request:** Multipart form data with image file

**Response:**
```json
{
  "success": true,
  "analysis": {
    "foodItems": [
      {
        "name": "Grilled Chicken Breast",
        "category": "protein",
        "calories": 165,
        "protein": 31,
        "carbs": 0,
        "fat": 3.6,
        "quantity": "100g",
        "confidence": 0.92
      },
      {
        "name": "Brown Rice",
        "category": "carbohydrate",
        "calories": 112,
        "protein": 2.6,
        "carbs": 25,
        "fat": 0.9,
        "quantity": "100g",
        "confidence": 0.88
      }
    ],
    "overallConfidence": 0.90,
    "cuisineType": "mediterranean",
    "mealType": "lunch",
    "suggestions": "Well-balanced meal. Consider adding vegetables for extra fiber and vitamins.",
    "totalNutrition": {
      "calories": 277,
      "protein": 33.6,
      "carbs": 25,
      "fat": 4.5
    }
  },
  "processingTime": 2800
}
```

### 2. Generate Meal Image
**Endpoint:** `POST /functions/v1/generate-meal-image`

**Purpose:** Generate AI image for a meal using DALL-E.

**Request Body:**
```json
{
  "mealId": "meal-uuid",
  "mealName": "Shakshuka with Pita",
  "description": "Traditional Middle Eastern breakfast dish"
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/...",
  "message": "Image generated successfully"
}
```

## 📊 Data Tracking APIs

### 1. Save Weight Entry
**Endpoint:** `POST /rest/v1/weight_entries`

**Purpose:** Log user's weight and body composition.

**Request Body:**
```json
{
  "user_id": "user-uuid",
  "weight": 72.5,
  "body_fat_percentage": 18.2,
  "muscle_mass": 32.1,
  "notes": "Morning weight after workout",
  "recorded_at": "2024-01-15T07:30:00Z"
}
```

**Response:**
```json
{
  "id": "entry-uuid",
  "user_id": "user-uuid",
  "weight": 72.5,
  "body_fat_percentage": 18.2,
  "muscle_mass": 32.1,
  "notes": "Morning weight after workout",
  "recorded_at": "2024-01-15T07:30:00Z"
}
```

### 2. Get Weight History
**Endpoint:** `GET /rest/v1/weight_entries?user_id=eq.{userId}&order=recorded_at.desc&limit=30`

**Purpose:** Retrieve weight tracking history.

**Response:**
```json
[
  {
    "id": "entry-uuid",
    "weight": 72.5,
    "body_fat_percentage": 18.2,
    "muscle_mass": 32.1,
    "recorded_at": "2024-01-15T07:30:00Z",
    "notes": "Morning weight"
  }
]
```

### 3. Log Food Consumption
**Endpoint:** `POST /rest/v1/food_consumption_log`

**Purpose:** Track food intake with nutrition data.

**Request Body:**
```json
{
  "user_id": "user-uuid",
  "food_item_id": "food-uuid",
  "quantity_g": 150,
  "calories_consumed": 248,
  "protein_consumed": 46.5,
  "carbs_consumed": 0,
  "fat_consumed": 5.4,
  "meal_type": "lunch",
  "meal_image_url": "https://...",
  "source": "ai_analysis",
  "notes": "Grilled chicken breast"
}
```

## 🛠️ Utility APIs

### 1. Search Food Database
**Endpoint:** Database Function Call

```javascript
const { data } = await supabase.rpc('search_food_items', {
  search_term: 'chicken breast',
  category_filter: 'protein',
  limit_count: 10
});
```

**Response:**
```json
[
  {
    "id": "food-uuid",
    "name": "Chicken Breast, Grilled",
    "brand": "Generic",
    "category": "protein",
    "calories_per_100g": 165,
    "protein_per_100g": 31,
    "carbs_per_100g": 0,
    "fat_per_100g": 3.6,
    "verified": true,
    "similarity_score": 0.95
  }
]
```

### 2. Shuffle Weekly Meals
**Endpoint:** `POST /functions/v1/shuffle-weekly-meals`

**Purpose:** Redistribute meals across the week while maintaining balance.

**Request Body:**
```json
{
  "weeklyPlanId": "plan-uuid",
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Meals shuffled successfully",
  "mealsUpdated": 28,
  "preservedMealTypes": ["breakfast", "lunch", "dinner", "snack"]
}
```

## 📱 React Native Integration Examples

### 1. API Client Setup
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'your-supabase-url',
  'your-supabase-anon-key'
);

class ApiClient {
  async callFunction(functionName, body) {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body
    });
    
    if (error) throw error;
    return data;
  }
  
  async queryTable(table, query) {
    let queryBuilder = supabase.from(table);
    
    if (query.select) queryBuilder = queryBuilder.select(query.select);
    if (query.filter) queryBuilder = queryBuilder.eq(query.filter.field, query.filter.value);
    if (query.order) queryBuilder = queryBuilder.order(query.order.field, { ascending: query.order.asc });
    if (query.limit) queryBuilder = queryBuilder.limit(query.limit);
    
    const { data, error } = await queryBuilder;
    if (error) throw error;
    return data;
  }
}
```

### 2. Offline-First API Strategy
```javascript
class OfflineApiClient {
  constructor() {
    this.queue = [];
    this.isOnline = true;
  }
  
  async executeWithFallback(apiCall, fallbackData) {
    try {
      if (!this.isOnline) {
        return fallbackData;
      }
      
      const result = await apiCall();
      await this.syncCache(result);
      return result;
    } catch (error) {
      console.log('API call failed, using cached data');
      return await this.getCachedData();
    }
  }
  
  async queueForSync(operation) {
    this.queue.push({
      ...operation,
      timestamp: Date.now()
    });
    
    if (this.isOnline) {
      await this.processQueue();
    }
  }
}
```

### 3. Real-time Subscriptions
```javascript
// Subscribe to meal plan changes
const subscribeMealPlanChanges = (userId, callback) => {
  return supabase
    .channel('meal-plan-changes')
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

// Subscribe to exercise progress
const subscribeExerciseProgress = (userId, callback) => {
  return supabase
    .channel('exercise-progress')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'exercises',
        filter: `daily_workout_id=in.(select id from daily_workouts where weekly_program_id in (select id from weekly_exercise_programs where user_id=${userId}))`
      },
      callback
    )
    .subscribe();
};
```

## 🔒 Security & Rate Limiting

### 1. Authentication Headers
```javascript
const authenticatedHeaders = {
  'Authorization': `Bearer ${session.access_token}`,
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY
};
```

### 2. Rate Limiting Response
All AI-powered endpoints return rate limiting information:
```json
{
  "success": true,
  "generationsRemaining": 4,
  "isPro": false,
  "resetDate": "2024-01-16T00:00:00Z"
}
```

### 3. Error Handling
```javascript
const handleApiError = (error) => {
  if (error.message?.includes('rate limit')) {
    return 'You have reached your daily AI generation limit. Please upgrade to continue.';
  }
  
  if (error.message?.includes('auth')) {
    return 'Please log in again to continue.';
  }
  
  return 'An unexpected error occurred. Please try again.';
};
```

This comprehensive API documentation provides everything needed to implement a fully-featured fitness app with meal planning, exercise tracking, AI assistance, and progress monitoring capabilities.
