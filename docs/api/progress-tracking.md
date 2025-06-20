
# Progress Tracking API

Comprehensive progress monitoring system for weight, measurements, goals, and achievements.

## ⚖️ Weight & Body Composition

### Log Weight Entry
**Method**: `POST`  
**Table**: `weight_entries`

```javascript
const logWeightEntry = async (userId, weightData) => {
  const { data, error } = await supabase
    .from('weight_entries')
    .insert({
      user_id: userId,
      weight: weightData.weight,
      body_fat_percentage: weightData.body_fat_percentage,
      muscle_mass: weightData.muscle_mass,
      notes: weightData.notes,
      recorded_at: weightData.recorded_at || new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
};
```

**Request Body**:
```json
{
  "weight": 70.5,
  "body_fat_percentage": 18.5,
  "muscle_mass": 45.2,
  "notes": "Feeling stronger after 2 weeks of training",
  "recorded_at": "2024-01-15T08:00:00Z"
}
```

### Get Weight History
**Method**: `GET`  
**Table**: `weight_entries`

```javascript
const getWeightHistory = async (userId, timeRange = '30d', limit = 100) => {
  const startDate = new Date();
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('weight_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('recorded_at', startDate.toISOString())
    .order('recorded_at', { ascending: true })
    .limit(limit);

  return { data, error };
};
```

**Response**:
```json
[
  {
    "id": "entry-uuid",
    "user_id": "user-uuid",
    "weight": 70.5,
    "body_fat_percentage": 18.5,
    "muscle_mass": 45.2,
    "notes": "Feeling stronger",
    "recorded_at": "2024-01-15T08:00:00Z"
  }
]
```

### Get Weight Statistics
```javascript
const getWeightStatistics = async (userId, timeRange = '30d') => {
  const { data, error } = await getWeightHistory(userId, timeRange);
  
  if (error || !data.length) return { data: null, error };

  const stats = {
    current: data[data.length - 1].weight,
    starting: data[0].weight,
    change: data[data.length - 1].weight - data[0].weight,
    changePercentage: ((data[data.length - 1].weight - data[0].weight) / data[0].weight) * 100,
    entries: data.length,
    averageWeeklyChange: 0,
    trend: 'stable'
  };

  // Calculate weekly average change
  if (data.length > 1) {
    const weeks = Math.ceil(data.length / 7);
    stats.averageWeeklyChange = stats.change / weeks;
    
    // Determine trend
    if (stats.change > 0.5) stats.trend = 'increasing';
    else if (stats.change < -0.5) stats.trend = 'decreasing';
  }

  return { data: stats, error: null };
};
```

### Update Weight Entry
**Method**: `PATCH`  
**Table**: `weight_entries`

```javascript
const updateWeightEntry = async (entryId, updates) => {
  const { data, error } = await supabase
    .from('weight_entries')
    .update(updates)
    .eq('id', entryId)
    .select()
    .single();

  return { data, error };
};
```

### Delete Weight Entry
**Method**: `DELETE`  
**Table**: `weight_entries`

```javascript
const deleteWeightEntry = async (entryId) => {
  const { error } = await supabase
    .from('weight_entries')
    .delete()
    .eq('id', entryId);

  return { error };
};
```

## 🎯 Goals Management

### Create Goal
**Method**: `POST`  
**Table**: `user_goals`

