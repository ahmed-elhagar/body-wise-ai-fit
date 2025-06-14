
// Unified chat message type for coach-trainee communication
export interface CoachChatMessage {
  id: string;
  message: string;
  sender_type: 'coach' | 'trainee';
  sender_id: string;
  created_at: string;
  updated_at?: string;
  is_read: boolean;
  sender_name?: string;
}

// Type for message actions
export interface MessageAction {
  messageId: string;
  newContent?: string;
}
