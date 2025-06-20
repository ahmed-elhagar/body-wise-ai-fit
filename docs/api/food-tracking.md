
# Food Tracking API

Complete food logging, nutrition analysis, and dietary management system.

## 🍽️ Food Database

### Search Food Items
**Method**: Database Function Call

```javascript
const searchFoodItems = async (searchTerm, category = null, limit = 20) => {
  const { data, error } = await supabase.rpc('search_food_items', {
    search_term: searchTerm,
    category_filter: category,
    limit_count: limit
  });

  return { data, error };
};
```

**Response**:
```json
[
  {
    "id": "food-uuid",
    "name": "Grilled Chicken Breast",
    "brand": "Generic",
    "category": "meat",
    "cuisine_type": "general",
    "calories_per_100g": 165,
    "protein_per_100g": 31,
    "carbs_per_100g": 0,
    "fat_per_100g": 3.6,
    "fiber_per_100g": 0,
    "sugar_per_100g": 0,
    "sodium_per_100g": 74,
    "serving_size_g": 100,
    "serving_description": "1 medium breast",
    "confidence_score": 0.95,
    "verified": true,
    "image_url": "https://example.com/chicken.jpg",
    "similarity_score": 0.89
  }
]
```

### Get Food Item Details
**Method**: `GET`  
**Table**: `food_items`

```javascript
const getFoodItemDetails = async (foodId) => {
  const { data, error } = await supabase
    .from('food_items')
    .select('*')
    .eq('id', foodId)
    .single();

  return { data, error };
};
```

### Add Custom Food Item
**Method**: `POST`  
**Table**: `food_items`

```javascript
const addCustomFoodItem = async (foodData) => {
  const { data, error } = await supabase
    .from('food_items')
    .insert({
      name: foodData.name,
      brand: foodData.brand,
      category: foodData.category,
      calories_per_100g: foodData.calories_per_100g,
      protein_per_100g: foodData.protein_per_100g,
      carbs_per_100g: foodData.carbs_per_100g,
      fat_per_100g: foodData.fat_per_100g,
      fiber_per_100g: foodData.fiber_per_100g || 0,
      sugar_per_100g: foodData.sugar_per_100g || 0,
      sodium_per_100g: foodData.sodium_per_100g || 0,
      serving_size_g: foodData.serving_size_g || 100,
      serving_description: foodData.serving_description,
      source: 'user_created',
      verified: false,
      confidence_score: 0.8,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
};
```

## 📊 Food Consumption Logging

### Log Food Consumption
**Method**: `POST`  
**Table**: `food_consumption_log`

```javascript
const logFoodConsumption = async (userId, consumptionData) => {
  const { data, error } = await supabase
    .from('food_consumption_log')
    .insert({
      user_id: userId,
      food_item_id: consumptionData.food_item_id,
      quantity_g: consumptionData.quantity_g,
      meal_type: consumptionData.meal_type,
      calories_consumed: consumptionData.calories_consumed,
      protein_consumed: consumptionData.protein_consumed,
      carbs_consumed: consumptionData.carbs_consumed,
      fat_consumed: consumptionData.fat_consumed,
      consumed_at: consumptionData.consumed_at || new Date().toISOString(),
      source: consumptionData.source || 'manual',
      notes: consumptionData.notes,
      meal_image_url: consumptionData.meal_image_url,
      ai_analysis_data: consumptionData.ai_analysis_data,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
};
```

**Request Body**:
```json
{
  "food_item_id": "food-uuid",
  "quantity_g": 150,
  "meal_type": "lunch",
  "calories_consumed": 248,
  "protein_consumed": 46.5,
  "carbs_consumed": 0,
  "fat_consumed": 5.4,
  "consumed_at": "2024-01-15T12:30:00Z",
  "source": "manual",
  "notes": "Grilled with herbs",
  "meal_image_url": null,
  "ai_analysis_data": null
}
```

### Get Food Log
**Method**: `GET`  
**Table**: `food_consumption_log`

