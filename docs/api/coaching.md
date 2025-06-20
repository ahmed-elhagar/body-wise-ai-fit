
# Coaching API

Complete coaching system for managing trainee relationships, communication, and progress tracking.

## 🏅 Coach Management

### Get Coach Trainees
**Method**: `GET`  
**Table**: `coach_trainees`

```javascript
const getCoachTrainees = async (coachId) => {
  const { data, error } = await supabase
    .from('coach_trainees')
    .select(`
      *,
      trainee:trainee_id(
        id,
        first_name,
        last_name,
        email,
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
        gender
      )
    `)
    .eq('coach_id', coachId)
    .order('assigned_at', { ascending: false });

  return { data, error };
};
```

**Response**:
```json
[
  {
    "id": "coach-trainee-uuid",
    "coach_id": "coach-uuid",
    "trainee_id": "trainee-uuid",
    "assigned_at": "2024-01-15T10:30:00Z",
    "notes": "New trainee, focus on weight loss",
    "trainee": {
      "id": "trainee-uuid",
      "first_name": "Sarah",
      "last_name": "Johnson",
      "email": "sarah@example.com",
      "role": "normal",
      "created_at": "2024-01-10T08:00:00Z",
      "last_seen": "2024-01-16T12:30:00Z",
      "is_online": true,
      "profile_completion_score": 85,
      "ai_generations_remaining": 3,
      "age": 28,
      "weight": 68,
      "height": 165,
      "fitness_goal": "weight_loss",
      "gender": "female"
    }
  }
]
```

### Assign Trainee to Coach
**Method**: `POST`  
**Table**: `coach_trainees`

```javascript
const assignTrainee = async (coachId, traineeId, notes) => {
  const { data, error } = await supabase
    .from('coach_trainees')
    .insert({
      coach_id: coachId,
      trainee_id: traineeId,
      notes,
      assigned_at: new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
};
```

### Update Trainee Notes
**Method**: `PATCH`  
**Table**: `coach_trainees`

```javascript
const updateTraineeNotes = async (coachId, traineeId, notes) => {
  const { data, error } = await supabase
    .from('coach_trainees')
    .update({ notes })
    .eq('coach_id', coachId)
    .eq('trainee_id', traineeId)
    .select()
    .single();

  return { data, error };
};
```

## 💬 Coach-Trainee Messaging

### Get Messages
**Method**: `GET`  
**Table**: `coach_trainee_messages`

```javascript
const getMessages = async (coachId, traineeId) => {
  const { data, error } = await supabase
    .from('coach_trainee_messages')
    .select('*')
    .eq('coach_id', coachId)
    .eq('trainee_id', traineeId)
    .order('created_at', { ascending: true });

  return { data, error };
};
```

**Response**:
```json
[
  {
    "id": "message-uuid",
    "coach_id": "coach-uuid",
    "trainee_id": "trainee-uuid",
    "sender_id": "coach-uuid",
    "sender_type": "coach",
    "message": "How are you feeling after yesterday's workout?",
    "message_type": "text",
    "is_read": true,
    "created_at": "2024-01-15T14:30:00Z",
    "updated_at": "2024-01-15T14:30:00Z"
  },
  {
    "id": "message-uuid-2",
    "coach_id": "coach-uuid",
    "trainee_id": "trainee-uuid",
    "sender_id": "trainee-uuid",
    "sender_type": "trainee",
    "message": "Great! A bit sore but feeling accomplished.",
    "message_type": "text",
    "is_read": false,
    "created_at": "2024-01-15T15:45:00Z",
    "updated_at": "2024-01-15T15:45:00Z"
  }
]
```

### Send Message
**Method**: `POST`  
**Table**: `coach_trainee_messages`

```javascript
const sendMessage = async (coachId, traineeId, senderId, senderType, message) => {
  const { data, error } = await supabase
    .from('coach_trainee_messages')
    .insert({
      coach_id: coachId,
      trainee_id: traineeId,
      sender_id: senderId,
      sender_type: senderType,
      message,
      message_type: 'text',
      is_read: false,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
};
```

### Mark Messages as Read
**Method**: `PATCH`  
**Table**: `coach_trainee_messages`

```javascript
const markMessagesAsRead = async (coachId, traineeId, readerId) => {
  const { data, error } = await supabase
    .from('coach_trainee_messages')
    .update({ is_read: true })
    .eq('coach_id', coachId)
    .eq('trainee_id', traineeId)
    .neq('sender_id', readerId)
    .eq('is_read', false);

  return { data, error };
};
```

## 📋 Task Management

### Get Coach Tasks
**Method**: `GET`  
**Table**: `coach_tasks`

```javascript
const getCoachTasks = async (coachId) => {
  const { data, error } = await supabase
    .from('coach_tasks')
    .select('*')
    .eq('coach_id', coachId)
    .order('created_at', { ascending: false });

  return { data, error };
};
```

