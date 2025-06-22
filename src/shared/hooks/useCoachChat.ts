
export interface ChatMessage {
  id: string;
  message: string;
  sender_id: string;
  sender_name?: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
}

export const useCoachChat = () => {
  // Mock implementation for now
  return {
    messages: [] as ChatMessage[],
    isLoading: false,
    sendMessage: async (message: string) => {},
    markAsRead: async (messageId: string) => {}
  };
};