```javascript
const getFoodLog = async (userId, date = null, mealType = null) => {
  let query = supabase
    .from('food_consumption_log')
    .select(`
      *,
      food_item:food_item_id(
        name,
        brand,
        category,
        calories_per_100g,
        protein_per_100g,
        carbs_per_100g,
        fat_per_100g
      )
    `)
    .eq('user_id', userId)
    .order('consumed_at', { ascending: false });

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    query = query
      .gte('consumed_at', startOfDay.toISOString())
      .lte('consumed_at', endOfDay.toISOString());
  }

  if (mealType) {
    query = query.eq('meal_type', mealType);
  }

  const { data, error } = await query;
  return { data, error };
};
```

### Update Food Log Entry
**Method**: `PATCH`  
**Table**: `food_consumption_log`

```javascript
const updateFoodLogEntry = async (entryId, updates) => {
  const { data, error } = await supabase
    .from('food_consumption_log')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', entryId)
    .select()
    .single();

  return { data, error };
};
```

### Delete Food Log Entry
**Method**: `DELETE`  
**Table**: `food_consumption_log`

```javascript
const deleteFoodLogEntry = async (entryId) => {
  const { error } = await supabase
    .from('food_consumption_log')
    .delete()
    .eq('id', entryId);

  return { error };
};
```

## 📷 AI Food Image Analysis

### Analyze Food Image
**Endpoint**: `POST /functions/v1/analyze-food-image`

**Request**: Multipart form data with image file

```javascript
const analyzeFoodImage = async (imageFile, userId, mealType = 'snack') => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('userId', userId);
  formData.append('mealType', mealType);
  formData.append('language', 'en');

  const { data, error } = await supabase.functions.invoke('analyze-food-image', {
    body: formData
  });

  return { data, error };
};
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
    "suggestions": "Well-balanced meal with good protein.",
    "processingTime": 2340
  },
  "creditsUsed": 2,
  "creditsRemaining": 21
}
```

## 🥗 Nutrition Analytics

### Get Daily Nutrition Summary
```javascript
const getDailyNutritionSummary = async (userId, date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('food_consumption_log')
    .select('calories_consumed, protein_consumed, carbs_consumed, fat_consumed, meal_type')
    .eq('user_id', userId)
    .gte('consumed_at', startOfDay.toISOString())
    .lte('consumed_at', endOfDay.toISOString());

  if (error) return { error };

  const summary = data.reduce((acc, entry) => {
    acc.totalCalories += entry.calories_consumed || 0;
    acc.totalProtein += entry.protein_consumed || 0;
    acc.totalCarbs += entry.carbs_consumed || 0;
    acc.totalFat += entry.fat_consumed || 0;
    
    // By meal type
    if (!acc.byMealType[entry.meal_type]) {
      acc.byMealType[entry.meal_type] = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        items: 0
      };
    }
    
    acc.byMealType[entry.meal_type].calories += entry.calories_consumed || 0;
    acc.byMealType[entry.meal_type].protein += entry.protein_consumed || 0;
    acc.byMealType[entry.meal_type].carbs += entry.carbs_consumed || 0;
    acc.byMealType[entry.meal_type].fat += entry.fat_consumed || 0;
    acc.byMealType[entry.meal_type].items += 1;
    
    return acc;
  }, {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    byMealType: {},
    totalItems: data.length
  });

  return { data: summary, error: null };
};
```

### Get Weekly Nutrition Trends
```javascript
const getWeeklyNutritionTrends = async (userId, weekStartDate) => {
  const weekStart = new Date(weekStartDate);
  const weekEnd = new Date(weekStartDate);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('food_consumption_log')
    .select('calories_consumed, protein_consumed, carbs_consumed, fat_consumed, consumed_at')
    .eq('user_id', userId)
    .gte('consumed_at', weekStart.toISOString())
    .lte('consumed_at', weekEnd.toISOString())
    .order('consumed_at', { ascending: true });

  if (error) return { error };

  // Group by day
  const dailyTotals = {};
  data.forEach(entry => {
    const day = new Date(entry.consumed_at).toDateString();
    if (!dailyTotals[day]) {
      dailyTotals[day] = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        date: day
      };
    }
    
    dailyTotals[day].calories += entry.calories_consumed || 0;
    dailyTotals[day].protein += entry.protein_consumed || 0;
    dailyTotals[day].carbs += entry.carbs_consumed || 0;
    dailyTotals[day].fat += entry.fat_consumed || 0;
  });

  const trends = Object.values(dailyTotals);
  const averages = trends.reduce((acc, day) => {
    acc.avgCalories += day.calories;
    acc.avgProtein += day.protein;
    acc.avgCarbs += day.carbs;
    acc.avgFat += day.fat;
    return acc;
  }, { avgCalories: 0, avgProtein: 0, avgCarbs: 0, avgFat: 0 });

  // Calculate averages
  const daysCount = trends.length || 1;
  averages.avgCalories = Math.round(averages.avgCalories / daysCount);
  averages.avgProtein = Math.round(averages.avgProtein / daysCount);
  averages.avgCarbs = Math.round(averages.avgCarbs / daysCount);
  averages.avgFat = Math.round(averages.avgFat / daysCount);

  return { 
    data: { 
      dailyTrends: trends,
      weeklyAverages: averages,
      totalDays: daysCount
    }, 
    error: null 
  };
};
```

