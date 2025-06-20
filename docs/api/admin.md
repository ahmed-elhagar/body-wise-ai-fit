
# Admin API

Complete administrative system for user management, system monitoring, and platform administration.

## 👥 User Management

### Get All Users
**Method**: `GET`  
**Table**: `profiles`

```javascript
const getAllUsers = async (limit = 100, offset = 0) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      first_name,
      last_name,
      role,
      created_at,
      last_seen,
      is_online,
      profile_completion_score,
      ai_generations_remaining,
      age,
      weight,
      height,
      fitness_goal,
      gender,
      nationality,
      dietary_restrictions,
      allergies,
      health_conditions,
      activity_level,
      onboarding_completed
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error };
};
```

**Response**:
```json
[
  {
    "id": "user-uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "normal",
    "created_at": "2024-01-15T10:30:00Z",
    "last_seen": "2024-01-16T14:20:00Z",
    "is_online": false,
    "profile_completion_score": 75,
    "ai_generations_remaining": 3,
    "age": 32,
    "weight": 80,
    "height": 180,
    "fitness_goal": "muscle_gain",
    "gender": "male",
    "nationality": "United States",
    "dietary_restrictions": ["vegetarian"],
    "allergies": ["nuts"],
    "health_conditions": [],
    "activity_level": "moderately_active",
    "onboarding_completed": true
  }
]
```

### Update User Role
**Method**: `PATCH`  
**Table**: `profiles`

```javascript
const updateUserRole = async (userId, newRole) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      role: newRole,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
};
```

### Delete User
**Method**: `DELETE`  
**Table**: `profiles`

```javascript
const deleteUser = async (userId) => {
  // First, delete related data
  await supabase.from('weekly_meal_plans').delete().eq('user_id', userId);
  await supabase.from('weekly_exercise_programs').delete().eq('user_id', userId);
  await supabase.from('weight_entries').delete().eq('user_id', userId);
  await supabase.from('user_goals').delete().eq('user_id', userId);
  await supabase.from('user_preferences').delete().eq('user_id', userId);
  await supabase.from('onboarding_progress').delete().eq('user_id', userId);
  
  // Finally, delete the profile
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  return { error };
};
```

### Force Logout User
**Method**: Database Function Call

```javascript
const forceLogoutUser = async (userId) => {
  const { error } = await supabase.rpc('invalidate_all_user_sessions', {
    target_user_id: userId
  });

  return { error };
};
```

### Reset AI Generations
**Method**: Database Function Call

```javascript
const resetAIGenerations = async (userId, count = 5) => {
  const { error } = await supabase.rpc('reset_ai_generations', {
    target_user_id: userId,
    new_count: count
  });

  return { error };
};
```

## 💳 Subscription Management

### Get All Subscriptions
**Method**: `GET`  
**Table**: `subscriptions`

