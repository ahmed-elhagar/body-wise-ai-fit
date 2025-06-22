# Edge Functions Documentation 🔥

## 🎯 **Overview**

FitFatta's Edge Functions provide AI-powered backend services for meal planning, workout generation, and intelligent coaching. All functions are deployed on Supabase Edge Runtime.

---

## 🍽️ **Meal Planning Functions**

### **generate-meal-plan**

AI-powered meal plan generation with cultural cuisine integration.

**Endpoint**: `POST /functions/v1/generate-meal-plan`

**Parameters**:
```typescript
interface GenerateMealPlanRequest {
  userId: string;
  preferences: {
    cuisine: 'middle_eastern' | 'mediterranean' | 'indian' | 'asian' | 'italian' | 'mexican' | 'international';
    cookingSkill: 'beginner' | 'intermediate' | 'advanced';
    maxPrepTime: number; // 15-120 minutes
    equipmentLevel: 'basic' | 'moderate' | 'full';
    healthGoals: string[]; // ['weight_loss', 'muscle_gain', 'heart_health']
    dietaryRestrictions: string[]; // ['vegetarian', 'gluten_free', 'dairy_free']
    weekOffset: number; // 0 = current week, 1 = next week
    includeSnacks: boolean;
    culturalAdaptation: boolean;
  };
}
```

**Response**:
```typescript
interface GenerateMealPlanResponse {
  success: boolean;
  mealPlan: {
    weekStartDate: string;
    dailyMeals: {
      [day: string]: {
        breakfast: Meal;
        lunch: Meal;
        dinner: Meal;
        snacks?: Meal[];
      };
    };
    nutritionSummary: {
      totalCalories: number;
      totalProtein: number;
      totalCarbs: number;
      totalFat: number;
      dailyAverages: NutritionAverages;
    };
    shoppingList: ShoppingListItem[];
    culturalNotes: string[];
  };
  generationTime: number; // milliseconds
}
```

**Example Usage**:
```typescript
const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
  body: {
    userId: 'user-uuid',
    preferences: {
      cuisine: 'middle_eastern',
      cookingSkill: 'intermediate',
      maxPrepTime: 45,
      equipmentLevel: 'moderate',
      healthGoals: ['weight_loss'],
      dietaryRestrictions: [],
      weekOffset: 0,
      includeSnacks: true,
      culturalAdaptation: true
    }
  }
});
```

### **send-shopping-list-email**

Sends formatted shopping list via email with cost estimates.

**Endpoint**: `POST /functions/v1/send-shopping-list-email`

**Parameters**:
```typescript
interface SendShoppingListRequest {
  userId: string;
  email: string;
  shoppingList: ShoppingListItem[];
  weekStartDate: string;
  estimatedCost: number;
  format: 'html' | 'pdf';
}
```

---

## 💪 **Exercise Functions**

### **generate-exercise-program**

AI-powered 4-week exercise program generation with equipment awareness.

**Endpoint**: `POST /functions/v1/generate-exercise-program`

**Parameters**:
```typescript
interface GenerateExerciseProgramRequest {
  userId: string;
  goalType: string; // 'weight_loss', 'muscle_gain', 'strength', 'endurance'
  workoutType: 'home' | 'gym';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[]; // ['dumbbells', 'resistance_bands', 'pull_up_bar']
  duration: string; // '15-30 minutes', '30-45 minutes', '45-60 minutes'
  weekStartDate: string; // ISO date string
  weekOffset?: number; // 0 = current week, 1 = next week
}
```

**Response**:
```typescript
interface GenerateExerciseProgramResponse {
  success: boolean;
  program: {
    id: string;
    programName: string;
    weekStartDate: string;
    workoutType: 'home' | 'gym';
    difficultyLevel: string;
    totalEstimatedCalories: number;
    weeks: Week[];
    generationPrompt: any;
  };
  workoutsCreated: number;
  exercisesCreated: number;
  generationTime: number;
}
```

### **track-exercise-performance**

Exercise performance tracking with progress analytics.

**Endpoint**: `POST /functions/v1/track-exercise-performance`

**Parameters**:
```typescript
interface TrackExercisePerformanceRequest {
  exerciseId: string;
  userId: string;
  action: 'progress_updated' | 'completed';
  progressData: {
    sets_completed: number;
    reps_completed: number[];
    weight_used: number[];
    duration_seconds: number;
    notes?: string;
  };
}
```

**Response**:
```typescript
interface TrackExercisePerformanceResponse {
  success: boolean;
  message: string;
  progressSummary: {
    totalVolume: number;
    improvementPercentage: number;
    personalRecords: string[];
  };
  responseTime: number;
}
```

