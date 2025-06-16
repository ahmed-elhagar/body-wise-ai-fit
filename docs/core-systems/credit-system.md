
# FitFatta Credit System Documentation

Comprehensive guide to the credit-based AI generation system for React Native/Expo implementation.

## 🏗️ System Architecture

### Overview
FitFatta implements a credit-based system to manage AI generation usage, prevent abuse, and provide premium features through subscription tiers. The system supports both free and pro users with different limitations and capabilities.

### Core Components
```typescript
interface CreditSystem {
  userTiers: UserTier[];
  rateLimiting: RateLimit[];
  generationTracking: GenerationLog[];
  subscriptionIntegration: SubscriptionManager;
  refundMechanism: RefundSystem;
}
```

## 📊 Database Schema

### Credit Tracking Tables
```sql
-- User credit balance (in profiles table)
ALTER TABLE profiles ADD COLUMN ai_generations_remaining INTEGER DEFAULT 5;

-- Generation logging and tracking
CREATE TABLE ai_generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  generation_type TEXT NOT NULL, -- 'meal_plan', 'exercise_program', 'meal_exchange'
  prompt_data JSONB DEFAULT '{}',
  response_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  credits_used INTEGER DEFAULT 1,
  error_message TEXT,
  model_used TEXT, -- 'openai-gpt4', 'google-gemini', 'anthropic-claude'
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Subscription tracking for pro features
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  status TEXT NOT NULL, -- 'active', 'canceled', 'past_due', 'incomplete'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan_type TEXT, -- 'pro_monthly', 'pro_yearly'
  trial_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate limiting tracking
CREATE TABLE rate_limit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  action_type TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Database Functions
```sql
-- Enhanced credit check and usage function
CREATE OR REPLACE FUNCTION check_and_use_ai_generation(
  user_id_param UUID,
  generation_type_param TEXT,
  prompt_data_param JSONB DEFAULT '{}'
) RETURNS JSONB AS $$
DECLARE
  current_remaining INTEGER;
  is_pro BOOLEAN;
  is_admin BOOLEAN;
  log_id UUID;
  user_role TEXT;
