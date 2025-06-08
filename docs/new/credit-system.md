
# FitFatta Credit System Documentation

## Overview
FitFatta implements a credit-based system to manage AI generation usage, prevent abuse, and provide premium features through subscription tiers.

## Credit Architecture

### 1. Database Schema

#### User Credits Table
```sql
-- User credit balance (stored in profiles table)
ALTER TABLE profiles ADD COLUMN ai_generations_remaining INTEGER DEFAULT 5;

-- Credit usage tracking
CREATE TABLE ai_generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  generation_type TEXT NOT NULL, -- 'meal_plan', 'exercise_program', 'meal_exchange', etc.
  prompt_data JSONB,
  response_data JSONB,
  status TEXT DEFAULT 'started', -- 'started', 'completed', 'failed'
  credits_used INTEGER DEFAULT 1,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Subscription tracking
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  status TEXT NOT NULL, -- 'active', 'canceled', 'past_due'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  plan_type TEXT, -- 'pro_monthly', 'pro_yearly'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Database Functions
```sql
-- Check and use credit function
CREATE OR REPLACE FUNCTION check_and_use_ai_generation(
  user_id_param UUID,
  generation_type_param TEXT,
  prompt_data_param JSONB DEFAULT '{}'
) RETURNS JSONB AS $$
DECLARE
  current_remaining INTEGER;
  is_pro BOOLEAN;
  log_id UUID;
