
# Real-time API

WebSocket connections and live updates for enhanced user experience.

## 🔄 Real-time Subscriptions

### Basic Subscription Setup
```javascript
// Subscribe to table changes
const subscribeToTableChanges = (table, callback, filter = null) => {
  const channel = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      {
        event: '*', // INSERT, UPDATE, DELETE, or *
        schema: 'public',
        table: table,
        filter: filter // Optional: e.g., 'user_id=eq.123'
      },
      callback
    )
    .subscribe();
    
  return channel;
};

// Cleanup subscription
const unsubscribe = (channel) => {
  supabase.removeChannel(channel);
};
```

## 💬 Chat & Messaging

### Real-time Chat Messages
```javascript
const subscribeToChatMessages = (userId, callback) => {
  return supabase
    .channel('chat-messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'coach_trainee_messages',
        filter: `trainee_id=eq.${userId} OR coach_id=eq.${userId}`
      },
      (payload) => {
        callback({
          type: 'new_message',
          message: payload.new
        });
      }
    )
    .subscribe();
};
```

### Typing Indicators
```javascript
const manageTypingIndicator = (userId, chatRoomId) => {
  let typingTimeout;
  
  const startTyping = async () => {
    await supabase
      .from('typing_indicators')
      .upsert({
        user_id: userId,
        chat_room_id: chatRoomId,
        is_typing: true,
        updated_at: new Date().toISOString()
      });
      
    // Clear previous timeout
    clearTimeout(typingTimeout);
    
    // Auto-stop typing after 3 seconds of inactivity
    typingTimeout = setTimeout(stopTyping, 3000);
  };
  
  const stopTyping = async () => {
    await supabase
      .from('typing_indicators')
      .update({ is_typing: false })
      .eq('user_id', userId)
      .eq('chat_room_id', chatRoomId);
  };
  
  // Subscribe to typing indicators from others
  const subscribeToTyping = (callback) => {
    return supabase
      .channel(`typing-${chatRoomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'typing_indicators',
          filter: `chat_room_id=eq.${chatRoomId}`
        },
        (payload) => {
          if (payload.new.user_id !== userId) {
            callback(payload.new);
          }
        }
      )
      .subscribe();
  };
  
  return { startTyping, stopTyping, subscribeToTyping };
};
```

## 🏋️ Workout Progress Updates

### Live Workout Tracking
```javascript
const subscribeToWorkoutProgress = (workoutId, callback) => {
  return supabase
    .channel(`workout-${workoutId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'exercises',
        filter: `daily_workout_id=eq.${workoutId}`
      },
      (payload) => {
        callback({
          type: 'exercise_updated',
          exercise: payload.new,
          timestamp: new Date().toISOString()
        });
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'daily_workouts',
        filter: `id=eq.${workoutId}`
      },
      (payload) => {
        callback({
          type: 'workout_updated',
          workout: payload.new,
          timestamp: new Date().toISOString()
        });
      }
    )
    .subscribe();
};
```

### Exercise Completion Broadcasting
```javascript
const broadcastExerciseCompletion = async (exerciseId, userId) => {
  // Update exercise status
  await supabase
    .from('exercises')
    .update({ 
      completed: true,
      completed_at: new Date().toISOString()
    })
    .eq('id', exerciseId);
  
  // This will automatically trigger real-time updates to subscribers
};
```

## 🍽️ Meal Plan Updates

### Live Meal Plan Changes
```javascript
const subscribeToMealPlanUpdates = (userId, callback) => {
  return supabase
    .channel(`meal-plans-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'daily_meals',
        filter: `weekly_plan_id=in.(select id from weekly_meal_plans where user_id=${userId})`
      },
      (payload) => {
        callback({
          type: 'meal_updated',
          event: payload.eventType,
          meal: payload.new || payload.old,
          timestamp: new Date().toISOString()
        });
      }
    )
    .subscribe();
};
```

## 📊 Progress Tracking Updates

### Weight Entry Updates
```javascript
const subscribeToWeightUpdates = (userId, callback) => {
  return supabase
    .channel(`weight-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'weight_entries',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        callback({
          type: 'new_weight_entry',
          entry: payload.new,
          timestamp: new Date().toISOString()
        });
      }
    )
    .subscribe();
};
```

## 🔔 Live Notifications

### Notification Broadcasting
```javascript
const subscribeToNotifications = (userId, callback) => {
  return supabase
    .channel(`notifications-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'user_notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        callback({
          type: 'new_notification',
          notification: payload.new,
          timestamp: new Date().toISOString()
        });
        
        // Optional: Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(payload.new.title, {
            body: payload.new.message,
            icon: '/favicon.ico'
          });
        }
      }
    )
    .subscribe();
};
```

### Push Notification Integration
```javascript
const setupPushNotifications = async (userId) => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const registration = await navigator.serviceWorker.register('/sw.js');
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
    });
    
    // Save subscription to database
    await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        subscription: subscription,
        created_at: new Date().toISOString()
      });
  }
};
```

## 👥 Coach-Trainee Real-time

### Coach Dashboard Updates
```javascript
const subscribeToCoachUpdates = (coachId, callback) => {
  return supabase
    .channel(`coach-dashboard-${coachId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'coach_tasks',
        filter: `coach_id=eq.${coachId}`
      },
      (payload) => {
        callback({
          type: 'task_updated',
          task: payload.new || payload.old,
          event: payload.eventType
        });
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=in.(select trainee_id from coach_trainees where coach_id=${coachId})`
      },
      (payload) => {
        callback({
          type: 'trainee_updated',
          trainee: payload.new,
          changes: payload.new
        });
      }
    )
    .subscribe();
};
```

### Trainee Progress Broadcasting
```javascript
const broadcastTraineeProgress = (traineeId, progressData) => {
  // Progress updates are automatically broadcast via database triggers
  // when weight_entries, daily_workouts, or other progress tables are updated
  
  return supabase
    .from('trainee_progress_updates')
    .insert({
      trainee_id: traineeId,
      progress_data: progressData,
      timestamp: new Date().toISOString()
    });
};
```

## 🌐 Presence System

### Online Status Tracking
```javascript
const manageUserPresence = (userId) => {
  const updatePresence = async (isOnline) => {
    await supabase.rpc('update_user_online_status', {
      user_id: userId,
      is_online: isOnline
    });
  };
  
  // Set online when user is active
  const setOnline = () => updatePresence(true);
  const setOffline = () => updatePresence(false);
  
  // Auto-detect user activity
  let activityTimer;
  const resetActivityTimer = () => {
    clearTimeout(activityTimer);
    setOnline();
    
    // Set offline after 5 minutes of inactivity
    activityTimer = setTimeout(setOffline, 5 * 60 * 1000);
  };
  
  // Listen for user activity
  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetActivityTimer, true);
  });
  
  // Set offline when page unloads
  window.addEventListener('beforeunload', setOffline);
  
  // Initial setup
  resetActivityTimer();
  
  return { setOnline, setOffline };
};
```

### Subscribe to User Presence
```javascript
const subscribeToUserPresence = (userIds, callback) => {
  return supabase
    .channel('user-presence')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=in.(${userIds.join(',')})`
      },
      (payload) => {
        if ('is_online' in payload.new || 'last_seen' in payload.new) {
          callback({
            userId: payload.new.id,
            isOnline: payload.new.is_online,
            lastSeen: payload.new.last_seen
          });
        }
      }
    )
    .subscribe();
};
```

## 🔄 Connection Management

### Connection Health Monitoring
```javascript
const monitorConnectionHealth = () => {
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;
  
  const handleConnectionLoss = () => {
    console.log('Real-time connection lost, attempting to reconnect...');
    
    if (reconnectAttempts < maxReconnectAttempts) {
      setTimeout(() => {
        reconnectAttempts++;
        // Attempt to reestablish subscriptions
        setupAllSubscriptions();
      }, Math.pow(2, reconnectAttempts) * 1000); // Exponential backoff
    }
  };
  
  const handleConnectionRestore = () => {
    console.log('Real-time connection restored');
    reconnectAttempts = 0;
  };
  
  // Monitor Supabase connection
  supabase.realtime.onOpen(() => handleConnectionRestore());
  supabase.realtime.onClose(() => handleConnectionLoss());
  supabase.realtime.onError((error) => {
    console.error('Real-time connection error:', error);
    handleConnectionLoss();
  });
};
```

### Batch Subscription Management
```javascript
const SubscriptionManager = {
  channels: new Map(),
  
  subscribe(key, channelSetup) {
    // Cleanup existing subscription
    if (this.channels.has(key)) {
      this.unsubscribe(key);
    }
    
    // Create new subscription
    const channel = channelSetup();
    this.channels.set(key, channel);
    
    return channel;
  },
  
  unsubscribe(key) {
    const channel = this.channels.get(key);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(key);
    }
  },
  
  unsubscribeAll() {
    this.channels.forEach((channel, key) => {
      this.unsubscribe(key);
    });
  }
};

// Usage
SubscriptionManager.subscribe('workout-progress', () => 
  subscribeToWorkoutProgress(workoutId, handleWorkoutUpdate)
);
```

## 📱 React Native Integration

### Background Sync
```javascript
import BackgroundTimer from 'react-native-background-timer';

const setupBackgroundSync = (userId) => {
  BackgroundTimer.runBackgroundTimer(() => {
    // Sync critical data when app is backgrounded
    syncPendingUpdates(userId);
  }, 30000); // Every 30 seconds
};

const syncPendingUpdates = async (userId) => {
  // Sync any offline changes
  const pendingUpdates = await AsyncStorage.getItem('pending_updates');
  if (pendingUpdates) {
    const updates = JSON.parse(pendingUpdates);
    for (const update of updates) {
      try {
        await supabase.from(update.table).upsert(update.data);
      } catch (error) {
        console.error('Sync error:', error);
      }
    }
    await AsyncStorage.removeItem('pending_updates');
  }
};
```

This comprehensive real-time API enables live collaboration, instant updates, and seamless user experiences across all platform features.
