
# User Management API

Comprehensive user profile management, preferences, and administrative functions.

## 👤 Profile Management

### Get User Profile
**Method**: `GET`  
**Table**: `profiles`

```javascript
const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      user_preferences(*),
      subscriptions(*),
      onboarding_progress(*)
    `)
    .eq('id', userId)
    .single();
    
  return { data, error };
};
```

**Response**:
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "first_name": "Sarah",
  "last_name": "Johnson",
  "age": 28,
  "gender": "female",
  "height": 165,
  "weight": 68,
  "fitness_goal": "weight_loss",
  "activity_level": "moderately_active",
  "nationality": "Saudi Arabia",
  "preferred_language": "ar",
  "dietary_restrictions": ["vegetarian"],
  "allergies": ["nuts"],
  "health_conditions": ["diabetes"],
  "pregnancy_trimester": null,
  "breastfeeding_level": null,
  "fasting_type": null,
  "profile_completion_score": 85,
  "ai_generations_remaining": 3,
  "role": "normal",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-16T14:20:00Z"
}
```

### Update Profile
**Method**: `PATCH`  
**Table**: `profiles`

```javascript
const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();
    
  return { data, error };
};
```

### Calculate Profile Completion
**Method**: Database Function Call

```javascript
const getProfileCompletion = async (userId) => {
  const { data, error } = await supabase.rpc('calculate_profile_completion_score', {
    user_id_param: userId
  });
  
  return { data, error };
};
```

## ⚙️ User Preferences

### Get User Preferences
**Method**: `GET`  
**Table**: `user_preferences`

```javascript
const getUserPreferences = async (userId) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  return { data, error };
};
```

**Response**:
```json
{
  "user_id": "user-uuid",
  "theme_preference": "light",
  "preferred_language": "en",
  "measurement_units": "metric",
  "email_notifications": true,
  "push_notifications": true,
  "sms_notifications": false,
  "marketing_emails": false,
  "data_sharing_analytics": true,
  "data_sharing_research": false,
  "automatic_meal_planning": true,
  "automatic_exercise_planning": true,
  "ai_suggestions": true,
  "progress_reminders": true,
  "meal_reminder_times": {
    "breakfast": "08:00",
    "lunch": "12:00",
    "dinner": "18:00"
  },
  "workout_reminder_time": "18:00:00",
  "profile_visibility": "private"
}
```

### Update Preferences
**Method**: `PATCH`  
**Table**: `user_preferences`

```javascript
const updatePreferences = async (userId, preferences) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .update({
      ...preferences,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single();
    
  return { data, error };
};
```

## 🚀 Onboarding Management

### Get Onboarding Progress
**Method**: `GET`  
**Table**: `onboarding_progress`

```javascript
const getOnboardingProgress = async (userId) => {
  const { data, error } = await supabase
    .from('onboarding_progress')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  return { data, error };
};
```

**Response**:
```json
{
  "user_id": "user-uuid",
  "current_step": 3,
  "total_steps": 5,
  "completion_percentage": 60,
  "welcome_viewed": true,
  "welcome_viewed_at": "2024-01-15T10:30:00Z",
  "basic_info_completed": true,
  "basic_info_completed_at": "2024-01-15T10:35:00Z",
  "health_assessment_completed": true,
  "health_assessment_completed_at": "2024-01-15T10:45:00Z",
  "goals_setup_completed": false,
  "goals_setup_completed_at": null,
  "preferences_completed": false,
  "preferences_completed_at": null,
  "profile_review_completed": false,
  "profile_review_completed_at": null,
  "skipped_steps": [],
  "skip_reasons": {},
  "started_at": "2024-01-15T10:30:00Z",
  "completed_at": null
}
```

### Update Onboarding Step
**Method**: `PATCH`  
**Table**: `onboarding_progress`

```javascript
const updateOnboardingStep = async (userId, stepData) => {
  const { data, error } = await supabase
    .from('onboarding_progress')
    .update({
      ...stepData,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single();
    
  return { data, error };
};
```

## 💳 Subscription Management

### Get User Subscription
**Method**: `GET`  
**Table**: `subscriptions`

```javascript
const getUserSubscription = async (userId) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  return { data, error };
};
```