```javascript
const createGoal = async (userId, goalData) => {
  const { data, error } = await supabase
    .from('user_goals')
    .insert({
      user_id: userId,
      goal_type: goalData.goal_type,
      category: goalData.category,
      title: goalData.title,
      description: goalData.description,
      target_value: goalData.target_value,
      current_value: goalData.current_value || 0,
      target_unit: goalData.target_unit,
      start_date: goalData.start_date || new Date().toISOString().split('T')[0],
      target_date: goalData.target_date,
      priority: goalData.priority || 'medium',
      difficulty: goalData.difficulty || 'medium',
      tags: goalData.tags || [],
      notes: goalData.notes,
      milestones: goalData.milestones || [],
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
  "goal_type": "weight_loss",
  "category": "fitness",
  "title": "Lose 10kg by Summer",
  "description": "Reach target weight of 65kg through diet and exercise",
  "target_value": 65,
  "current_value": 75,
  "target_unit": "kg",
  "start_date": "2024-01-15",
  "target_date": "2024-06-15",
  "priority": "high",
  "difficulty": "medium",
  "tags": ["health", "summer_prep"],
  "notes": "Focus on sustainable weight loss",
  "milestones": [
    {
      "value": 72,
      "date": "2024-03-01",
      "description": "First milestone"
    },
    {
      "value": 68,
      "date": "2024-04-15",
      "description": "Halfway point"
    }
  ]
}
```

### Get User Goals
**Method**: `GET`  
**Table**: `user_goals`

```javascript
const getUserGoals = async (userId, status = 'active') => {
  const { data, error } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', userId)
    .eq('status', status)
    .order('created_at', { ascending: false });

  return { data, error };
};
```

### Update Goal Progress
**Method**: `PATCH`  
**Table**: `user_goals`

```javascript
const updateGoalProgress = async (goalId, currentValue, notes = null) => {
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

### Complete Goal
**Method**: `PATCH`  
**Table**: `user_goals`

```javascript
const completeGoal = async (goalId) => {
  const { data, error } = await supabase
    .from('user_goals')
    .update({
      status: 'completed',
      current_value: supabase.rpc('get_goal_target_value', { goal_id: goalId }),
      updated_at: new Date().toISOString()
    })
    .eq('id', goalId)
    .select()
    .single();

  return { data, error };
};
```

### Get Goal Progress Analytics
```javascript
const getGoalProgressAnalytics = async (goalId) => {
  const { data: goal, error } = await supabase
    .from('user_goals')
    .select('*')
    .eq('id', goalId)
    .single();

  if (error) return { error };

  const progressPercentage = goal.target_value > 0 
    ? Math.min((goal.current_value / goal.target_value) * 100, 100)
    : 0;

  const daysElapsed = Math.floor(
    (new Date() - new Date(goal.start_date)) / (1000 * 60 * 60 * 24)
  );

  const totalDays = Math.floor(
    (new Date(goal.target_date) - new Date(goal.start_date)) / (1000 * 60 * 60 * 24)
  );

  const timeProgressPercentage = Math.min((daysElapsed / totalDays) * 100, 100);

  const analytics = {
    goal: goal,
    progress: {
      percentage: progressPercentage,
      remaining: goal.target_value - goal.current_value,
      status: progressPercentage >= 100 ? 'completed' : 
              progressPercentage >= 75 ? 'on_track' : 
              progressPercentage >= 50 ? 'behind' : 'far_behind'
    },
    timeline: {
      daysElapsed: daysElapsed,
      totalDays: totalDays,
      daysRemaining: Math.max(totalDays - daysElapsed, 0),
      timeProgressPercentage: timeProgressPercentage
    },
    milestones: goal.milestones.map(milestone => ({
      ...milestone,
      achieved: goal.current_value >= milestone.value,
      daysUntil: Math.floor(
        (new Date(milestone.date) - new Date()) / (1000 * 60 * 60 * 24)
      )
    }))
  };

  return { data: analytics, error: null };
};
```

## 🏆 Achievements System

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
      "streak_days": 7,
      "total_calories_burned": 1500
    }
  }
]
```

### Award Achievement
**Method**: `POST`  
**Table**: `user_achievements`

