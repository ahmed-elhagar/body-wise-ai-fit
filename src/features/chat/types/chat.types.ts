
export interface ChatMessage {
  id: string;
  content: string;
  sender_type: 'user' | 'ai' | 'coach' | 'trainee';
  created_at: string;
  sender_id?: string;
  metadata?: any;
}

export interface ConversationContext {
  userId: string;
  conversationId?: string;
  feature?: string;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  metadata?: any;
}
