
export interface CoachChatMessage {
  id: string;
  message: string;
  sender_type: 'coach' | 'trainee';
  sender_id: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  sender_name?: string;
}

export interface ChatRoom {
  id: string;
  coach_id: string;
  trainee_id: string;
  last_message?: CoachChatMessage;
  unread_count: number;
}

export interface TypingIndicator {
  user_id: string;
  is_typing: boolean;
  chat_room_id: string;
}
