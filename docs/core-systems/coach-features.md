
# FitFatta Coach Features Documentation

Comprehensive guide to the coach-trainee system for React Native/Expo implementation.

## 🏋️ System Architecture

### Overview
FitFatta's Coach Features enable fitness professionals to manage trainees, provide guidance, track progress, and communicate effectively through a comprehensive coaching platform.

### Core Components
```typescript
interface CoachSystem {
  relationshipManager: CoachTraineeManager;
  communicationSystem: ChatSystem;
  progressTracking: ProgressTracker;
  taskManagement: TaskManager;
  contentSharing: ContentSharer;
}
```

## 🗃️ Database Schema

### Coach-Trainee Relationship Tables
```sql
-- Core coach-trainee relationships
CREATE TABLE coach_trainees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES auth.users NOT NULL,
  trainee_id UUID REFERENCES auth.users NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'completed'
  notes TEXT,
  coaching_plan JSONB DEFAULT '{}',
  progress_data JSONB DEFAULT '{}',
  UNIQUE(coach_id, trainee_id)
);

-- Coach-trainee messaging system
CREATE TABLE coach_trainee_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES auth.users NOT NULL,
  trainee_id UUID REFERENCES auth.users NOT NULL,
  sender_id UUID REFERENCES auth.users NOT NULL,
  sender_type TEXT NOT NULL, -- 'coach', 'trainee'
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'image', 'file', 'voice'
  attachments JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT false,
  reply_to_id UUID REFERENCES coach_trainee_messages(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coach tasks and assignments
CREATE TABLE coach_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES auth.users NOT NULL,
  trainee_id UUID REFERENCES auth.users,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'review', 'check_in', 'plan_update', 'assessment'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trainee progress tracking
CREATE TABLE trainee_progress_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES auth.users NOT NULL,
  trainee_id UUID REFERENCES auth.users NOT NULL,
  entry_type TEXT NOT NULL, -- 'weight', 'measurement', 'photo', 'note', 'achievement'
  entry_data JSONB NOT NULL,
  coach_comments TEXT,
  visibility TEXT DEFAULT 'private', -- 'private', 'coach_only', 'shared'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coach-specific meal plan comments
CREATE TABLE meal_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_log_id UUID REFERENCES food_consumption_log(id) NOT NULL,
  coach_id UUID REFERENCES auth.users NOT NULL,
  trainee_id UUID REFERENCES auth.users NOT NULL,
  comment_type TEXT DEFAULT 'feedback', -- 'feedback', 'suggestion', 'concern'
  body TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coach notifications and alerts
CREATE TABLE coach_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES auth.users NOT NULL,
  trainee_id UUID REFERENCES auth.users,
  notification_type TEXT NOT NULL, -- 'new_trainee', 'progress_update', 'missed_checkin'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Database Functions
```sql
-- Get coach's trainees with progress summary
CREATE OR REPLACE FUNCTION get_coach_trainees_summary(
  coach_id_param UUID
) RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'relationship', ct.*,
      'trainee_profile', p.*,
      'recent_progress', recent_progress.data,
      'unread_messages', unread_count.count,
      'last_activity', last_activity.last_seen
    )
  ) INTO result
  FROM coach_trainees ct
  LEFT JOIN profiles p ON p.id = ct.trainee_id
  LEFT JOIN LATERAL (
    SELECT jsonb_agg(entry_data ORDER BY created_at DESC) as data
    FROM trainee_progress_entries tpe
    WHERE tpe.coach_id = coach_id_param 
    AND tpe.trainee_id = ct.trainee_id
    AND tpe.created_at > NOW() - INTERVAL '7 days'
  ) recent_progress ON true
  LEFT JOIN LATERAL (
    SELECT COUNT(*) as count
    FROM coach_trainee_messages ctm
    WHERE ctm.coach_id = coach_id_param
    AND ctm.trainee_id = ct.trainee_id
    AND ctm.sender_type = 'trainee'
    AND ctm.is_read = false
  ) unread_count ON true
  LEFT JOIN LATERAL (
    SELECT p.last_seen
    FROM profiles p
    WHERE p.id = ct.trainee_id
  ) last_activity ON true
  WHERE ct.coach_id = coach_id_param 
  AND ct.status = 'active';
  
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get trainee's coaches (supports multiple coaches)
CREATE OR REPLACE FUNCTION get_trainee_coaches_info(
  trainee_id_param UUID
) RETURNS JSONB AS $$
DECLARE
  result JSONB;
  total_unread INTEGER;
