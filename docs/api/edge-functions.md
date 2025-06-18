
# Edge Functions API Reference

## 🚀 Overview
FitFatta uses Supabase Edge Functions for AI processing, payment handling, and business logic. All functions are deployed automatically and follow security best practices.

## 📋 Function Inventory

### AI Generation Functions

#### `generate-meal-plan`
**Purpose**: AI-powered meal plan generation with cultural adaptations  
**Authentication**: Required  
**Rate Limiting**: Credit-based system  

**Request Format**:
```typescript
{
  user_id: string;
  preferences: {
    cuisine: string;
    dietary_restrictions: string[];
    allergies: string[];
    week_start_date: string;
  };
  nutrition_targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
```

**Response Format**:
```typescript
{
  success: boolean;
  meal_plan_id?: string;
  meals?: DailyMeal[];
  error?: string;
  metadata: {
    credits_used: number;
    remaining_credits: number;
  };
}
```

#### `generate-meal-recipe`
**Purpose**: Detailed recipe generation for specific meals  
**Authentication**: Required  
**Rate Limiting**: Credit-based system  

#### `generate-exercise-program`
**Purpose**: AI-generated workout programs  
**Authentication**: Required  
**Rate Limiting**: Credit-based system  

#### `generate-meal-alternatives`
**Purpose**: Smart meal swapping with nutrition matching  
**Authentication**: Required  
**Rate Limiting**: Credit-based system  

#### `exchange-exercise`
**Purpose**: Alternative exercise recommendations  
**Authentication**: Required  
**Rate Limiting**: Credit-based system  

#### `analyze-food-image`
**Purpose**: AI-powered food recognition and calorie estimation  
**Authentication**: Required  
**Rate Limiting**: Credit-based system  

#### `generate-ai-snack`
**Purpose**: Quick snack recommendations  
**Authentication**: Required  
**Rate Limiting**: Credit-based system  

#### `generate-meal-image`
**Purpose**: AI-generated meal images for visual appeal  
**Authentication**: Required  
**Rate Limiting**: Credit-based system  

### Communication Functions

#### `fitness-chat`
**Purpose**: AI fitness coaching conversations  
**Authentication**: Required  
**Rate Limiting**: Credit-based system  

#### `chat`
**Purpose**: General AI chat assistant  
**Authentication**: Required  
**Rate Limiting**: Credit-based system  

### Utility Functions

#### `shuffle-weekly-meals`
**Purpose**: Randomize meal order within week while maintaining nutrition  
**Authentication**: Required  
**Rate Limiting**: Standard API limits  

#### `send-shopping-list-email`
**Purpose**: Email shopping lists to users  
**Authentication**: Required  
**Rate Limiting**: Email-specific limits  

#### `get-exercise-recommendations`
**Purpose**: Exercise suggestions based on user profile  
**Authentication**: Required  
**Rate Limiting**: Standard API limits  

#### `track-exercise-performance`
**Purpose**: Log and analyze workout performance  
**Authentication**: Required  
**Rate Limiting**: Standard API limits  

### Payment Functions

#### `create-subscription`
**Purpose**: Stripe subscription creation  
**Authentication**: Required  
**Rate Limiting**: Payment-specific limits  

#### `cancel-subscription`
**Purpose**: Stripe subscription cancellation  
**Authentication**: Required  
**Rate Limiting**: Payment-specific limits  

## 🔒 Security Implementation

### Authentication
All functions use Supabase JWT authentication except webhook endpoints:
```typescript
const authHeader = req.headers.get('Authorization');
if (!authHeader) {
  return new Response('Unauthorized', { status: 401 });
}
```

### Rate Limiting
Credit-based system for AI functions:
```typescript
const creditCheck = await checkAndUseAIGeneration(userId, 'meal_plan');
if (!creditCheck.success) {
  return new Response('Insufficient credits', { status: 429 });
}
```

### CORS Headers
All functions include proper CORS configuration:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

## 🔧 Error Handling Patterns

### Standard Error Response
```typescript
{
  success: false,
  error: string,
  error_code?: string,
  details?: any
}
```

### AI Provider Fallback Chain
1. **Primary**: OpenAI (GPT-4o-mini, GPT-4o)
2. **Fallback**: Google Gemini
3. **Backup**: Anthropic Claude

## 📊 Monitoring & Analytics

### Function Logging
All functions log:
- Request/response data
- Processing time
- Error details
- User context
- Credit usage

### Performance Metrics
- Average response time
- Success/failure rates
- Credit consumption patterns
- User engagement metrics

## 🚀 Deployment

Functions are automatically deployed via Lovable platform:
- No manual deployment required
- Automatic secret management
- Built-in monitoring and scaling
- Version control integration

## 📱 Client Integration

### React Hook Pattern
```typescript
const { data, isLoading, error } = useMutation({
  mutationFn: async (params) => {
    const { data, error } = await supabase.functions.invoke('function-name', {
      body: params
    });
    if (error) throw error;
    return data;
  }
});
```

### Error Handling
```typescript
try {
  const response = await supabase.functions.invoke('function-name', { body });
  if (!response.data?.success) {
    throw new Error(response.data?.error || 'Function failed');
  }
  return response.data;
} catch (error) {
  console.error('Function call failed:', error);
  throw error;
}
```
