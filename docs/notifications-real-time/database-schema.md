
# Notifications & Real-time Features Database Schema

Comprehensive database structure for notifications, real-time messaging, and live updates in React Native/Expo app.

## 📱 Notification Tables

### `user_notifications` - In-App Notifications
```sql
CREATE TABLE user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  
  -- Notification Content
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL, -- 'info', 'success', 'warning', 'error', 'achievement', 'reminder'
  category text NOT NULL, -- 'meal_plan', 'workout', 'progress', 'social', 'system', 'coach'
  
  -- Rich Content
  image_url text,
  icon text, -- Icon name/identifier
  color text, -- Hex color for notification
  
  -- Action & Navigation
  action_type text, -- 'navigate', 'deep_link', 'external', 'modal'
  action_url text, -- Deep link or route
  action_data jsonb DEFAULT '{}', -- Additional action parameters
  cta_text text, -- Call-to-action button text
  
  -- Notification Metadata
  priority text DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  scheduled_for timestamptz, -- For scheduled notifications
  expires_at timestamptz, -- Auto-dismiss time
  
  -- Delivery Status
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamptz,
  is_delivered boolean DEFAULT false,
  delivered_at timestamptz,
  delivery_attempts integer DEFAULT 0,
  
  -- Push Notification Data
  push_sent boolean DEFAULT false,
  push_token text, -- FCM/APNs token used
  push_response jsonb, -- Response from push service
  
  -- Analytics
  opened boolean DEFAULT false,
  opened_at timestamptz,
  action_taken boolean DEFAULT false,
  action_taken_at timestamptz,
  
  -- Grouping & Threading
  group_id text, -- For grouping related notifications
  thread_id text, -- For notification threads
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for efficient notification queries
CREATE INDEX idx_user_notifications_user_unread 
ON user_notifications(user_id, is_read, created_at DESC);

CREATE INDEX idx_user_notifications_category 
ON user_notifications(user_id, category, created_at DESC);

CREATE INDEX idx_user_notifications_scheduled 
ON user_notifications(scheduled_for) 
WHERE scheduled_for IS NOT NULL AND is_delivered = false;
```

### `push_notification_tokens` - Device Token Management
```sql
CREATE TABLE push_notification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  
  -- Token Information
  token text NOT NULL UNIQUE,
  platform text NOT NULL, -- 'ios', 'android', 'web'
  token_type text NOT NULL, -- 'fcm', 'apns', 'web_push'
  
  -- Device Information
  device_id text NOT NULL,
  device_name text,
  device_model text,
  os_version text,
  app_version text,
  
  -- Token Status
  is_active boolean DEFAULT true,
  is_valid boolean DEFAULT true,
  last_used_at timestamptz DEFAULT now(),
  validation_attempts integer DEFAULT 0,
  last_error text,
  
  -- Settings
  notification_settings jsonb DEFAULT '{}',
  timezone text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, device_id)
);

-- Index for token lookups
CREATE INDEX idx_push_tokens_user_active 
ON push_notification_tokens(user_id, is_active, is_valid);
```

### `notification_templates` - Reusable Notification Templates
```sql
CREATE TABLE notification_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Template Identification
  template_key text NOT NULL UNIQUE,
  template_name text NOT NULL,
  category text NOT NULL,
  
  -- Template Content (with placeholders)
  title_template text NOT NULL,
  message_template text NOT NULL,
  
  -- Localization
  localized_content jsonb DEFAULT '{}', -- Translations for different languages
  
  -- Default Settings
  default_type text DEFAULT 'info',
  default_priority text DEFAULT 'normal',
  default_action_type text,
  default_icon text,
  default_color text,
  
  -- Template Configuration
  required_variables text[] DEFAULT '{}',
  optional_variables text[] DEFAULT '{}',
  validation_schema jsonb,
  
  -- Status
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default templates
INSERT INTO notification_templates (template_key, template_name, category, title_template, message_template, default_type, default_icon) VALUES
('meal_plan_ready', 'Meal Plan Ready', 'meal_plan', 'Your meal plan is ready!', 'Your personalized meal plan for {{week_date}} has been generated.', 'success', 'chef-hat'),
('workout_reminder', 'Workout Reminder', 'workout', 'Time to workout!', 'Your {{workout_type}} workout is scheduled for now.', 'reminder', 'dumbbell'),
('goal_achieved', 'Goal Achievement', 'progress', 'Congratulations!', 'You achieved your {{goal_name}} goal!', 'achievement', 'trophy'),
('coach_message', 'Coach Message', 'coach', 'Message from {{coach_name}}', '{{message}}', 'info', 'message-circle');
```

## 💬 Real-time Messaging Tables