BEGIN
  -- Get total unread messages from all coaches
  SELECT COALESCE(SUM(
    CASE WHEN ctm.sender_type = 'coach' AND ctm.is_read = false THEN 1 ELSE 0 END
  ), 0) INTO total_unread
  FROM coach_trainee_messages ctm
  WHERE ctm.trainee_id = trainee_id_param;
  
  -- Get coaches with details
  SELECT jsonb_build_object(
    'coaches', jsonb_agg(
      jsonb_build_object(
        'relationship', ct.*,
        'coach_profile', p.*,
        'unread_messages', unread_count.count,
        'last_message', last_msg.message_data
      )
    ),
    'total_unread_messages', total_unread,
    'total_coaches', COUNT(*),
    'active_coaches', COUNT(CASE WHEN ct.status = 'active' THEN 1 END)
  ) INTO result
  FROM coach_trainees ct
  LEFT JOIN profiles p ON p.id = ct.coach_id
  LEFT JOIN LATERAL (
    SELECT COUNT(*) as count
    FROM coach_trainee_messages ctm
    WHERE ctm.coach_id = ct.coach_id
    AND ctm.trainee_id = trainee_id_param
    AND ctm.sender_type = 'coach'
    AND ctm.is_read = false
  ) unread_count ON true
  LEFT JOIN LATERAL (
    SELECT jsonb_build_object(
      'message', ctm.message,
      'created_at', ctm.created_at,
      'sender_type', ctm.sender_type
    ) as message_data
    FROM coach_trainee_messages ctm
    WHERE ctm.coach_id = ct.coach_id
    AND ctm.trainee_id = trainee_id_param
    ORDER BY ctm.created_at DESC
    LIMIT 1
  ) last_msg ON true
  WHERE ct.trainee_id = trainee_id_param;
  
  RETURN COALESCE(result, jsonb_build_object(
    'coaches', '[]'::jsonb,
    'total_unread_messages', 0,
    'total_coaches', 0,
    'active_coaches', 0
  ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Send message between coach and trainee
CREATE OR REPLACE FUNCTION send_coach_message(
  coach_id_param UUID,
  trainee_id_param UUID,
  sender_id_param UUID,
  message_param TEXT,
  message_type_param TEXT DEFAULT 'text',
  attachments_param JSONB DEFAULT '[]'
) RETURNS UUID AS $$
DECLARE
  message_id UUID;
  sender_type_val TEXT;
BEGIN
  -- Determine sender type
  sender_type_val := CASE 
    WHEN sender_id_param = coach_id_param THEN 'coach'
    WHEN sender_id_param = trainee_id_param THEN 'trainee'
    ELSE 'unknown'
  END;
  
  -- Insert message
  INSERT INTO coach_trainee_messages (
    coach_id, trainee_id, sender_id, sender_type,
    message, message_type, attachments
  ) VALUES (
    coach_id_param, trainee_id_param, sender_id_param, sender_type_val,
    message_param, message_type_param, attachments_param
  ) RETURNING id INTO message_id;
  
  -- Update relationship timestamp
  UPDATE coach_trainees 
  SET updated_at = NOW()
  WHERE coach_id = coach_id_param AND trainee_id = trainee_id_param;
  
  RETURN message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 👨‍💼 Coach Management System

### Coach Dashboard Hook
```typescript
// src/hooks/coach/useCoachDashboard.ts
export const useCoachDashboard = () => {
  const { user } = useAuth();
  const { isCoach, isAdmin } = useRole();
  
  // Get trainees summary
  const { data: traineesData, isLoading: isLoadingTrainees, refetch } = useQuery({
    queryKey: ['coach-trainees-summary', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase.rpc('get_coach_trainees_summary', {
        coach_id_param: user.id
      });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && (isCoach || isAdmin),
    refetchInterval: 30000 // Refresh every 30 seconds
  });
  
  // Get pending tasks
  const { data: pendingTasks = [] } = useQuery({
    queryKey: ['coach-pending-tasks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('coach_tasks')
        .select(`
          *,
          trainee_profile:profiles!coach_tasks_trainee_id_fkey(
            first_name, last_name, profile_completion_score
          )
        `)
        .eq('coach_id', user.id)
        .in('status', ['pending', 'in_progress'])
        .order('due_date', { ascending: true })
        .limit(10);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && (isCoach || isAdmin)
  });
  
  // Get notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ['coach-notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('coach_notifications')
        .select('*')
        .eq('coach_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && (isCoach || isAdmin)
  });
  
  // Calculate summary statistics
  const summary = useMemo(() => {
    if (!traineesData) return null;
    
    const totalTrainees = traineesData.length;
    const totalUnreadMessages = traineesData.reduce((sum, trainee) => 
      sum + (trainee.unread_messages || 0), 0
    );
    const recentlyActive = traineesData.filter(trainee => {
      const lastSeen = new Date(trainee.last_activity);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return lastSeen > oneDayAgo;
    }).length;
    
    return {
      totalTrainees,
      totalUnreadMessages,
      recentlyActive,
      pendingTasks: pendingTasks.length,
      unreadNotifications: notifications.length
    };
  }, [traineesData, pendingTasks, notifications]);
  
  return {
    trainees: traineesData || [],
    pendingTasks,
    notifications,
    summary,
    isLoading: isLoadingTrainees,
    refetch
  };
};
```

### Coach-Trainee Chat Hook
```typescript
// src/hooks/coach/useCoachChat.ts
export const useCoachChat = (coachId: string, traineeId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Get chat messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['coach-chat', coachId, traineeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .select('*')
        .eq('coach_id', coachId)
        .eq('trainee_id', traineeId)
        .order('created_at', { ascending: true })
        .limit(100);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!coachId && !!traineeId
  });
  
  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (params: {
      message: string;
      messageType?: string;
      attachments?: any[];
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.rpc('send_coach_message', {
        coach_id_param: coachId,
        trainee_id_param: traineeId,
        sender_id_param: user.id,
        message_param: params.message,
        message_type_param: params.messageType || 'text',
        attachments_param: params.attachments || []
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Refresh messages
      queryClient.invalidateQueries({ 
        queryKey: ['coach-chat', coachId, traineeId] 
      });
      
      // Refresh dashboard data
      queryClient.invalidateQueries({ 
        queryKey: ['coach-trainees-summary'] 
      });
    }
  });
  
  // Mark messages as read
  const markAsRead = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;
      
      const { error } = await supabase
        .from('coach_trainee_messages')
        .update({ is_read: true })
        .eq('coach_id', coachId)
        .eq('trainee_id', traineeId)
        .neq('sender_id', user.id) // Don't mark own messages as read
        .eq('is_read', false);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['coach-chat', coachId, traineeId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['coach-trainees-summary'] 
      });
    }
  });
  
  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`coach-chat-${coachId}-${traineeId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'coach_trainee_messages',
          filter: `coach_id=eq.${coachId} and trainee_id=eq.${traineeId}`
        },
        (payload) => {
          queryClient.invalidateQueries({ 
            queryKey: ['coach-chat', coachId, traineeId] 
          });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [coachId, traineeId, queryClient]);
  
  return {
    messages,
    isLoading,
    sendMessage: sendMessage.mutateAsync,
    markAsRead: markAsRead.mutateAsync,
    isSending: sendMessage.isPending
  };
};
```

## 💬 Coach Chat Screen

### Chat Interface Component
```typescript
// src/screens/CoachChatScreen.tsx
export const CoachChatScreen = ({ route, navigation }) => {
  const { coachId, traineeId, traineeName } = route.params;
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  const {
    messages,
    sendMessage,
    markAsRead,
    isSending
  } = useCoachChat(coachId, traineeId);
  
  // Mark messages as read when screen is focused
  useFocusEffect(
    useCallback(() => {
      markAsRead();
    }, [markAsRead])
  );
  
  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;
    
    const messageText = message.trim();
    setMessage('');
    
    try {
      await sendMessage({
        message: messageText,
        messageType: 'text'
      });
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
      setMessage(messageText);
    }
  };
  
  const renderMessage = ({ item: msg }) => {
    const isMyMessage = msg.sender_id === user?.id;
    const isCoachMessage = msg.sender_type === 'coach';
    
    return (
      <View style={[
        styles.messageBubble,
        isMyMessage ? styles.myMessage : styles.otherMessage
      ]}>
        <Text style={[
          styles.messageText,
          isMyMessage ? styles.myMessageText : styles.otherMessageText
        ]}>
          {msg.message}
        </Text>
        
        <View style={styles.messageFooter}>
          <Text style={styles.timestamp}>
            {new Date(msg.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
          
          <Text style={[
            styles.senderBadge,
            isCoachMessage ? styles.coachBadge : styles.traineeBadge
          ]}>
            {isCoachMessage ? 'Coach' : 'Trainee'}
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{traineeName}</Text>
          <Text style={styles.headerSubtitle}>Coach Chat</Text>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.navigate('TraineeProfile', { traineeId })}
        >
          <Ionicons name="person-circle-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { opacity: message.trim() && !isSending ? 1 : 0.5 }
          ]}
          onPress={handleSendMessage}
          disabled={!message.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="send" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
```

## 👤 Trainee Experience

### Multiple Coaches Support Hook
```typescript
// src/hooks/trainee/useMultipleCoaches.ts
export const useMultipleCoaches = () => {
  const { user } = useAuth();
  
  // Get coaches information
  const { data: coachesInfo, isLoading, refetch } = useQuery({
    queryKey: ['trainee-coaches', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase.rpc('get_trainee_coaches_info', {
        trainee_id_param: user.id
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    refetchInterval: 30000
  });
  
  // Get individual coach conversations
  const getCoachMessages = useCallback(async (coachId: string) => {
    if (!user?.id) return [];
    
    const { data, error } = await supabase
      .from('coach_trainee_messages')
      .select('*')
      .eq('coach_id', coachId)
      .eq('trainee_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (error) throw error;
    return data || [];
  }, [user?.id]);
  
  return {
    coaches: coachesInfo?.coaches || [],
    totalUnreadMessages: coachesInfo?.total_unread_messages || 0,
    totalCoaches: coachesInfo?.total_coaches || 0,
    activeCoaches: coachesInfo?.active_coaches || 0,
    isLoading,
    refetch,
    getCoachMessages
  };
};
```

### Coaches List Screen
```typescript
// src/screens/CoachesListScreen.tsx
export const CoachesListScreen = ({ navigation }) => {
  const { coaches, totalUnreadMessages, totalCoaches } = useMultipleCoaches();
  
  const renderCoachCard = ({ item: coach }) => {
    const profile = coach.coach_profile;
    const unreadCount = coach.unread_messages || 0;
    const lastMessage = coach.last_message;
    
    return (
      <TouchableOpacity
        style={styles.coachCard}
        onPress={() => navigation.navigate('CoachChat', {
          coachId: coach.relationship.coach_id,
          traineeId: coach.relationship.trainee_id,
          coachName: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()
        })}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.first_name?.[0] || 'C'}
            </Text>
          </View>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.coachInfo}>
          <Text style={styles.coachName}>
            {`${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Coach'}
          </Text>
          <Text style={styles.coachTitle}>Personal Coach</Text>
          
          {lastMessage && (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage.message}
            </Text>
          )}
          
          <Text style={styles.assignedDate}>
            Assigned: {new Date(coach.relationship.assigned_at).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.chevronContainer}>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>
      </TouchableOpacity>
    );
  };
  
  if (totalCoaches === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Coaches Assigned</Text>
          <Text style={styles.emptyMessage}>
            You don't have any coaches assigned yet. Contact support to get matched with a coach.
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Coaches</Text>
        {totalUnreadMessages > 0 && (
          <View style={styles.totalUnreadBadge}>
            <Text style={styles.totalUnreadText}>
              {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
            </Text>
          </View>
        )}
      </View>
      
      <FlatList
        data={coaches}
        renderItem={renderCoachCard}
        keyExtractor={(item) => item.relationship.id}
        style={styles.coachesList}
        contentContainerStyle={styles.coachesContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};
```

## 📊 Progress Tracking

### Progress Entry Hook
```typescript
// src/hooks/coach/useProgressTracking.ts
export const useProgressTracking = (traineeId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Get progress entries
  const { data: progressEntries = [], isLoading } = useQuery({
    queryKey: ['trainee-progress', traineeId],
    queryFn: async () => {
      if (!user?.id || !traineeId) return [];
      
      const { data, error } = await supabase
        .from('trainee_progress_entries')
        .select('*')
        .eq('trainee_id', traineeId)
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && !!traineeId
  });
  
  // Add progress entry
  const addProgressEntry = useMutation({
    mutationFn: async (params: {
      entryType: string;
      entryData: any;
      coachComments?: string;
      visibility?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('trainee_progress_entries')
        .insert({
          coach_id: user.id,
          trainee_id: traineeId,
          entry_type: params.entryType,
          entry_data: params.entryData,
          coach_comments: params.coachComments,
          visibility: params.visibility || 'private'
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['trainee-progress', traineeId] 
      });
    }
  });
  
  return {
    progressEntries,
    isLoading,
    addProgressEntry: addProgressEntry.mutateAsync,
    isAddingEntry: addProgressEntry.isPending
  };
};
```

## 🔔 Notifications & Task Management

### Coach Task Management
```typescript
// src/hooks/coach/useTaskManagement.ts
export const useTaskManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Create task
  const createTask = useMutation({
    mutationFn: async (params: {
      traineeId?: string;
      title: string;
      description?: string;
      type: string;
      priority?: string;
      dueDate?: Date;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('coach_tasks')
        .insert({
          coach_id: user.id,
          trainee_id: params.traineeId,
          title: params.title,
          description: params.description,
          type: params.type,
          priority: params.priority || 'medium',
          due_date: params.dueDate?.toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-pending-tasks'] });
    }
  });
  
  // Complete task
  const completeTask = useMutation({
    mutationFn: async (taskId: string) => {
      const { data, error } = await supabase
        .from('coach_tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-pending-tasks'] });
    }
  });
  
  return {
    createTask: createTask.mutateAsync,
    completeTask: completeTask.mutateAsync,
    isCreatingTask: createTask.isPending,
    isCompletingTask: completeTask.isPending
  };
};
```

This comprehensive coach features documentation provides everything needed to implement a full coaching system in React Native with relationship management, messaging, progress tracking, and task management capabilities.