## ⭐ Favorite Foods

### Add Favorite Food
**Method**: `POST`  
**Table**: `user_favorite_foods`

```javascript
const addFavoriteFood = async (userId, foodItemId, customName = null, customServingSize = null, notes = null) => {
  const { data, error } = await supabase
    .from('user_favorite_foods')
    .insert({
      user_id: userId,
      food_item_id: foodItemId,
      custom_name: customName,
      custom_serving_size_g: customServingSize,
      notes: notes,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
};
```

### Get Favorite Foods
**Method**: `GET`  
**Table**: `user_favorite_foods`

```javascript
const getFavoriteFoods = async (userId) => {
  const { data, error } = await supabase
    .from('user_favorite_foods')
    .select(`
      *,
      food_item:food_item_id(
        name,
        brand,
        category,
        calories_per_100g,
        protein_per_100g,
        carbs_per_100g,
        fat_per_100g,
        serving_size_g,
        serving_description
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
};
```

### Remove Favorite Food
**Method**: `DELETE`  
**Table**: `user_favorite_foods`

```javascript
const removeFavoriteFood = async (userId, foodItemId) => {
  const { error } = await supabase
    .from('user_favorite_foods')
    .delete()
    .eq('user_id', userId)
    .eq('food_item_id', foodItemId);

  return { error };
};
```

## 📝 Food Search History

### Log Food Search
**Method**: `POST`  
**Table**: `food_search_history`

```javascript
const logFoodSearch = async (userId, searchTerm, searchType = 'text', resultsCount = 0) => {
  const { data, error } = await supabase
    .from('food_search_history')
    .insert({
      user_id: userId,
      search_term: searchTerm,
      search_type: searchType,
      results_count: resultsCount,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
};
```

### Get Popular Searches
**Method**: `GET`  
**Table**: `food_search_history`

```javascript
const getPopularSearches = async (userId, limit = 10) => {
  const { data, error } = await supabase
    .from('food_search_history')
    .select('search_term, COUNT(*) as frequency')
    .eq('user_id', userId)
    .group('search_term')
    .order('frequency', { ascending: false })
    .limit(limit);

  return { data, error };
};
```

## 🔄 Real-time Features

### Subscribe to Food Log Updates
```javascript
const subscribeFoodLogUpdates = (userId, callback) => {
  return supabase
    .channel('food-log-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'food_consumption_log',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
};
```

## 🚫 Error Handling

### Common Error Codes
```javascript
const FOOD_TRACKING_ERRORS = {
  'FOOD_NOT_FOUND': 'Food item not found in database',
  'INVALID_QUANTITY': 'Quantity must be greater than 0',
  'IMAGE_ANALYSIS_FAILED': 'Failed to analyze food image',
  'INSUFFICIENT_CREDITS': 'Not enough credits for AI analysis',
  'DUPLICATE_FAVORITE': 'Food item already in favorites'
};
```

### Validation Rules
- **Quantity**: Must be between 1g and 5000g
- **Meal types**: breakfast, lunch, dinner, snack
- **Image size**: Maximum 10MB
- **Image formats**: JPEG, PNG, WebP
- **Search terms**: Minimum 2 characters

This comprehensive food tracking API provides complete nutrition logging, AI-powered image analysis, and detailed analytics for dietary management.