### `chat_rooms` - Chat Room Management
```sql
CREATE TABLE chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Room Information
  name text,
  description text,
  room_type text NOT NULL, -- 'direct', 'group', 'coach_trainee', 'support'
  
  -- Participants
  created_by uuid NOT NULL REFERENCES profiles(id),
  participant_ids uuid[] NOT NULL, -- Array of user IDs
  max_participants integer DEFAULT 2,
  
  -- Room Settings
  is_private boolean DEFAULT true,
  allow_file_sharing boolean DEFAULT true,
  allow_voice_messages boolean DEFAULT true,
  auto_delete_after_days integer, -- Auto-delete messages after X days
  
  -- Room Status
  is_active boolean DEFAULT true,
  is_archived boolean DEFAULT false,
  
  -- Metadata
  last_message_at timestamptz DEFAULT now(),
  last_message_preview text,
  unread_count_cache jsonb DEFAULT '{}', -- Cache unread counts per user
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for user's chat rooms
CREATE INDEX idx_chat_rooms_participants 
ON chat_rooms USING gin(participant_ids);
```

### `chat_messages` - Real-time Messages
```sql
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES chat_rooms(id),
  sender_id uuid NOT NULL REFERENCES profiles(id),
  
  -- Message Content
  message_type text DEFAULT 'text', -- 'text', 'image', 'file', 'voice', 'system', 'ai_response'
  content text NOT NULL,
  formatted_content jsonb, -- Rich text formatting, mentions, etc.
  
  -- Media Attachments
  attachments jsonb DEFAULT '[]', -- Array of attachment objects
  
  -- Message Features
  reply_to_message_id uuid REFERENCES chat_messages(id),
  is_edited boolean DEFAULT false,
  edited_at timestamptz,
  edit_history jsonb DEFAULT '[]',
  
  -- AI Integration
  ai_generated boolean DEFAULT false,
  ai_model text, -- AI model used if applicable
  ai_context jsonb, -- Context data for AI responses
  
  -- Message Status
  is_deleted boolean DEFAULT false,
  deleted_at timestamptz,
  deleted_by uuid REFERENCES profiles(id),
  
  -- Read Receipts
  read_by jsonb DEFAULT '{}', -- Object with user_id: timestamp
  delivered_to jsonb DEFAULT '{}', -- Delivery confirmations
  
  -- Reactions
  reactions jsonb DEFAULT '{}', -- Object with emoji: [user_ids]
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for message queries
CREATE INDEX idx_chat_messages_room_time 
ON chat_messages(room_id, created_at DESC);

CREATE INDEX idx_chat_messages_sender 
ON chat_messages(sender_id, created_at DESC);
```

### `typing_indicators` - Real-time Typing Status
```sql
CREATE TABLE typing_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text NOT NULL,
  user_id uuid NOT NULL REFERENCES profiles(id),
  is_typing boolean DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  UNIQUE(room_id, user_id)
);

-- Index for cleanup
CREATE INDEX idx_typing_indicators_updated 
ON typing_indicators(updated_at);
```

### `user_presence` - Online Status Tracking
```sql
CREATE TABLE user_presence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) UNIQUE,
  
  -- Presence Status
  status text DEFAULT 'offline', -- 'online', 'away', 'busy', 'offline'
  custom_status text,
  status_emoji text,
  
  -- Activity Information
  last_seen timestamptz DEFAULT now(),
  current_activity text, -- 'browsing', 'in_workout', 'meal_planning', 'chatting'
  active_room_id uuid REFERENCES chat_rooms(id),
  
  -- Device Information
  device_type text, -- 'mobile', 'web', 'tablet'
  platform text, -- 'ios', 'android', 'web'
  app_version text,
  
  -- Presence Settings
  show_online_status boolean DEFAULT true,
  auto_away_minutes integer DEFAULT 5,
  
  updated_at timestamptz DEFAULT now()
);
```

## 🔔 Notification Preferences

