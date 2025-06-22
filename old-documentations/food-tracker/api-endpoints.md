
# Food Tracker API Endpoints

Comprehensive API documentation for food tracking, nutrition monitoring, and calorie management in React Native/Expo app.

## 🍽️ Food Consumption Endpoints

### Log Food Consumption
```typescript
// POST via database function
const logFoodConsumption = async (consumptionData: FoodConsumptionData) => {
  const { data, error } = await supabase.rpc('log_food_consumption', {
    user_id_param: consumptionData.userId,
    food_item_id_param: consumptionData.foodItemId,
    quantity_g_param: consumptionData.quantityG,
    meal_type_param: consumptionData.mealType,
    consumed_at_param: consumptionData.consumedAt,
    meal_image_url_param: consumptionData.mealImageUrl,
    source_param: consumptionData.source,
    notes_param: consumptionData.notes
  });
  
  if (error) throw error;
  return data;
};

interface FoodConsumptionData {
  userId: string;
  foodItemId: string;
  quantityG: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  consumedAt?: string;
  mealImageUrl?: string;
  source: 'manual' | 'ai_photo' | 'barcode' | 'voice';
  notes?: string;
}
```

### Get Daily Food Log
```typescript
// GET via Supabase client
const getDailyFoodLog = async (userId: string, date: string) => {
  const { data, error } = await supabase
    .from('food_consumption_log')
    .select(`
      *,
      food_items:food_item_id (
        name,
        brand,
        image_url,
        category,
        serving_description
      )
    `)
    .eq('user_id', userId)
    .gte('consumed_at', `${date}T00:00:00.000Z`)
    .lt('consumed_at', `${date}T23:59:59.999Z`)
    .order('consumed_at', { ascending: false });
    
  if (error) throw error;
  return data;
};
```

### Update Food Consumption Entry
```typescript
// PATCH via Supabase client
const updateFoodConsumption = async (
  entryId: string, 
  updates: Partial<FoodConsumptionData>
) => {
  const { data, error } = await supabase
    .from('food_consumption_log')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', entryId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};
```

### Delete Food Consumption Entry
```typescript
// DELETE via Supabase client
const deleteFoodConsumption = async (entryId: string, userId: string) => {
  const { error } = await supabase
    .from('food_consumption_log')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId);
    
  if (error) throw error;
};
```

## 📊 Nutrition Analytics Endpoints

### Get Daily Nutrition Summary
```typescript
// GET via Supabase client
const getDailyNutritionSummary = async (userId: string, date: string) => {
  const { data, error } = await supabase
    .from('daily_nutrition_summaries')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};
```

### Get Nutrition History
```typescript
// GET via Supabase client
const getNutritionHistory = async (
  userId: string, 
  startDate: string, 
  endDate: string
) => {
  const { data, error } = await supabase
    .from('daily_nutrition_summaries')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data;
};
```

### Get Weekly Nutrition Trends
```typescript
// GET via custom function
const getWeeklyNutritionTrends = async (userId: string, weekStartDate: string) => {
  const { data, error } = await supabase.rpc('get_weekly_nutrition_trends', {
    user_id_param: userId,
    week_start_param: weekStartDate
  });
  
  if (error) throw error;
  return data;
};
```

## 🎯 Nutrition Goals Endpoints

### Get User Nutrition Goals
```typescript
// GET via Supabase client
const getUserNutritionGoals = async (userId: string) => {
  const { data, error } = await supabase
    .from('nutrition_goals')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};
```

### Update Nutrition Goals
```typescript
// POST/PUT via Supabase client
const updateNutritionGoals = async (userId: string, goals: NutritionGoalsData) => {
  // Deactivate existing goals
  await supabase
    .from('nutrition_goals')
    .update({ 
      is_active: false,
      effective_until: new Date().toISOString().split('T')[0]
    })
    .eq('user_id', userId)
    .eq('is_active', true);
  
  // Insert new goals
  const { data, error } = await supabase
    .from('nutrition_goals')
    .insert({
      user_id: userId,
      ...goals,
      effective_from: new Date().toISOString().split('T')[0],
      is_active: true
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

interface NutritionGoalsData {
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dailyCarbTarget: number;
  dailyFatTarget: number;
  dailyFiberTarget?: number;
  dailySodiumLimit?: number;
  dailySugarLimit?: number;
  dailyWaterTargetMl?: number;
  breakfastCaloriePercentage?: number;
  lunchCaloriePercentage?: number;
  dinnerCaloriePercentage?: number;
  snackCaloriePercentage?: number;
}
```

## 📷 Photo Analysis Endpoints

### Analyze Food Photo
```typescript
// POST /functions/v1/analyze-food-photo
interface AnalyzeFoodPhotoRequest {
  userId: string;
  imageUrl: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  language: 'en' | 'ar';
}

interface AnalyzeFoodPhotoResponse {
  success: boolean;
  analysisId: string;
  detectedFoods: DetectedFood[];
  estimatedNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  confidenceScore: number;
  processingTimeMs: number;
}

interface DetectedFood {
  name: string;
  confidence: number;
  estimatedQuantityG: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const analyzeFoodPhoto = async (request: AnalyzeFoodPhotoRequest) => {
  const { data, error } = await supabase.functions.invoke('analyze-food-photo', {
    body: request
  });
  
  if (error) throw error;
  return data;
};
```