**Response**:
```json
{
  "id": "sub-uuid",
  "user_id": "user-uuid",
  "stripe_subscription_id": "sub_stripe_id",
  "stripe_customer_id": "cus_stripe_id",
  "status": "active",
  "plan_type": "premium",
  "stripe_price_id": "price_stripe_id",
  "current_period_start": "2024-01-15T00:00:00Z",
  "current_period_end": "2024-02-15T00:00:00Z",
  "cancel_at_period_end": false,
  "trial_end": null,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Check Pro Status
**Method**: Database Function Call

```javascript
const isProUser = async (userId) => {
  const { data, error } = await supabase.rpc('is_pro_user', {
    user_id: userId
  });
  
  return { data, error };
};
```

## 🏆 Goals Management

### Get User Goals
**Method**: `GET`  
**Table**: `user_goals`

```javascript
const getUserGoals = async (userId) => {
  const { data, error } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });
    
  return { data, error };
};
```

**Response**:
```json
[
  {
    "id": "goal-uuid",
    "user_id": "user-uuid",
    "goal_type": "weight_loss",
    "category": "fitness",
    "title": "Lose 10 kg",
    "description": "Reach target weight of 60kg by summer",
    "target_value": 60,
    "current_value": 70,
    "target_unit": "kg",
    "start_date": "2024-01-15",
    "target_date": "2024-06-15",
    "status": "active",
    "priority": "high",
    "difficulty": "medium",
    "milestones": [
      {
        "value": 67,
        "date": "2024-03-01",
        "achieved": true
      },
      {
        "value": 64,
        "date": "2024-04-15",
        "achieved": false
      }
    ],
    "tags": ["health", "summer_prep"],
    "notes": "Focus on sustainable weight loss",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### Create Goal
**Method**: `POST`  
**Table**: `user_goals`

```javascript
const createGoal = async (userId, goalData) => {
  const { data, error } = await supabase
    .from('user_goals')
    .insert({
      user_id: userId,
      ...goalData,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
    
  return { data, error };
};
```

### Update Goal Progress
**Method**: `PATCH`  
**Table**: `user_goals`

```javascript
const updateGoalProgress = async (goalId, currentValue, notes) => {
  const { data, error } = await supabase
    .from('user_goals')
    .update({
      current_value: currentValue,
      notes: notes,
      updated_at: new Date().toISOString()
    })
    .eq('id', goalId)
    .select()
    .single();
    
  return { data, error };
};
```

## 🏅 Achievements System

### Get User Achievements
**Method**: `GET`  
**Table**: `user_achievements`

```javascript
const getUserAchievements = async (userId) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });
    
  return { data, error };
};
```

**Response**:
```json
[
  {
    "id": "achievement-uuid",
    "user_id": "user-uuid",
    "achievement_id": "first_week_complete",
    "earned_at": "2024-01-22T10:30:00Z",
    "progress_data": {
      "workouts_completed": 7,
      "streak_days": 7
    }
  }
]
```

### Award Achievement
**Method**: `POST`  
**Table**: `user_achievements`

```javascript
const awardAchievement = async (userId, achievementId, progressData) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .insert({
      user_id: userId,
      achievement_id: achievementId,
      progress_data: progressData,
      earned_at: new Date().toISOString()
    })
    .select()
    .single();
    
  return { data, error };
};
```

## 🔔 Notifications

### Get User Notifications
**Method**: `GET`  
**Table**: `user_notifications`

```javascript
const getUserNotifications = async (userId, limit = 20) => {
  const { data, error } = await supabase
    .from('user_notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
    
  return { data, error };
};
```

**Response**:
```json
[
  {
    "id": "notification-uuid",
    "user_id": "user-uuid",
    "type": "achievement",
    "title": "Achievement Unlocked!",
    "message": "Congratulations! You've completed your first week of workouts.",
    "is_read": false,
    "action_url": "/achievements",
    "metadata": {
      "achievement_id": "first_week_complete",
      "icon": "trophy"
    },
    "created_at": "2024-01-22T10:30:00Z"
  }
]
```

### Mark Notification as Read
**Method**: `PATCH`  
**Table**: `user_notifications`

```javascript
const markNotificationRead = async (notificationId) => {
  const { data, error } = await supabase
    .from('user_notifications')
    .update({ 
      is_read: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', notificationId)
    .select()
    .single();
    
  return { data, error };
};
```

## 📊 User Analytics

### Get User Activity Summary
```javascript
const getUserActivitySummary = async (userId, timeRange = '30d') => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (timeRange === '7d' ? 7 : 30));
  
  // Get workout stats
  const { data: workouts } = await supabase
    .from('daily_workouts')
    .select('completed, actual_duration, weekly_exercise_programs!inner(user_id)')
    .eq('weekly_exercise_programs.user_id', userId)
    .gte('updated_at', startDate.toISOString());
  
  // Get meal plan stats
  const { data: mealPlans } = await supabase
    .from('weekly_meal_plans')
    .select('id, created_at')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString());
  
  // Get AI usage
  const { data: aiUsage } = await supabase
    .from('ai_generation_logs')
    .select('credits_used, generation_type, status')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString());
  
  const summary = {
    workouts: {
      total: workouts?.length || 0,
      completed: workouts?.filter(w => w.completed).length || 0,
      totalMinutes: workouts?.reduce((sum, w) => sum + (w.actual_duration || 0), 0) || 0
    },
    mealPlans: {
      generated: mealPlans?.length || 0
    },
    aiUsage: {
      totalCredits: aiUsage?.reduce((sum, ai) => sum + ai.credits_used, 0) || 0,
      successfulGenerations: aiUsage?.filter(ai => ai.status === 'completed').length || 0
    }
  };
  
  return summary;
};
```

## 🔄 Real-time Features

### Online Status Management
```javascript
const updateOnlineStatus = async (userId, isOnline) => {
  const { error } = await supabase.rpc('update_user_online_status', {
    user_id: userId,
    is_online: isOnline
  });
  
  return { error };
};
```

### Subscribe to Profile Changes
```javascript
const subscribeToProfileUpdates = (userId, callback) => {
  return supabase
    .channel(`profile-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`
      },
      callback
    )
    .subscribe();
};
```

This comprehensive user management API provides complete profile management, preferences, goals tracking, and real-time capabilities for a personalized user experience.