### `notification_preferences` - Granular Notification Control
```sql
CREATE TABLE notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) UNIQUE,
  
  -- Global Settings
  notifications_enabled boolean DEFAULT true,
  push_notifications_enabled boolean DEFAULT true,
  email_notifications_enabled boolean DEFAULT true,
  in_app_notifications_enabled boolean DEFAULT true,
  
  -- Category Preferences
  meal_plan_notifications boolean DEFAULT true,
  workout_notifications boolean DEFAULT true,
  progress_notifications boolean DEFAULT true,
  coach_notifications boolean DEFAULT true,
  social_notifications boolean DEFAULT true,
  system_notifications boolean DEFAULT true,
  marketing_notifications boolean DEFAULT false,
  
  -- Timing Preferences
  quiet_hours_enabled boolean DEFAULT false,
  quiet_hours_start time DEFAULT '22:00',
  quiet_hours_end time DEFAULT '08:00',
  timezone text DEFAULT 'UTC',
  
  -- Delivery Preferences
  group_similar_notifications boolean DEFAULT true,
  max_notifications_per_hour integer DEFAULT 10,
  summary_digest_enabled boolean DEFAULT true,
  digest_frequency text DEFAULT 'daily', -- 'daily', 'weekly', 'never'
  
  -- Sound & Vibration
  sound_enabled boolean DEFAULT true,
  vibration_enabled boolean DEFAULT true,
  custom_sound text,
  
  -- Specific Reminders
  meal_reminders boolean DEFAULT true,
  water_reminders boolean DEFAULT true,
  workout_reminders boolean DEFAULT true,
  bedtime_reminders boolean DEFAULT false,
  medication_reminders boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 🏗️ React Native Integration

### TypeScript Interfaces
```typescript
interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'reminder';
  category: 'meal_plan' | 'workout' | 'progress' | 'social' | 'system' | 'coach';
  
  // Rich content
  imageUrl?: string;
  icon?: string;
  color?: string;
  
  // Actions
  actionType?: 'navigate' | 'deep_link' | 'external' | 'modal';
  actionUrl?: string;
  actionData?: any;
  ctaText?: string;
  
  // Status
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledFor?: string;
  expiresAt?: string;
  isRead: boolean;
  readAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  
  // Analytics
  opened: boolean;
  openedAt?: string;
  actionTaken: boolean;
  actionTakenAt?: string;
  
  // Grouping
  groupId?: string;
  threadId?: string;
  
  createdAt: string;
  updatedAt: string;
}

interface ChatRoom {
  id: string;
  name?: string;
  description?: string;
  roomType: 'direct' | 'group' | 'coach_trainee' | 'support';
  createdBy: string;
  participantIds: string[];
  maxParticipants: number;
  isPrivate: boolean;
  allowFileSharing: boolean;
  allowVoiceMessages: boolean;
  autoDeleteAfterDays?: number;
  isActive: boolean;
  isArchived: boolean;
  lastMessageAt: string;
  lastMessagePreview?: string;
  unreadCountCache: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  messageType: 'text' | 'image' | 'file' | 'voice' | 'system' | 'ai_response';
  content: string;
  formattedContent?: any;
  attachments: Attachment[];
  replyToMessageId?: string;
  isEdited: boolean;
  editedAt?: string;
  editHistory: any[];
  aiGenerated: boolean;
  aiModel?: string;
  aiContext?: any;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  readBy: Record<string, string>;
  deliveredTo: Record<string, string>;
  reactions: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
}

interface UserPresence {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  customStatus?: string;
  statusEmoji?: string;
  lastSeen: string;
  currentActivity?: string;
  activeRoomId?: string;
  deviceType: 'mobile' | 'web' | 'tablet';
  platform: 'ios' | 'android' | 'web';
  appVersion: string;
  showOnlineStatus: boolean;
  autoAwayMinutes: number;
  updatedAt: string;
}
```

## 🔄 Real-time Database Functions

### Send Notification
```sql
CREATE OR REPLACE FUNCTION send_notification(
  user_id_param uuid,
  template_key_param text,
  variables_param jsonb DEFAULT '{}',
  schedule_for_param timestamptz DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  template_record RECORD;
  notification_id uuid;
  processed_title text;
  processed_message text;
  variable_key text;
  variable_value text;
BEGIN
  -- Get template
  SELECT * INTO template_record FROM notification_templates 
  WHERE template_key = template_key_param AND is_active = true;
  
  IF template_record IS NULL THEN
    RAISE EXCEPTION 'Notification template not found: %', template_key_param;
  END IF;
  
  -- Process template variables
  processed_title := template_record.title_template;
  processed_message := template_record.message_template;
  
  -- Replace variables in title and message
  FOR variable_key, variable_value IN SELECT * FROM jsonb_each_text(variables_param)
  LOOP
    processed_title := replace(processed_title, '{{' || variable_key || '}}', variable_value);
    processed_message := replace(processed_message, '{{' || variable_key || '}}', variable_value);
  END LOOP;
  
  -- Insert notification
  INSERT INTO user_notifications (
    user_id, title, message, type, category,
    icon, color, priority, scheduled_for,
    action_type, action_data
  ) VALUES (
    user_id_param,
    processed_title,
    processed_message,
    template_record.default_type,
    template_record.category,
    template_record.default_icon,
    template_record.default_color,
    template_record.default_priority,
    schedule_for_param,
    template_record.default_action_type,
    variables_param
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Update User Presence
```sql
CREATE OR REPLACE FUNCTION update_user_presence(
  user_id_param uuid,
  status_param text DEFAULT 'online',
  activity_param text DEFAULT NULL,
  room_id_param uuid DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO user_presence (
    user_id, status, current_activity, active_room_id, updated_at
  ) VALUES (
    user_id_param, status_param, activity_param, room_id_param, now()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    status = status_param,
    current_activity = activity_param,
    active_room_id = room_id_param,
    last_seen = CASE WHEN status_param = 'offline' THEN now() ELSE user_presence.last_seen END,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

This comprehensive notification and real-time schema provides robust push notifications, in-app messaging, presence tracking, and real-time communication features for React Native applications.