BEGIN
  -- Get user role and remaining credits
  SELECT ai_generations_remaining, role INTO current_remaining, user_role
  FROM profiles WHERE id = user_id_param;
  
  -- Check if user is admin or has pro subscription
  is_admin := user_role = 'admin';
  
  SELECT EXISTS (
    SELECT 1 FROM subscriptions 
    WHERE user_id = user_id_param 
    AND status = 'active' 
    AND current_period_end > NOW()
  ) INTO is_pro;
  
  -- Admin and pro users have unlimited access
  IF is_admin OR is_pro THEN
    INSERT INTO ai_generation_logs (
      user_id, generation_type, prompt_data, status, credits_used
    ) VALUES (
      user_id_param, generation_type_param, prompt_data_param, 'pending', 0
    ) RETURNING id INTO log_id;
    
    RETURN jsonb_build_object(
      'success', true,
      'log_id', log_id,
      'remaining', -1, -- Unlimited
      'is_pro', is_pro,
      'is_admin', is_admin
    );
  END IF;
  
  -- Check free user credits
  IF current_remaining <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'AI generation limit reached',
      'remaining', 0,
      'is_pro', false,
      'upgrade_required', true
    );
  END IF;
  
  -- Create log entry and decrement credit
  INSERT INTO ai_generation_logs (
    user_id, generation_type, prompt_data, status, credits_used
  ) VALUES (
    user_id_param, generation_type_param, prompt_data_param, 'pending', 1
  ) RETURNING id INTO log_id;
  
  -- Decrement credits for free users
  UPDATE profiles
  SET ai_generations_remaining = ai_generations_remaining - 1,
      updated_at = NOW()
  WHERE id = user_id_param;
  
  RETURN jsonb_build_object(
    'success', true,
    'log_id', log_id,
    'remaining', current_remaining - 1,
    'is_pro', false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Complete generation function with refund on failure
CREATE OR REPLACE FUNCTION complete_ai_generation(
  log_id_param UUID,
  success_param BOOLEAN,
  response_data_param JSONB DEFAULT '{}',
  error_message_param TEXT DEFAULT NULL,
  model_used_param TEXT DEFAULT NULL,
  processing_time_param INTEGER DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
  generation_record RECORD;
BEGIN
  -- Get the generation record
  SELECT * INTO generation_record 
  FROM ai_generation_logs 
  WHERE id = log_id_param;
  
  -- Update the log entry
  UPDATE ai_generation_logs
  SET 
    response_data = response_data_param,
    error_message = error_message_param,
    status = CASE WHEN success_param THEN 'completed' ELSE 'failed' END,
    model_used = model_used_param,
    processing_time_ms = processing_time_param,
    completed_at = NOW()
  WHERE id = log_id_param;
  
  -- Refund credit if generation failed and credit was used
  IF NOT success_param AND generation_record.credits_used > 0 THEN
    UPDATE profiles 
    SET ai_generations_remaining = ai_generations_remaining + generation_record.credits_used,
        updated_at = NOW()
    WHERE id = generation_record.user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🎯 Generation Types & Costs

### Credit Cost Structure
```typescript
const creditCosts = {
  // Core AI generations (cost 1 credit each)
  meal_plan: 1,           // Full 7-day meal plan generation
  exercise_program: 1,    // Weekly exercise program
  meal_exchange: 1,       // Single meal replacement
  exercise_exchange: 1,   // Single exercise replacement
  food_analysis: 1,       // AI food image analysis
  
  // Free features (no credit cost)
  recipe_enhancement: 0,  // Recipe details generation
  shopping_list: 0,       // Grocery list generation
  nutrition_summary: 0,   // Weekly nutrition analysis
  progress_tracking: 0    // Progress chart generation
};

const generationLimits = {
  free_user: {
    daily: 2,
    weekly: 10,
    monthly: 30
  },
  pro_user: {
    daily: -1,    // Unlimited
    weekly: -1,   // Unlimited
    monthly: -1   // Unlimited
  }
};
```

## 🔄 React Native Implementation

### Credit System Hook
```typescript
// src/hooks/useCreditSystem.ts
export const useCreditSystem = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Get current credit status
  const { data: creditStatus, isLoading, refetch } = useQuery({
    queryKey: ['user-credits', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('ai_generations_remaining, role')
        .eq('id', user.id)
        .single();
        
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('current_period_end', new Date().toISOString())
        .maybeSingle();
        
      const isPro = !!subscription;
      const isAdmin = profile?.role === 'admin';
      
      return {
        remaining: profile?.ai_generations_remaining || 0,
        isPro,
        isAdmin,
        hasUnlimited: isPro || isAdmin,
        subscription
      };
    },
    enabled: !!user?.id,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000 // 1 minute
  });
  
  // Check and use credit function
  const checkAndUseCredit = useMutation({
    mutationFn: async (params: {
      generationType: string;
      promptData?: any;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.rpc('check_and_use_ai_generation', {
        user_id_param: user.id,
        generation_type_param: params.generationType,
        prompt_data_param: params.promptData || {}
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      
      return data;
    },
    onSuccess: () => {
      // Refresh credit status
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
    }
  });
  
  // Complete generation function
  const completeGeneration = useMutation({
    mutationFn: async (params: {
      logId: string;
      success: boolean;
      responseData?: any;
      errorMessage?: string;
      modelUsed?: string;
      processingTime?: number;
    }) => {
      const { error } = await supabase.rpc('complete_ai_generation', {
        log_id_param: params.logId,
        success_param: params.success,
        response_data_param: params.responseData || {},
        error_message_param: params.errorMessage,
        model_used_param: params.modelUsed,
        processing_time_param: params.processingTime
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      // Refresh credit status if there was a refund
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
    }
  });
  
  return {
    // Status
    remaining: creditStatus?.remaining || 0,
    isPro: creditStatus?.isPro || false,
    isAdmin: creditStatus?.isAdmin || false,
    hasUnlimited: creditStatus?.hasUnlimited || false,
    hasCredits: creditStatus?.hasUnlimited || (creditStatus?.remaining || 0) > 0,
    isLoading,
    
    // Actions
    checkAndUseCredit: checkAndUseCredit.mutateAsync,
    completeGeneration: completeGeneration.mutateAsync,
    refresh: refetch,
    
    // Loading states
    isUsingCredit: checkAndUseCredit.isPending,
    isCompletingGeneration: completeGeneration.isPending
  };
};
```

### Usage Pattern in Components
```typescript
// Example: Using credits in meal plan generation
const MealPlanGenerator = () => {
  const { checkAndUseCredit, completeGeneration, hasCredits, remaining } = useCreditSystem();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateMealPlan = async (preferences: MealPlanPreferences) => {
    if (!hasCredits) {
      Alert.alert('No Credits', 'You need credits to generate meal plans. Upgrade to Pro for unlimited access.');
      return;
    }
    
    setIsGenerating(true);
    let logId: string | null = null;
    
    try {
      // Step 1: Check and use credit
      const creditResult = await checkAndUseCredit({
        generationType: 'meal_plan',
        promptData: { preferences, timestamp: new Date().toISOString() }
      });
      
      logId = creditResult.log_id;
      
      // Step 2: Generate meal plan
      const { data } = await supabase.functions.invoke('generate-meal-plan', {
        body: { preferences, userId: user.id }
      });
      
      // Step 3: Mark as completed
      await completeGeneration({
        logId,
        success: true,
        responseData: { mealPlanId: data.id },
        modelUsed: data.modelUsed,
        processingTime: data.processingTime
      });
      
      // Navigate to meal plan
      navigation.navigate('MealPlan', { planId: data.id });
      
    } catch (error) {
      // Step 4: Mark as failed (auto-refunds credit)
      if (logId) {
        await completeGeneration({
          logId,
          success: false,
          errorMessage: error.message
        });
      }
      
      Alert.alert('Generation Failed', 'Failed to generate meal plan. Your credit has been refunded.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.creditsText}>
        Credits Remaining: {hasCredits ? (remaining === -1 ? '∞' : remaining) : '0'}
      </Text>
      
      <Button
        title={isGenerating ? 'Generating...' : 'Generate Meal Plan'}
        onPress={() => generateMealPlan(preferences)}
        disabled={isGenerating || !hasCredits}
      />
      
      {!hasCredits && (
        <View style={styles.upgradePrompt}>
          <Text style={styles.upgradeText}>
            No credits remaining. Upgrade to Pro for unlimited AI generations.
          </Text>
          <Button title="Upgrade to Pro" onPress={() => navigation.navigate('Subscription')} />
        </View>
      )}
    </View>
  );
};
```

## 📱 Mobile-Specific Features

### Offline Credit Tracking
```typescript
// src/services/OfflineCreditService.ts
class OfflineCreditService {
  private static STORAGE_KEY = 'offline_credit_status';
  
  static async cacheCredits(creditData: any) {
    await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      ...creditData,
      cachedAt: Date.now()
    }));
  }
  
  static async getCachedCredits(): Promise<any | null> {
    try {
      const cached = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      const isStale = Date.now() - data.cachedAt > 300000; // 5 minutes
      
      return isStale ? null : data;
    } catch {
      return null;
    }
  }
  
  static async clearCache() {
    await AsyncStorage.removeItem(this.STORAGE_KEY);
  }
}
```

### Credit Status Component
```typescript
// src/components/CreditStatusCard.tsx
export const CreditStatusCard = () => {
  const { remaining, isPro, isAdmin, hasUnlimited } = useCreditSystem();
  const navigation = useNavigation();
  
  const getStatusColor = () => {
    if (hasUnlimited) return '#22c55e'; // Green for unlimited
    if (remaining > 3) return '#3b82f6';  // Blue for good
    if (remaining > 0) return '#f59e0b';  // Orange for low
    return '#ef4444'; // Red for none
  };
  
  const getStatusText = () => {
    if (hasUnlimited) return 'Unlimited';
    if (remaining === 0) return 'No credits';
    return `${remaining} credit${remaining === 1 ? '' : 's'}`;
  };
  
  return (
    <View style={[styles.card, { borderColor: getStatusColor() }]}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Generations</Text>
        {(isPro || isAdmin) && (
          <View style={styles.proBadge}>
            <Text style={styles.proText}>{isAdmin ? 'ADMIN' : 'PRO'}</Text>
          </View>
        )}
      </View>
      
      <Text style={[styles.status, { color: getStatusColor() }]}>
        {getStatusText()}
      </Text>
      
      {!hasUnlimited && remaining <= 1 && (
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => navigation.navigate('Subscription')}
        >
          <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
```

## 🔒 Security & Validation

### Rate Limiting Implementation
```typescript
// Edge Function: Rate limiting check
const checkRateLimit = async (userId: string, action: string) => {
  const now = new Date();
  const windowStart = new Date(now.getTime() - (60 * 60 * 1000)); // 1 hour window
  
  const { count } = await supabase
    .from('ai_generation_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', windowStart.toISOString());
    
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
    
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();
    
  const isAdmin = profile?.role === 'admin';
  const isPro = !!subscription;
  
  // Rate limits
  const limits = {
    free: 3,   // 3 per hour
    pro: 50,   // 50 per hour
    admin: -1  // Unlimited
  };
  
  const userLimit = isAdmin ? limits.admin : (isPro ? limits.pro : limits.free);
  
  return {
    allowed: userLimit === -1 || count < userLimit,
    remaining: userLimit === -1 ? -1 : Math.max(0, userLimit - count),
    resetTime: new Date(now.getTime() + (60 * 60 * 1000))
  };
};
```

## 📊 Analytics & Monitoring

### Credit Usage Analytics
```typescript
// src/hooks/useCreditAnalytics.ts
export const useCreditAnalytics = (timeRange: '7d' | '30d' | '90d' = '30d') => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['credit-analytics', user?.id, timeRange],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data: logs } = await supabase
        .from('ai_generation_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });
        
      if (!logs) return null;
      
      const analytics = {
        totalGenerations: logs.length,
        creditsUsed: logs.reduce((sum, log) => sum + (log.credits_used || 0), 0),
        successRate: logs.filter(log => log.status === 'completed').length / logs.length,
        byType: logs.reduce((acc, log) => {
          acc[log.generation_type] = (acc[log.generation_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        dailyUsage: logs.reduce((acc, log) => {
          const date = new Date(log.created_at).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + (log.credits_used || 0);
          return acc;
        }, {} as Record<string, number>)
      };
      
      return analytics;
    },
    enabled: !!user?.id
  });
};
```

This comprehensive credit system documentation provides everything needed to implement a robust, secure, and user-friendly credit management system in React Native with proper offline support, analytics, and subscription integration.