### **exchange-exercise**

Exercise substitution with muscle group and equipment matching.

**Endpoint**: `POST /functions/v1/exchange-exercise`

**Parameters**:
```typescript
interface ExchangeExerciseRequest {
  userId: string;
  currentExerciseId: string;
  reason: 'equipment' | 'injury' | 'preference' | 'difficulty';
  requirements: {
    muscleGroups: string[];
    equipment: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    workoutType: 'home' | 'gym';
  };
}
```

**Response**:
```typescript
interface ExchangeExerciseResponse {
  success: boolean;
  alternatives: Exercise[];
  recommendedChoice: Exercise;
  reasoning: string;
  responseTime: number;
}
```

### **get-exercise-recommendations**

Personalized exercise recommendations based on user profile and goals.

**Endpoint**: `POST /functions/v1/get-exercise-recommendations`

**Parameters**:
```typescript
interface GetExerciseRecommendationsRequest {
  userId: string;
  context: {
    currentProgram?: string;
    recentWorkouts: WorkoutSession[];
    goals: string[];
    preferences: UserPreferences;
    equipment: string[];
    workoutType: 'home' | 'gym';
  };
  recommendationType: 'next_workout' | 'progression' | 'recovery';
}
```

**Response**:
```typescript
interface GetExerciseRecommendationsResponse {
  success: boolean;
  recommendations: {
    exercises: Exercise[];
    workoutPlan: WorkoutPlan;
    progressionSuggestions: string[];
    recoveryAdvice: string[];
  };
  reasoning: string;
  responseTime: number;
}
```

### **fitness-chat**

AI fitness coaching chat with exercise context awareness.

**Endpoint**: `POST /functions/v1/fitness-chat`

**Parameters**:
```typescript
interface FitnessChatRequest {
  userId: string;
  message: string;
  conversationId: string;
  context: {
    currentProgram?: ExerciseProgram;
    recentWorkouts: WorkoutSession[];
    goals: string[];
    preferences: UserPreferences;
    injuries?: string[];
  };
  messageType: 'question' | 'progress_update' | 'motivation_request' | 'form_check';
}
```

**Response**:
```typescript
interface FitnessChatResponse {
  success: boolean;
  response: {
    message: string;
    suggestions: string[];
    exerciseRecommendations?: Exercise[];
    formTips?: string[];
    motivationalTip?: string;
    followUpQuestions: string[];
  };
  conversationId: string;
  responseTime: number;
}
```

---

## 🤖 **AI Coaching Functions**

### **coach-chat**

AI coaching conversation processing with context awareness.

**Endpoint**: `POST /functions/v1/coach-chat`

**Parameters**:
```typescript
interface CoachChatRequest {
  userId: string;
  message: string;
  conversationId: string;
  context: {
    currentGoals: string[];
    recentWorkouts: WorkoutSession[];
    recentMeals: DailyMeals[];
    progressData: ProgressData;
    preferences: UserPreferences;
  };
  messageType: 'question' | 'progress_update' | 'motivation_request';
}
```

**Response**:
```typescript
interface CoachChatResponse {
  success: boolean;
  response: {
    message: string;
    suggestions: string[];
    actionItems: ActionItem[];
    followUpQuestions: string[];
    motivationalTip?: string;
    resourceLinks?: ResourceLink[];
  };
  conversationId: string;
  responseTime: number;
}
```

---

## 📊 **Data Processing Functions**

### **process-food-data**

Food database search and nutrition calculation.

**Endpoint**: `POST /functions/v1/process-food-data`

**Parameters**:
```typescript
interface ProcessFoodDataRequest {
  query: string;
  searchType: 'ingredient' | 'recipe' | 'barcode';
  language: 'en' | 'ar';
  nutritionDetail: 'basic' | 'detailed';
  portion?: {
    amount: number;
    unit: string;
  };
}
```

### **calculate-nutrition**

Comprehensive nutrition calculations for meals and recipes.

**Endpoint**: `POST /functions/v1/calculate-nutrition`

**Parameters**:
```typescript
interface CalculateNutritionRequest {
  ingredients: Ingredient[];
  servings: number;
  cookingMethod?: string;
  calculationType: 'meal' | 'recipe' | 'daily_total';
  userGoals?: NutritionGoals;
}
```

### **track-progress**

Progress tracking and analytics processing.

**Endpoint**: `POST /functions/v1/track-progress`