BEGIN
  -- Check if user is pro
  SELECT EXISTS (
    SELECT 1 FROM subscriptions 
    WHERE user_id = user_id_param 
    AND status = 'active' 
    AND current_period_end > NOW()
  ) INTO is_pro;
  
  -- Pro users have unlimited credits
  IF is_pro THEN
    -- Create log entry
    INSERT INTO ai_generation_logs (
      user_id, generation_type, prompt_data, status, credits_used
    ) VALUES (
      user_id_param, generation_type_param, prompt_data_param, 'started', 0
    ) RETURNING id INTO log_id;
    
    RETURN jsonb_build_object(
      'success', true,
      'log_id', log_id,
      'remaining', -1,
      'is_pro', true
    );
  END IF;
  
  -- Get current remaining for free users
  SELECT ai_generations_remaining INTO current_remaining
  FROM profiles WHERE id = user_id_param;
  
  -- Check if user has credits
  IF current_remaining <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'AI generation limit reached',
      'remaining', 0,
      'is_pro', false
    );
  END IF;
  
  -- Create log entry and decrement credit
  INSERT INTO ai_generation_logs (
    user_id, generation_type, prompt_data, status, credits_used
  ) VALUES (
    user_id_param, generation_type_param, prompt_data_param, 'started', 1
  ) RETURNING id INTO log_id;
  
  -- Decrement the count
  UPDATE profiles
  SET ai_generations_remaining = ai_generations_remaining - 1
  WHERE id = user_id_param;
  
  RETURN jsonb_build_object(
    'success', true,
    'log_id', log_id,
    'remaining', current_remaining - 1,
    'is_pro', false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Complete generation function
CREATE OR REPLACE FUNCTION complete_ai_generation(
  log_id_param UUID,
  success_param BOOLEAN,
  response_data_param JSONB DEFAULT '{}',
  error_message_param TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  UPDATE ai_generation_logs
  SET 
    response_data = response_data_param,
    error_message = error_message_param,
    status = CASE WHEN success_param THEN 'completed' ELSE 'failed' END,
    completed_at = NOW()
  WHERE id = log_id_param;
  
  -- If generation failed, refund credit for free users
  IF NOT success_param THEN
    UPDATE profiles 
    SET ai_generations_remaining = ai_generations_remaining + (
      SELECT credits_used FROM ai_generation_logs WHERE id = log_id_param
    )
    WHERE id = (
      SELECT user_id FROM ai_generation_logs WHERE id = log_id_param
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Credit Types & Costs

#### Generation Types
```typescript
const creditCosts = {
  meal_plan: 1,           // Full 7-day meal plan
  meal_exchange: 1,       // Single meal exchange
  exercise_program: 1,    // Weekly exercise program
  exercise_exchange: 1,   // Single exercise exchange
  food_analysis: 1,       // Food image analysis
  recipe_enhancement: 0,  // Free feature
  shopping_list: 0        // Free feature
};
```

#### User Tiers
```typescript
const userTiers = {
  free: {
    monthlyCredits: 5,
    features: [
      'basic_meal_plans',
      'basic_exercise_programs',
      'limited_exchanges'
    ],
    restrictions: {
      maxMealsPerWeek: 21, // 3 meals per day
      maxExercisesPerWeek: 21
    }
  },
  pro: {
    monthlyCredits: -1, // Unlimited
    features: [
      'unlimited_ai_generations',
      'premium_meal_plans',
      'advanced_exercise_programs',
      'unlimited_exchanges',
      'priority_support',
      'advanced_analytics'
    ],
    restrictions: {}
  }
};
```

## Credit Management Hooks

### 1. Centralized Credit Hook
```typescript
// src/hooks/useCentralizedCredits.ts
export const useCentralizedCredits = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Get current credit status
  const { data: creditStatus, isLoading } = useQuery({
    queryKey: ['user-credits', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('ai_generations_remaining')
        .eq('id', user.id)
        .single();
        
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
        
      const isPro = subscription && 
        new Date(subscription.current_period_end) > new Date();
        
      return {
        remaining: profile?.ai_generations_remaining || 0,
        isPro,
        subscription
      };
    },
    enabled: !!user?.id,
    staleTime: 30000 // 30 seconds
  });
  
  // Check and use credit
  const checkAndUseCreditAsync = async (generationType = 'meal_plan', promptData = {}) => {
    if (!user?.id) return false;
    
    const { data, error } = await supabase.rpc('check_and_use_ai_generation', {
      user_id_param: user.id,
      generation_type_param: generationType,
      prompt_data_param: promptData
    });
    
    if (error) throw error;
    
    // Refresh credit status
    queryClient.invalidateQueries({ queryKey: ['user-credits'] });
    
    return data.success;
  };
  
  // Complete generation
  const completeGenerationAsync = async (logId: string, success: boolean, responseData = {}, errorMessage?: string) => {
    await supabase.rpc('complete_ai_generation', {
      log_id_param: logId,
      success_param: success,
      response_data_param: responseData,
      error_message_param: errorMessage
    });
    
    // Refresh credit status
    queryClient.invalidateQueries({ queryKey: ['user-credits'] });
  };
  
  return {
    remaining: creditStatus?.remaining || 0,
    isPro: creditStatus?.isPro || false,
    hasCredits: creditStatus?.isPro || (creditStatus?.remaining || 0) > 0,
    isLoading,
    checkAndUseCreditAsync,
    completeGenerationAsync,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['user-credits'] })
  };
};
```

### 2. Credit System Hook (Legacy)
```typescript
// src/hooks/useCreditSystem.ts
export const useCreditSystem = () => {
  const { checkAndUseCreditAsync, completeGenerationAsync, ...rest } = useCentralizedCredits();
  
  // Wrapper for backward compatibility
  const useCredit = async (generationType: string) => {
    return await checkAndUseCreditAsync(generationType);
  };
  
  const completeGeneration = async (logId: string, success: boolean) => {
    return await completeGenerationAsync(logId, success);
  };
  
  return {
    ...rest,
    useCredit,
    completeGeneration,
    checkAndUseCreditAsync,
    completeGenerationAsync
  };
};
```

## Credit Validation Flow

### 1. Pre-Generation Check
```typescript
const handleAIGeneration = async (generationType: string, promptData: any) => {
  const { checkAndUseCreditAsync, completeGenerationAsync } = useCentralizedCredits();
  
  try {
    // Step 1: Check and reserve credit
    const hasCredit = await checkAndUseCreditAsync(generationType, promptData);
    
    if (!hasCredit) {
      toast.error('No AI credits remaining. Upgrade to Pro for unlimited access.');
      return false;
    }
    
    // Step 2: Perform AI generation
    const result = await performAIGeneration(promptData);
    
    // Step 3: Mark as completed
    await completeGenerationAsync(result.logId, true, result.data);
    
    return true;
    
  } catch (error) {
    // Step 4: Mark as failed (auto-refunds credit)
    if (error.logId) {
      await completeGenerationAsync(error.logId, false, {}, error.message);
    }
    
    throw error;
  }
};
```

### 2. Edge Function Integration
```typescript
// In Edge Functions
const validateAndUseCredit = async (userId: string, generationType: string) => {
  const { data, error } = await supabase.rpc('check_and_use_ai_generation', {
    user_id_param: userId,
    generation_type_param: generationType,
    prompt_data_param: { timestamp: new Date().toISOString() }
  });
  
  if (error || !data.success) {
    throw new Error(data.error || 'Credit validation failed');
  }
  
  return data.log_id;
};

// Usage in edge function
export default async (req: Request) => {
  try {
    const { userId, ...requestData } = await req.json();
    
    // Validate and use credit
    const logId = await validateAndUseCredit(userId, 'meal_plan');
    
    // Perform AI operation
    const result = await generateMealPlan(requestData);
    
    // Mark as completed
    await supabase.rpc('complete_ai_generation', {
      log_id_param: logId,
      success_param: true,
      response_data_param: { result_id: result.id }
    });
    
    return new Response(JSON.stringify({ success: true, data: result }));
    
  } catch (error) {
    // Auto-refund handled by complete_ai_generation function
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
```

## Rate Limiting

### 1. Rate Limit Configuration
```typescript
const rateLimits = {
  free_user: {
    per_hour: 3,
    per_day: 5,
    per_month: 30
  },
  pro_user: {
    per_hour: 50,
    per_day: 200,
    per_month: -1 // Unlimited
  }
};
```

### 2. Rate Limit Enforcement
```typescript
const checkRateLimit = async (userId: string, generationType: string) => {
  const windowHour = new Date().toISOString().slice(0, 13) + ':00:00Z';
  const windowDay = new Date().toISOString().slice(0, 10);
  
  // Count recent generations
  const { count: hourlyCount } = await supabase
    .from('ai_generation_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', windowHour);
    
  const { count: dailyCount } = await supabase
    .from('ai_generation_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', windowDay);
  
  // Check if user is pro
  const isPro = await isProUser(userId);
  const limits = rateLimits[isPro ? 'pro_user' : 'free_user'];
  
  return {
    allowed: (hourlyCount < limits.per_hour) && (dailyCount < limits.per_day),
    remaining: {
      hourly: limits.per_hour - hourlyCount,
      daily: limits.per_day - dailyCount
    }
  };
};
```

## Subscription Integration

### 1. Stripe Webhook Handler
```typescript
// Handle subscription events
const handleSubscriptionUpdate = async (stripeEvent: any) => {
  const subscription = stripeEvent.data.object;
  
  switch (stripeEvent.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: subscription.metadata.user_id,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000),
          current_period_end: new Date(subscription.current_period_end * 1000),
          plan_type: subscription.items.data[0].price.id
        });
      break;
      
    case 'customer.subscription.deleted':
      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', subscription.id);
      break;
  }
};
```

### 2. Credit Refresh for Free Users
```typescript
// Monthly credit refresh for free users
const refreshFreeUserCredits = async () => {
  const { data: freeUsers } = await supabase
    .from('profiles')
    .select('id')
    .not('id', 'in', 
      supabase
        .from('subscriptions')
        .select('user_id')
        .eq('status', 'active')
    );
    
  if (freeUsers?.length) {
    await supabase
      .from('profiles')
      .update({ ai_generations_remaining: 5 })
      .in('id', freeUsers.map(u => u.id));
  }
};
```

## Analytics & Monitoring

### 1. Credit Usage Analytics
```typescript
const getCreditAnalytics = async (userId: string, timeRange: string) => {
  const { data } = await supabase
    .from('ai_generation_logs')
    .select('generation_type, status, credits_used, created_at')
    .eq('user_id', userId)
    .gte('created_at', getTimeRangeStart(timeRange));
    
  return {
    totalGenerations: data.length,
    creditsUsed: data.reduce((sum, log) => sum + log.credits_used, 0),
    byType: groupBy(data, 'generation_type'),
    successRate: data.filter(log => log.status === 'completed').length / data.length
  };
};
```

### 2. System-wide Metrics
```typescript
const getSystemMetrics = async () => {
  // Daily generation counts
  const { data: dailyStats } = await supabase
    .from('ai_generation_logs')
    .select('generation_type, status, created_at')
    .gte('created_at', getDateDaysAgo(30));
    
  // User tier distribution
  const { data: userStats } = await supabase
    .from('profiles')
    .select('ai_generations_remaining');
    
  const { data: proUsers } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('status', 'active');
    
  return {
    totalGenerations: dailyStats.length,
    dailyAverage: dailyStats.length / 30,
    freeUsers: userStats.length - proUsers.length,
    proUsers: proUsers.length,
    conversionRate: proUsers.length / userStats.length
  };
};
```

## Error Handling & Recovery

### 1. Failed Generation Recovery
```typescript
const handleFailedGeneration = async (logId: string, error: Error) => {
  // Mark generation as failed (auto-refunds credit)
  await supabase.rpc('complete_ai_generation', {
    log_id_param: logId,
    success_param: false,
    error_message_param: error.message
  });
  
  // Log error for analysis
  console.error('AI Generation failed:', {
    logId,
    error: error.message,
    timestamp: new Date().toISOString()
  });
  
  // Notify user
  toast.error('AI generation failed. Your credit has been refunded.');
};
```

### 2. Credit Reconciliation
```typescript
// Periodic reconciliation of credit balances
const reconcileCredits = async () => {
  const { data: logs } = await supabase
    .from('ai_generation_logs')
    .select('user_id, credits_used, status')
    .eq('status', 'started')
    .lt('created_at', getHoursAgo(2)); // Older than 2 hours
    
  // Mark stale generations as failed and refund credits
  for (const log of logs) {
    await supabase.rpc('complete_ai_generation', {
      log_id_param: log.id,
      success_param: false,
      error_message_param: 'Generation timeout - auto-refunded'
    });
  }
};
```