**Response**:
```json
[
  {
    "id": "task-uuid",
    "coach_id": "coach-uuid",
    "trainee_id": "trainee-uuid",
    "title": "Review Weekly Progress",
    "description": "Check Sarah's workout completion and nutrition logs",
    "type": "review",
    "priority": "high",
    "completed": false,
    "due_date": "2024-01-20T18:00:00Z",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

### Create Task
**Method**: `POST`  
**Table**: `coach_tasks`

```javascript
const createTask = async (coachId, taskData) => {
  const { data, error } = await supabase
    .from('coach_tasks')
    .insert({
      coach_id: coachId,
      trainee_id: taskData.trainee_id,
      title: taskData.title,
      description: taskData.description,
      type: taskData.type,
      priority: taskData.priority,
      due_date: taskData.due_date,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
};
```

### Update Task
**Method**: `PATCH`  
**Table**: `coach_tasks`

```javascript
const updateTask = async (taskId, updates) => {
  const { data, error } = await supabase
    .from('coach_tasks')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId)
    .select()
    .single();

  return { data, error };
};
```

### Complete Task
**Method**: `PATCH`  
**Table**: `coach_tasks`

```javascript
const completeTask = async (taskId) => {
  const { data, error } = await supabase
    .from('coach_tasks')
    .update({
      completed: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId)
    .select()
    .single();

  return { data, error };
};
```

## 🍽️ Meal Plan Comments

### Add Meal Comment
**Method**: `POST`  
**Table**: `meal_comments`

```javascript
const addMealComment = async (coachId, traineeId, mealLogId, comment) => {
  const { data, error } = await supabase
    .from('meal_comments')
    .insert({
      coach_id: coachId,
      trainee_id: traineeId,
      meal_log_id: mealLogId,
      body: comment,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
};
```

### Get Meal Comments
**Method**: `GET`  
**Table**: `meal_comments`

```javascript
const getMealComments = async (mealLogId) => {
  const { data, error } = await supabase
    .from('meal_comments')
    .select(`
      *,
      coach:coach_id(first_name, last_name),
      trainee:trainee_id(first_name, last_name)
    `)
    .eq('meal_log_id', mealLogId)
    .order('created_at', { ascending: true });

  return { data, error };
};
```

## 📊 Trainee Progress Tracking

### Get Trainee Progress Summary
```javascript
const getTraineeProgressSummary = async (traineeId, timeRange = '30d') => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (timeRange === '7d' ? 7 : 30));

  // Get workout completion
  const { data: workouts } = await supabase
    .from('daily_workouts')
    .select('completed, weekly_exercise_programs!inner(user_id)')
    .eq('weekly_exercise_programs.user_id', traineeId)
    .gte('updated_at', startDate.toISOString());

  // Get weight entries
  const { data: weightEntries } = await supabase
    .from('weight_entries')
    .select('weight, recorded_at')
    .eq('user_id', traineeId)
    .gte('recorded_at', startDate.toISOString())
    .order('recorded_at', { ascending: true });

  // Get meal plan adherence
  const { data: mealPlans } = await supabase
    .from('weekly_meal_plans')
    .select('id, created_at')
    .eq('user_id', traineeId)
    .gte('created_at', startDate.toISOString());

  return {
    workouts: {
      total: workouts?.length || 0,
      completed: workouts?.filter(w => w.completed).length || 0,
      completionRate: workouts?.length > 0 ? 
        (workouts.filter(w => w.completed).length / workouts.length) * 100 : 0
    },
    weight: {
      entries: weightEntries?.length || 0,
      latest: weightEntries?.[weightEntries?.length - 1]?.weight,
      trend: weightEntries?.length > 1 ? 
        weightEntries[weightEntries.length - 1].weight - weightEntries[0].weight : 0
    },
    mealPlans: {
      generated: mealPlans?.length || 0
    }
  };
};
```

## 🔄 Real-time Features

### Coach Presence Tracking
```javascript
const trackCoachPresence = async (coachId, status) => {
  const channel = supabase.channel(`coach-presence-${coachId}`)
    .on('presence', { event: 'sync' }, () => {
      const presenceState = channel.presenceState();
      console.log('Coach presence updated:', presenceState);
    })
    .subscribe();

  // Track coach status
  await channel.track({
    coach_id: coachId,
    status: status, // 'online', 'busy', 'away'
    last_seen: new Date().toISOString()
  });

  return channel;
};
```

### Message Notifications
```javascript
const subscribeToMessages = (coachId, callback) => {
  return supabase
    .channel('coach-messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'coach_trainee_messages',
        filter: `coach_id=eq.${coachId}`
      },
      callback
    )
    .subscribe();
};
```

## 🚫 Error Handling

### Common Error Codes
```javascript
const COACHING_ERRORS = {
  'TRAINEE_ALREADY_ASSIGNED': 'This trainee is already assigned to a coach',
  'UNAUTHORIZED_ACCESS': 'You do not have permission to access this trainee',
  'INVALID_COACH_STATUS': 'Coach status is not valid',
  'MESSAGE_SEND_FAILED': 'Failed to send message',
  'TASK_CREATION_FAILED': 'Failed to create task'
};
```

### Rate Limiting
- **Message sending**: 50 messages per hour per coach
- **Task creation**: 20 tasks per day per coach
- **Trainee assignment**: 10 assignments per day per coach

This comprehensive coaching API enables full coach-trainee relationship management with real-time communication, task tracking, and progress monitoring capabilities.