**Parameters**:
```typescript
interface TrackProgressRequest {
  userId: string;
  progressType: 'weight' | 'measurements' | 'workout' | 'nutrition';
  data: ProgressData;
  date: string;
  notes?: string;
  photoUrls?: string[];
}
```

---

## 📧 **Communication Functions**

### **send-notification**

Push notification system for user engagement.

**Endpoint**: `POST /functions/v1/send-notification`

**Parameters**:
```typescript
interface SendNotificationRequest {
  userId: string;
  type: 'workout_reminder' | 'meal_time' | 'progress_update' | 'achievement';
  title: string;
  message: string;
  data?: Record<string, any>;
  scheduledTime?: string;
  priority: 'low' | 'normal' | 'high';
}
```

### **send-progress-report**

Weekly progress email reports with charts and insights.

**Endpoint**: `POST /functions/v1/send-progress-report`

**Parameters**:
```typescript
interface SendProgressReportRequest {
  userId: string;
  email: string;
  reportType: 'weekly' | 'monthly' | 'custom';
  dateRange: {
    start: string;
    end: string;
  };
  includeCharts: boolean;
  includeRecommendations: boolean;
}
```

---

## 🛠️ **Utility Functions**

### **image-upload**

Profile and progress photo upload handling with optimization.

**Endpoint**: `POST /functions/v1/image-upload`

**Parameters**:
```typescript
interface ImageUploadRequest {
  userId: string;
  imageType: 'profile' | 'progress' | 'meal' | 'form_check';
  imageData: string; // base64 encoded
  metadata?: {
    date: string;
    notes: string;
    tags: string[];
  };
  optimization: {
    resize: boolean;
    quality: number; // 1-100
    format: 'jpeg' | 'webp' | 'png';
  };
}
```

### **generate-report**

PDF report generation for progress and meal plans.

**Endpoint**: `POST /functions/v1/generate-report`

**Parameters**:
```typescript
interface GenerateReportRequest {
  userId: string;
  reportType: 'progress' | 'meal_plan' | 'workout_plan';
  data: ReportData;
  template: 'standard' | 'detailed' | 'summary';
  language: 'en' | 'ar';
  includeCharts: boolean;
}
```

### **backup-user-data**

User data backup and export functionality.

**Endpoint**: `POST /functions/v1/backup-user-data`

**Parameters**:
```typescript
interface BackupUserDataRequest {
  userId: string;
  backupType: 'full' | 'selective';
  dataTypes?: string[]; // ['meals', 'workouts', 'progress', 'preferences']
  format: 'json' | 'csv' | 'pdf';
  includeMedia: boolean;
}
```

---

## 🔐 **Authentication & Security**

### **Required Headers**
```bash
Authorization: Bearer [JWT_TOKEN]
Content-Type: application/json
apikey: [SUPABASE_ANON_KEY]
```

### **Rate Limiting**
```typescript
// Rate limits per function type
const rateLimits = {
  ai_functions: '10/minute',      // AI generation functions
  data_functions: '60/minute',    // Data processing functions
  utility_functions: '30/minute', // Utility functions
  communication: '20/minute'      // Email/notification functions
};
```

### **Error Handling**
```typescript
// Standard error response format
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId: string;
  };
}
```

---

## 🚀 **Performance Metrics**

### **Function Performance**
- **AI Generation**: 3-7 seconds average response time
- **Data Processing**: <500ms for most operations
- **Communication**: <2 seconds for email/notifications
- **Utility Functions**: <1 second average

### **Optimization Features**
- **Caching**: Intelligent caching for repeated requests
- **Compression**: Response compression for large datasets
- **Streaming**: Streaming responses for real-time updates
- **Batching**: Batch processing for multiple operations

---

## 🧪 **Testing & Development**

### **Local Development**
```bash
# Start local Edge Function development
supabase functions serve

# Test function locally
curl -X POST http://localhost:54321/functions/v1/generate-meal-plan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN]" \
  -d '{"userId": "test", "preferences": {...}}'
```

### **Testing Strategy**
- **Unit Tests**: Individual function testing
- **Integration Tests**: End-to-end API testing
- **Load Tests**: Performance under high load
- **Security Tests**: Authentication and authorization

---

## 📋 **Deployment & Monitoring**

### **Deployment Process**
```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy generate-meal-plan
```

### **Monitoring**
- **Logs**: Real-time function execution logs
- **Metrics**: Performance and usage analytics
- **Alerts**: Error rate and latency monitoring
- **Health Checks**: Automated function health monitoring

---

The Edge Functions provide a robust, scalable backend infrastructure for FitFatta's AI-powered fitness and nutrition platform. 🔥✨ 