### Confirm Photo Analysis
```typescript
// POST via Supabase client
const confirmPhotoAnalysis = async (
  analysisId: string,
  userCorrections?: any,
  autoLog: boolean = true
) => {
  const { data, error } = await supabase
    .from('food_photo_analysis')
    .update({
      user_verified: true,
      user_corrections: userCorrections
    })
    .eq('id', analysisId)
    .select()
    .single();
    
  if (error) throw error;
  
  // Optionally auto-log to consumption log
  if (autoLog && data) {
    return await logPhotoAnalysisToConsumption(analysisId);
  }
  
  return data;
};
```

## 🔍 Food Search & Database Endpoints

### Quick Food Search
```typescript
// GET via database function
const quickFoodSearch = async (searchTerm: string, limit: number = 10) => {
  const { data, error } = await supabase.rpc('search_food_items', {
    search_term: searchTerm,
    limit_count: limit
  });
  
  if (error) throw error;
  return data;
};
```

### Barcode Food Lookup
```typescript
// GET via Supabase client
const barcodeFoodLookup = async (barcode: string) => {
  const { data, error } = await supabase
    .from('food_items')
    .select('*')
    .eq('barcode', barcode)
    .limit(1)
    .single();
    
  if (error && error.code !== 'PGRST116') {
    // If not found locally, try external API
    return await lookupBarcodeExternal(barcode);
  }
  
  return data;
};
```

### Get Recent Foods
```typescript
// GET via Supabase client
const getRecentFoods = async (userId: string, limit: number = 20) => {
  const { data, error } = await supabase
    .from('food_consumption_log')
    .select(`
      food_items:food_item_id (
        id,
        name,
        brand,
        category,
        calories_per_100g,
        protein_per_100g,
        carbs_per_100g,
        fat_per_100g,
        serving_size_g,
        serving_description,
        image_url
      )
    `)
    .eq('user_id', userId)
    .order('consumed_at', { ascending: false })
    .limit(limit);
    
  if (error) throw error;
  
  // Remove duplicates and return unique foods
  const uniqueFoods = data
    .map(entry => entry.food_items)
    .filter((food, index, self) => 
      self.findIndex(f => f.id === food.id) === index
    );
    
  return uniqueFoods;
};
```

### Get Favorite Foods
```typescript
// GET via Supabase client
const getFavoriteFoods = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_favorite_foods')
    .select(`
      *,
      food_items:food_item_id (
        id,
        name,
        brand,
        category,
        calories_per_100g,
        protein_per_100g,
        carbs_per_100g,
        fat_per_100g,
        serving_size_g,
        serving_description,
        image_url
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};
```

## 💧 Water Intake Endpoints

### Log Water Intake
```typescript
// POST via Supabase client
const logWaterIntake = async (userId: string, amountMl: number, date?: string) => {
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('daily_nutrition_summaries')
    .upsert({
      user_id: userId,
      date: targetDate,
      water_intake_ml: amountMl
    }, { 
      onConflict: 'user_id,date',
      ignoreDuplicates: false 
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
};
```

### Update Water Goal
```typescript
// PATCH via Supabase client
const updateWaterGoal = async (userId: string, goalMl: number) => {
  const { data, error } = await supabase
    .from('nutrition_goals')
    .update({ 
      daily_water_target_ml: goalMl,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('is_active', true)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};
```

## 📈 Real-time Subscriptions

### Daily Nutrition Updates
```typescript
// Subscribe to daily nutrition changes
const subscribeToDailyNutrition = (userId: string, date: string, callback: (data: any) => void) => {
  return supabase
    .channel(`daily-nutrition-${userId}-${date}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'daily_nutrition_summaries',
        filter: `user_id=eq.${userId} AND date=eq.${date}`
      },
      callback
    )
    .subscribe();
};
```

### Food Consumption Updates
```typescript
// Subscribe to food consumption changes
const subscribeToFoodConsumption = (userId: string, callback: (data: any) => void) => {
  return supabase
    .channel(`food-consumption-${userId}`)
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

### Common Error Responses
```typescript
interface FoodTrackerAPIError {
  error: string;
  code: string;
  details?: any;
  statusCode: number;
}

// Common error codes
const ERROR_CODES = {
  FOOD_ITEM_NOT_FOUND: 'FOOD_ITEM_NOT_FOUND',
  INVALID_NUTRITION_DATA: 'INVALID_NUTRITION_DATA',
  PHOTO_ANALYSIS_FAILED: 'PHOTO_ANALYSIS_FAILED',
  BARCODE_NOT_FOUND: 'BARCODE_NOT_FOUND',
  DAILY_LIMIT_EXCEEDED: 'DAILY_LIMIT_EXCEEDED',
  GOAL_CALCULATION_ERROR: 'GOAL_CALCULATION_ERROR'
};
```

### React Native Error Handling
```typescript
const handleFoodTrackerError = (error: FoodTrackerAPIError) => {
  switch (error.code) {
    case ERROR_CODES.FOOD_ITEM_NOT_FOUND:
      return 'Food item not found. Please try a different search.';
    case ERROR_CODES.PHOTO_ANALYSIS_FAILED:
      return 'Could not analyze photo. Please try again with a clearer image.';
    case ERROR_CODES.BARCODE_NOT_FOUND:
      return 'Barcode not recognized. You can add this food manually.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};
```

This comprehensive API documentation provides all endpoints needed for complete food tracking functionality in React Native with real-time updates and proper error handling.