```javascript
const awardAchievement = async (userId, achievementId, progressData = {}) => {
  // Check if achievement already exists
  const { data: existing } = await supabase
    .from('user_achievements')
    .select('id')
    .eq('user_id', userId)
    .eq('achievement_id', achievementId)
    .single();

  if (existing) {
    return { data: null, error: 'Achievement already earned' };
  }

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

### Check Achievement Eligibility
```javascript
const checkAchievementEligibility = async (userId) => {
  const achievements = [];

  // Check workout streak
  const { data: workouts } = await supabase
    .from('daily_workouts')
    .select('completed, completed_at, weekly_exercise_programs!inner(user_id)')
    .eq('weekly_exercise_programs.user_id', userId)
    .eq('completed', true)
    .order('completed_at', { ascending: false })
    .limit(30);

  // Calculate streak
  let currentStreak = 0;
  const today = new Date();
  
  for (const workout of workouts || []) {
    const workoutDate = new Date(workout.completed_at);
    const daysDiff = Math.floor((today - workoutDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === currentStreak) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Check for streak achievements
  if (currentStreak >= 7 && !await hasAchievement(userId, 'week_streak')) {
    achievements.push({
      id: 'week_streak',
      title: 'Week Warrior',
      description: 'Complete workouts for 7 consecutive days',
      progress_data: { streak_days: currentStreak }
    });
  }

  if (currentStreak >= 30 && !await hasAchievement(userId, 'month_streak')) {
    achievements.push({
      id: 'month_streak',
      title: 'Monthly Master',
      description: 'Complete workouts for 30 consecutive days',
      progress_data: { streak_days: currentStreak }
    });
  }

  // Check weight loss achievements
  const { data: weightStats } = await getWeightStatistics(userId, '90d');
  if (weightStats && weightStats.change <= -5 && !await hasAchievement(userId, 'weight_loss_5kg')) {
    achievements.push({
      id: 'weight_loss_5kg',
      title: 'Five Kilo Fighter',
      description: 'Lose 5kg or more',
      progress_data: { weight_lost: Math.abs(weightStats.change) }
    });
  }

  return achievements;
};

const hasAchievement = async (userId, achievementId) => {
  const { data } = await supabase
    .from('user_achievements')
    .select('id')
    .eq('user_id', userId)
    .eq('achievement_id', achievementId)
    .single();
  
  return !!data;
};
```

## 📊 Progress Analytics Dashboard

### Get Overall Progress Summary
```javascript
const getOverallProgressSummary = async (userId, timeRange = '30d') => {
  const startDate = new Date();
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  startDate.setDate(startDate.getDate() - days);

  // Get workout stats
  const { data: workouts } = await supabase
    .from('daily_workouts')
    .select('completed, actual_duration, actual_calories, weekly_exercise_programs!inner(user_id)')
    .eq('weekly_exercise_programs.user_id', userId)
    .gte('updated_at', startDate.toISOString());

  // Get nutrition stats
  const { data: nutrition } = await supabase
    .from('food_consumption_log')
    .select('calories_consumed, protein_consumed')
    .eq('user_id', userId)
    .gte('consumed_at', startDate.toISOString());

  // Get weight stats
  const { data: weightStats } = await getWeightStatistics(userId, timeRange);

  // Get goal progress
  const { data: goals } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active');

  const summary = {
    workouts: {
      total: workouts?.length || 0,
      completed: workouts?.filter(w => w.completed).length || 0,
      totalMinutes: workouts?.reduce((sum, w) => sum + (w.actual_duration || 0), 0) || 0,
      totalCalories: workouts?.reduce((sum, w) => sum + (w.actual_calories || 0), 0) || 0,
      completionRate: workouts?.length > 0 ? 
        (workouts.filter(w => w.completed).length / workouts.length) * 100 : 0
    },
    nutrition: {
      totalCalories: nutrition?.reduce((sum, n) => sum + (n.calories_consumed || 0), 0) || 0,
      totalProtein: nutrition?.reduce((sum, n) => sum + (n.protein_consumed || 0), 0) || 0,
      avgDailyCalories: nutrition?.length > 0 ? 
        nutrition.reduce((sum, n) => sum + (n.calories_consumed || 0), 0) / days : 0
    },
    weight: weightStats || { current: 0, change: 0, trend: 'stable' },
    goals: {
      total: goals?.length || 0,
      onTrack: goals?.filter(g => {
        const progress = g.target_value > 0 ? (g.current_value / g.target_value) * 100 : 0;
        return progress >= 50;
      }).length || 0
    },
    timeRange: timeRange
  };

  return { data: summary, error: null };
};
```

### Get Progress Charts Data
```javascript
const getProgressChartsData = async (userId, timeRange = '30d') => {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Weight progression
  const { data: weightData } = await getWeightHistory(userId, timeRange);
  
  // Workout frequency
  const { data: workoutData } = await supabase
    .from('daily_workouts')
    .select('completed_at, completed, weekly_exercise_programs!inner(user_id)')
    .eq('weekly_exercise_programs.user_id', userId)
    .gte('completed_at', startDate.toISOString())
    .order('completed_at', { ascending: true });

  // Nutrition trends
  const { data: nutritionData } = await supabase
    .from('food_consumption_log')
    .select('consumed_at, calories_consumed, protein_consumed')
    .eq('user_id', userId)
    .gte('consumed_at', startDate.toISOString())
    .order('consumed_at', { ascending: true });

  return {
    data: {
      weight: weightData?.map(entry => ({
        date: entry.recorded_at.split('T')[0],
        weight: entry.weight,
        bodyFat: entry.body_fat_percentage
      })) || [],
      workouts: workout


Data?.map(workout => ({
        date: workout.completed_at.split('T')[0],
        completed: workout.completed ? 1 : 0
      })) || [],
      nutrition: nutritionData?.reduce((acc, entry) => {
        const date = entry.consumed_at.split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, calories: 0, protein: 0 };
        }
        acc[date].calories += entry.calories_consumed || 0;
        acc[date].protein += entry.protein_consumed || 0;
        return acc;
      }, {}) || {}
    },
    error: null
  };
};
```

## 🔄 Real-time Progress Updates

### Subscribe to Progress Changes
```javascript
const subscribeToProgressUpdates = (userId, callback) => {
  const channels = [];

  // Weight entries
  channels.push(
    supabase
      .channel('weight-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weight_entries',
          filter: `user_id=eq.${userId}`
        },
        (payload) => callback({ type: 'weight', data: payload })
      )
      .subscribe()
  );

  // Goals updates
  channels.push(
    supabase
      .channel('goals-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_goals',
          filter: `user_id=eq.${userId}`
        },
        (payload) => callback({ type: 'goals', data: payload })
      )
      .subscribe()
  );

  // Achievements
  channels.push(
    supabase
      .channel('achievements-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_achievements',
          filter: `user_id=eq.${userId}`
        },
        (payload) => callback({ type: 'achievement', data: payload })
      )
      .subscribe()
  );

  return channels;
};
```

## 🚫 Error Handling

### Common Error Codes
```javascript
const PROGRESS_ERRORS = {
  'INVALID_WEIGHT_VALUE': 'Weight must be between 20kg and 300kg',
  'FUTURE_DATE_NOT_ALLOWED': 'Cannot log entries for future dates',
  'GOAL_TARGET_INVALID': 'Goal target value must be positive',
  'ACHIEVEMENT_ALREADY_EARNED': 'This achievement has already been earned',
  'MILESTONE_DATE_INVALID': 'Milestone date must be between start and target dates'
};
```

### Validation Rules
- **Weight**: Between 20kg and 300kg
- **Body fat percentage**: Between 3% and 50%
- **Goal values**: Must be positive numbers
- **Dates**: Cannot be in the future for entries
- **Achievement IDs**: Must match predefined achievement types

This comprehensive progress tracking API provides complete monitoring of fitness journeys with goals, achievements, and detailed analytics.