```javascript
const getAllSubscriptions = async () => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      user:user_id(
        first_name,
        last_name,
        email
      )
    `)
    .order('created_at', { ascending: false });

  return { data, error };
};
```

### Cancel Subscription (Admin)
**Endpoint**: `POST /functions/v1/admin-cancel-subscription`

```javascript
const cancelUserSubscription = async (targetUserId, refund = false) => {
  const { data, error } = await supabase.functions.invoke('admin-cancel-subscription', {
    body: {
      target_user_id: targetUserId,
      refund: refund
    }
  });

  return { data, error };
};
```

**Response**:
```json
{
  "success": true,
  "message": "Subscription cancelled successfully",
  "refund_applied": false
}
```

### Update Subscription Status
**Method**: `PATCH`  
**Table**: `subscriptions`

```javascript
const updateSubscriptionStatus = async (subscriptionId, status) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ 
      status: status,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscriptionId)
    .select()
    .single();

  return { data, error };
};
```

## 🤖 AI Generation Monitoring

### Get AI Generation Logs
**Method**: `GET`  
**Table**: `ai_generation_logs`

```javascript
const getAIGenerationLogs = async (limit = 100, offset = 0) => {
  const { data, error } = await supabase
    .from('ai_generation_logs')
    .select(`
      *,
      user:user_id(
        first_name,
        last_name,
        email
      )
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error };
};
```

**Response**:
```json
[
  {
    "id": "log-uuid",
    "user_id": "user-uuid",
    "generation_type": "meal_plan",
    "status": "completed",
    "credits_used": 1,
    "created_at": "2024-01-15T10:30:00Z",
    "prompt_data": {
      "user_preferences": {
        "cuisine": "mediterranean",
        "dietary_restrictions": ["vegetarian"]
      }
    },
    "response_data": {
      "meals_generated": 35,
      "total_calories": 14000
    },
    "error_message": null,
    "user": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    }
  }
]
```

### Get AI Usage Statistics
```javascript
const getAIUsageStats = async (timeRange = '30d') => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (timeRange === '7d' ? 7 : 30));

  const { data, error } = await supabase
    .from('ai_generation_logs')
    .select('generation_type, status, credits_used, created_at')
    .gte('created_at', startDate.toISOString());

  if (error) return { error };

  const stats = data.reduce((acc, log) => {
    // Total generations by type
    acc.byType[log.generation_type] = (acc.byType[log.generation_type] || 0) + 1;
    
    // Success rate
    if (log.status === 'completed') {
      acc.successful += 1;
    } else if (log.status === 'failed') {
      acc.failed += 1;
    }
    
    // Total credits used
    acc.totalCredits += log.credits_used || 0;
    
    return acc;
  }, {
    byType: {},
    successful: 0,
    failed: 0,
    totalCredits: 0,
    total: data.length
  });

  stats.successRate = stats.total > 0 ? (stats.successful / stats.total) * 100 : 0;

  return { data: stats, error: null };
};
```

## 🔧 AI Model Management

### Get AI Models
**Method**: `GET`  
**Table**: `ai_models`

```javascript
const getAIModels = async () => {
  const { data, error } = await supabase
    .from('ai_models')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};
```

### Update AI Model Status
**Method**: `PATCH`  
**Table**: `ai_models`

```javascript
const updateAIModelStatus = async (modelId, isActive) => {
  const { data, error } = await supabase
    .from('ai_models')
    .update({ 
      is_active: isActive,
      updated_at: new Date().toISOString()
    })
    .eq('id', modelId)
    .select()
    .single();

  return { data, error };
};
```

### Create AI Model
**Method**: `POST`  
**Table**: `ai_models`

```javascript
const createAIModel = async (modelData) => {
  const { data, error } = await supabase
    .from('ai_models')
    .insert({
      name: modelData.name,
      model_id: modelData.model_id,
      provider: modelData.provider,
      description: modelData.description,
      capabilities: modelData.capabilities,
      context_window: modelData.context_window,
      max_tokens: modelData.max_tokens,
      cost_per_1k_tokens: modelData.cost_per_1k_tokens,
      is_active: true,
      is_default: false,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
};
```

## 📈 System Analytics

### Get Platform Statistics
```javascript
const getPlatformStats = async () => {
  // Get user counts
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: activeUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('last_seen', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  // Get subscription counts
  const { count: activeSubscriptions } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // Get AI generation counts
  const { count: totalGenerations } = await supabase
    .from('ai_generation_logs')
    .select('*', { count: 'exact', head: true });

  // Get coach counts
  const { count: coachCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .in('role', ['coach', 'admin']);

  return {
    users: {
      total: totalUsers || 0,
      active: activeUsers || 0,
      growth: 0 // Calculate growth rate separately
    },
    subscriptions: {
      active: activeSubscriptions || 0,
      revenue: 0 // Calculate from subscription data
    },
    ai: {
      totalGenerations: totalGenerations || 0,
      creditsUsed: 0 // Calculate from AI logs
    },
    coaches: {
      total: coachCount || 0
    }
  };
};
```

### Get Revenue Analytics
```javascript
const getRevenueAnalytics = async (timeRange = '30d') => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (timeRange === '7d' ? 7 : 30));

  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('plan_type, created_at, status, current_period_start, current_period_end')
    .gte('created_at', startDate.toISOString());

  if (error) return { error };

  const revenue = subscriptions.reduce((acc, sub) => {
    const amount = sub.plan_type === 'monthly' ? 19 : 144; // Price in USD
    if (sub.status === 'active') {
      acc.total += amount;
      acc.byPlan[sub.plan_type] = (acc.byPlan[sub.plan_type] || 0) + amount;
    }
    return acc;
  }, {
    total: 0,
    byPlan: {},
    subscriptions: subscriptions.length
  });

  return { data: revenue, error: null };
};
```

## 🔄 System Management

### Force Logout All Users
**Method**: Database Function Call

```javascript
const forceLogoutAllUsers = async () => {
  const { error } = await supabase.rpc('force_logout_all_users');
  return { error };
};
```

### Clean Up System Data
```javascript
const cleanUpSystemData = async () => {
  // Clean old sessions
  await supabase.rpc('cleanup_old_sessions');
  
  // Clean typing indicators
  await supabase.rpc('cleanup_typing_indicators');
  
  // Clean old AI logs (optional)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  await supabase
    .from('ai_generation_logs')
    .delete()
    .lt('created_at', thirtyDaysAgo.toISOString())
    .eq('status', 'failed');

  return { success: true };
};
```

### Get System Health
```javascript
const getSystemHealth = async () => {
  // Check database connectivity
  const { data: dbTest, error: dbError } = await supabase
    .from('profiles')
    .select('id')
    .limit(1);

  // Get active sessions
  const { count: activeSessions } = await supabase
    .from('active_sessions')
    .select('*', { count: 'exact', head: true })
    .gte('last_activity', new Date(Date.now() - 30 * 60 * 1000).toISOString());

  // Get recent errors
  const { count: recentErrors } = await supabase
    .from('ai_generation_logs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'failed')
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

  return {
    database: dbError ? 'unhealthy' : 'healthy',
    activeSessions: activeSessions || 0,
    recentErrors: recentErrors || 0,
    status: dbError || (recentErrors || 0) > 10 ? 'warning' : 'healthy',
    lastCheck: new Date().toISOString()
  };
};
```

## 📝 Audit Logging

### Log Admin Action
**Method**: `POST`  
**Table**: `audit_logs`

```javascript
const logAdminAction = async (adminUserId, action, targetUserId, details) => {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert({
      admin_user_id: adminUserId,
      action: action,
      target_user_id: targetUserId,
      details: details,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
};
```

### Get Audit Logs
**Method**: `GET`  
**Table**: `audit_logs`

```javascript
const getAuditLogs = async (limit = 100, offset = 0) => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select(`
      *,
      admin_user:admin_user_id(first_name, last_name, email),
      target_user:target_user_id(first_name, last_name, email)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error };
};
```

## 🚫 Error Handling & Security

### Admin Authorization Check
```javascript
const checkAdminAuth = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || data?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }

  return true;
};
```

### Rate Limiting
- **User management actions**: 100 actions per hour per admin
- **Subscription modifications**: 50 actions per hour per admin
- **System operations**: 20 actions per hour per admin
- **Bulk operations**: 10 operations per hour per admin

This comprehensive admin API provides complete platform management capabilities with proper security, logging, and monitoring features.
