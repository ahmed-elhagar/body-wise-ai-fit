
export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  sender_type: 'coach' | 'trainee';
  created_at: string;
  is_read: boolean;
}

export interface ChatRoom {
  id: string;
  coach_id: string;
  trainee_id: string;
  last_message?: ChatMessage;
  unread_count: number;
}

export interface TypingIndicator {
  user_id: string;
  is_typing: boolean;
  chat_room_id: string;
}
